import { getTelephonyConfig } from './telephonyConfig'

class VapiService {
  constructor() {
    this.vapiInstance = null
    this.isActive = false
    this.isAssistantSpeaking = false
    this.currentAssistantId = null
    this.listeners = {
      'call-start': [],
      'call-end': [],
      'speech-start': [],
      'speech-end': [],
      'volume-level': [],
      message: [],
      error: [],
    }
  }

  on(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event].push(callback)
    }
  }

  off(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter((cb) => cb !== callback)
    }
  }

  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach((cb) => {
        try {
          cb(data)
        } catch (err) {
          console.error(`Error in VapiService listener for ${event}:`, err)
        }
      })
    }
  }

  async getVapi() {
    const config = getTelephonyConfig()
    const publicKey = config.vapiPublicKey || 'affb096d-8be5-4554-a320-f2920f64e166'

    if (!this.vapiInstance) {
      try {
        const mod = await import('@vapi-ai/web')
        const VapiConstructor = mod.default?.default || mod.default || mod
        this.vapiInstance = new VapiConstructor(publicKey)
        this.setupEventListeners(this.vapiInstance)
      } catch (err) {
        console.error('Failed to instantiate Vapi client:', err)
        throw err
      }
    }
    return this.vapiInstance
  }

  setupEventListeners(vapi) {
    vapi.on('call-start', () => {
      this.isActive = true
      this.emit('call-start')
    })

    vapi.on('call-end', () => {
      this.isActive = false
      this.isAssistantSpeaking = false
      this.emit('call-end')
    })

    vapi.on('speech-start', () => {
      this.isAssistantSpeaking = true
      this.emit('speech-start')
    })

    vapi.on('speech-end', () => {
      this.isAssistantSpeaking = false
      this.emit('speech-end')
    })

    vapi.on('volume-level', (volume) => {
      this.emit('volume-level', volume)
    })

    vapi.on('message', (message) => {
      this.emit('message', message)
    })

    vapi.on('error', (err) => {
      console.warn('Vapi Voice WebRTC notice:', err)
      this.emit('error', err)
    })
  }

  async start(overrideAssistantId) {
    const config = getTelephonyConfig()
    const assistantId = overrideAssistantId || config.vapiAssistantId || '94354921-6e0a-4533-a7b0-68acfbadf50f'
    const vapi = await this.getVapi()
    if (!vapi) {
      throw new Error('Vapi client is not available')
    }

    try {
      this.currentAssistantId = assistantId
      const res = await vapi.start(assistantId)
      this.isActive = true
      return res
    } catch (err) {
      console.error('Vapi start error:', err)
      this.isActive = false
      throw err
    }
  }

  // Dial real mobile phone over carrier cellular PSTN network
  async callRealMobilePhone(phoneNumber) {
    const config = getTelephonyConfig()
    const rawDigits = (phoneNumber || '9380541855').replace(/\D/g, '')
    const e164Number = rawDigits.startsWith('91') ? `+${rawDigits}` : `+91${rawDigits}`

    try {
      const response = await fetch('https://api.vapi.ai/call/phone', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${config.vapiPrivateKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumberId: config.vapiPhoneNumberId || 'b24991ea-c7f2-4608-bb3d-8dfc113192d0',
          assistantId: config.vapiAssistantId,
          customer: { number: e164Number },
        }),
      })
      const result = await response.json()
      return { success: response.ok, data: result }
    } catch (err) {
      console.error('Outbound phone call error:', err)
      return { success: false, error: err.message }
    }
  }

  stop() {
    if (this.vapiInstance && this.isActive) {
      try {
        this.vapiInstance.stop()
      } catch (err) {
        console.warn('Error stopping Vapi call:', err)
      }
    }
    this.isActive = false
    this.isAssistantSpeaking = false
  }

  setMuted(muted) {
    if (this.vapiInstance) {
      try {
        this.vapiInstance.setMuted(muted)
      } catch (err) {
        console.warn('Error setting Vapi mute state:', err)
      }
    }
  }
}

export const vapiService = new VapiService()
