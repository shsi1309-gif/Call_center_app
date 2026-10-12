// Telephony and AI Voice Configuration
// Configured with Vapi credentials for real WebRTC voice AI calling and call-centre telephony.

const DEFAULT_CONFIG = {
  vapiPublicKey: 'affb096d-8be5-4554-a320-f2920f64e166',
  vapiPrivateKey: '904b623d-6f8c-46ed-a416-03d6b7f6e849',
  vapiAssistantId: '94354921-6e0a-4533-a7b0-68acfbadf50f',
  vapiPhoneNumberId: 'b24991ea-c7f2-4608-bb3d-8dfc113192d0',
  callCentreNumber: '+91 80 9578 1284',
  defaultCustomerPhone: '+91 93805 41855',
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
