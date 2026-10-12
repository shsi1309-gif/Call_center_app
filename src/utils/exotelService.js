// Exotel Telephony Service for Indian Mobile PSTN Dialing
// Initiates real cellular phone calls via Exotel Voice API v1

import { getTelephonyConfig } from './telephonyConfig'

class ExotelService {
  constructor() {
    this.listeners = {}
    this.activeCall = null
  }

  on(event, callback) {
    if (!this.listeners[event]) this.listeners[event] = []
    this.listeners[event].push(callback)
  }

  off(event, callback) {
    if (!this.listeners[event]) return
    this.listeners[event] = this.listeners[event].filter((cb) => cb !== callback)
  }

  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach((cb) => {
        try {
          cb(data)
        } catch (e) {
          console.error(`Error in Exotel listener for ${event}:`, e)
        }
      })
    }
  }

  isConfigured() {
    const config = getTelephonyConfig()
    return Boolean(
      config.exotelAccountSid?.trim() &&
        config.exotelApiKey?.trim() &&
        config.exotelApiToken?.trim() &&
        config.exotelCallerId?.trim(),
    )
  }

  sanitizePhoneNumber(phoneNumber) {
    const digits = (phoneNumber || '9380541855').replace(/\D/g, '')
    if (digits.length === 10) return `0${digits}`
    if (digits.length === 12 && digits.startsWith('91')) return `0${digits.slice(2)}`
    return digits
  }

  formatE164(phoneNumber) {
    const digits = (phoneNumber || '9380541855').replace(/\D/g, '')
    if (digits.length === 10) return `+91${digits}`
    if (digits.length === 12 && digits.startsWith('91')) return `+${digits}`
    return `+91${digits}`
  }

  /**
   * Dial a real mobile phone in India via Exotel
   * @param {string} targetPhone - e.g. '9380541855' or '+91 93805 41855'
   * @param {object} options - optional agent number, app URL, or custom field
   */
  async callRealMobilePhone(targetPhone = '9380541855', options = {}) {
    const config = getTelephonyConfig()

    if (!this.isConfigured()) {
      const msg = 'Exotel credentials not fully configured. Please enter your Account SID, API Key, API Token, and ExoPhone in Telephony Settings.'
      this.emit('error', { message: msg })
      return {
        success: false,
        error: msg,
        requiresConfig: true,
      }
    }

    const customerFormatted = this.sanitizePhoneNumber(targetPhone)
    const callerIdFormatted = this.sanitizePhoneNumber(config.exotelCallerId)

    // Build flow URL if App ID is specified
    let appUrl = options.appUrl || null
    if (!appUrl && config.exotelAppId?.trim()) {
      appUrl = `http://my.exotel.com/${config.exotelAccountSid.trim()}/exoml/start_voice/${config.exotelAppId.trim()}`
    }

    this.emit('call-dialing', {
      targetPhone: customerFormatted,
      callerId: callerIdFormatted,
      appUrl,
    })

    const payload = {
      accountSid: config.exotelAccountSid.trim(),
      apiKey: config.exotelApiKey.trim(),
      apiToken: config.exotelApiToken.trim(),
      callerId: callerIdFormatted,
      from: customerFormatted,
      to: options.toPhone ? this.sanitizePhoneNumber(options.toPhone) : customerFormatted,
      appUrl: appUrl || undefined,
      cluster: config.exotelCluster || 'api.exotel.com',
      timeLimit: options.timeLimit || 3600,
      timeOut: options.timeOut || 30,
    }

    try {
      // First attempt via backend proxy /api/exotel-call (avoids browser CORS)
      const res = await fetch('/api/exotel-call', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        this.activeCall = {
          callSid: data.callSid,
          targetPhone: customerFormatted,
          status: data.status,
          startTime: Date.now(),
        }
        this.emit('call-started', this.activeCall)
        return {
          success: true,
          callSid: data.callSid,
          status: data.status,
          message: `Ringing Indian mobile phone ${this.formatE164(targetPhone)} via Exotel ExoPhone ${config.exotelCallerId}!`,
        }
      }

      // If backend returned an error
      const errorMsg = data.error || data.message || 'Exotel failed to queue outbound call'
      this.emit('error', { message: errorMsg })
      return {
        success: false,
        error: errorMsg,
        status: res.status,
        data,
      }
    } catch (err) {
      console.warn('Exotel serverless proxy unavailable, attempting direct fetch...', err)

      // Fallback: direct browser attempt (if cluster permits or via direct auth)
      try {
        const cluster = config.exotelCluster || 'api.exotel.com'
        const endpoint = `https://${cluster}/v1/Accounts/${encodeURIComponent(config.exotelAccountSid.trim())}/Calls/connect.json`
        const authHeader = `Basic ${btoa(`${config.exotelApiKey.trim()}:${config.exotelApiToken.trim()}`)}`

        const formBody = new URLSearchParams()
        formBody.append('From', customerFormatted)
        formBody.append('CallerId', callerIdFormatted)
        formBody.append('CallType', 'trans')
        if (appUrl) {
          formBody.append('Url', appUrl)
        } else {
          formBody.append('To', payload.to)
        }

        const directRes = await fetch(endpoint, {
          method: 'POST',
          headers: {
            Authorization: authHeader,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: formBody.toString(),
        })

        const directData = await directRes.json()
        if (directRes.ok) {
          return {
            success: true,
            callSid: directData.Call?.Sid,
            status: directData.Call?.Status,
            message: `Ringing ${this.formatE164(targetPhone)} via Exotel!`,
          }
        }

        return {
          success: false,
          error: directData.RestException?.Message || 'Exotel API returned an error',
          data: directData,
        }
      } catch (fallbackErr) {
        const networkError =
          'Could not reach Exotel gateway. Ensure credentials are valid and internet connection is active.'
        this.emit('error', { message: networkError, originalError: fallbackErr })
        return {
          success: false,
          error: networkError,
        }
      }
    }
  }
}

export const exotelService = new ExotelService()
