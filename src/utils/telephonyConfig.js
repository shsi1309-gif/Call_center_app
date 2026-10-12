// Telephony and AI Voice Configuration
// Configured with Vapi credentials for real WebRTC voice AI calling and call-centre telephony.

const DEFAULT_CONFIG = {
  vapiPublicKey: 'affb096d-8be5-4554-a320-f2920f64e166',
  vapiPrivateKey: '904b623d-6f8c-46ed-a416-03d6b7f6e849',
  vapiAssistantId: '94354921-6e0a-4533-a7b0-68acfbadf50f',
  vapiPhoneNumberId: 'b24991ea-c7f2-4608-bb3d-8dfc113192d0',
  callCentreNumber: '+91 80 9578 1284',
  defaultCustomerPhone: '+91 93805 41855',
  // Exotel India Telephony Configuration
  exotelAccountSid: 'callcenter67',
  exotelApiKey: 'e85d062b935b53d955e5bbc31add62580945f203cac230df',
  exotelApiToken: '6ce1b19034acfe73e058f46f17dc5f903129e9f10e66081b',
  exotelCallerId: '08040265374', // Virtual ExoPhone number provided by Exotel
  exotelAppId: '1359232', // IVR call flow ID: http://my.exotel.com/callcenter67/exoml/start_voice/1359232
  exotelCluster: 'api.exotel.com', // 'api.exotel.com' or 'api.in.exotel.com'
  activeEngine: 'exotel', // 'exotel' | 'vapi' | 'webrtc'
}

export function getTelephonyConfig() {
  if (typeof window === 'undefined') return DEFAULT_CONFIG

  try {
    const saved = localStorage.getItem('oncall_telephony_config')
    if (saved) {
      const parsed = JSON.parse(saved)
      if (parsed.defaultCustomerPhone && parsed.defaultCustomerPhone.includes('63611')) {
        parsed.defaultCustomerPhone = DEFAULT_CONFIG.defaultCustomerPhone
      }
      if (parsed.callCentreNumber && parsed.callCentreNumber.includes('63611')) {
        parsed.callCentreNumber = DEFAULT_CONFIG.callCentreNumber
      }
      if (!parsed.exotelAccountSid) parsed.exotelAccountSid = DEFAULT_CONFIG.exotelAccountSid
      if (!parsed.exotelApiKey) parsed.exotelApiKey = DEFAULT_CONFIG.exotelApiKey
      if (!parsed.exotelApiToken) parsed.exotelApiToken = DEFAULT_CONFIG.exotelApiToken
      if (!parsed.exotelCallerId) parsed.exotelCallerId = DEFAULT_CONFIG.exotelCallerId
      if (!parsed.exotelAppId) parsed.exotelAppId = DEFAULT_CONFIG.exotelAppId
      return { ...DEFAULT_CONFIG, ...parsed }
    }
  } catch (e) {
    console.warn('Could not read telephony config from localStorage:', e)
  }

  return DEFAULT_CONFIG
}

export function saveTelephonyConfig(updates) {
  if (typeof window === 'undefined') return
  try {
    const current = getTelephonyConfig()
    const next = { ...current, ...updates }
    localStorage.setItem('oncall_telephony_config', JSON.stringify(next))
    window.dispatchEvent(new CustomEvent('oncall_telephony_config_changed', { detail: next }))
    return next
  } catch (e) {
    console.error('Could not save telephony config to localStorage:', e)
    return updates
  }
}
