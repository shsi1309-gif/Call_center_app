import Vapi from '@vapi-ai/web'
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

  getVapi() {
    const config = getTelephonyConfig()
    const publicKey = config.vapiPublicKey || 'affb096d-8be5-4554-a320-f2920f64e166'

    if (!this.vapiInstance) {
      try {
        const VapiConstructor = Vapi.default || Vapi
        this.vapiInstance = new VapiConstructor(publicKey)
        this.setupEventListeners(this.vapiInstance)
      } catch (err) {
        console.error('Failed to instantiate Vapi client:', err)
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
    const vapi = this.getVapi()
    if (!vapi) {
      throw new Error('Vapi client is not available')
    }

    try {
      this.currentAssistantId = assistantId
      // Start call with Vapi Assistant
      const res = await vapi.start(assistantId)
      this.isActive = true
      return res
    } catch (err) {
      console.error('Vapi start error:', err)
      this.isActive = false
      throw err
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
