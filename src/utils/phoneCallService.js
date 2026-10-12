// Call Centre Web-to-Phone Telephony Service
// Routes WebRTC calls strictly by E.164 phone numbers (the way a call centre works, not peer IDs).
import { getTelephonyConfig } from './telephonyConfig'

let PeerClass = null
async function getPeerClass() {
  if (!PeerClass) {
    const mod = await import('peerjs')
    PeerClass = mod.default?.default || mod.default || mod
  }
  return PeerClass
}

export function sanitizePhoneNumber(phone) {
  if (!phone) return ''
  return phone.replace(/[^\d]/g, '')
}

export function formatPhoneNumber(phone) {
  const digits = sanitizePhoneNumber(phone)
  if (digits.length === 10) {
    return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`
  }
  if (digits.length === 12 && digits.startsWith('91')) {
    return `+91 ${digits.slice(2, 7)} ${digits.slice(7)}`
  }
  return phone
}

class PhoneCallService {
  constructor() {
    this.agentPeer = null
    this.customerPeer = null
    this.currentCall = null
    this.localStream = null
    this.remoteStream = null
    this.activeTargetPhone = null
    this.registeredPhone = null
    this.broadcastChannel = null

    this.listeners = {
      incomingCall: [],
      callConnected: [],
      callEnded: [],
      remoteStream: [],
      error: [],
      incomingIvrTransfer: [],
      ivrTransferAccepted: [],
    }

    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      this.broadcastChannel = new BroadcastChannel('oncall_telephony_channel')
      this.broadcastChannel.onmessage = (event) => this.handleBroadcast(event.data)
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
          console.error(`Error in PhoneCallService listener ${event}:`, err)
        }
      })
    }
  }

  handleBroadcast(data) {
    if (!data) return

    if (data.type === 'INCOMING_PHONE_CALL') {
      const myPhone = sanitizePhoneNumber(this.registeredPhone)
      const targetPhone = sanitizePhoneNumber(data.targetPhone)
      if (myPhone && targetPhone && myPhone === targetPhone) {
        this.emit('incomingCall', {
          callerPhone: data.callerPhone,
          callerName: data.callerName,
          targetPhone: data.targetPhone,
        })
      }
    } else if (data.type === 'PHONE_CALL_ACCEPTED') {
      const targetPhone = sanitizePhoneNumber(data.targetPhone)
      if (this.activeTargetPhone && sanitizePhoneNumber(this.activeTargetPhone) === targetPhone) {
        this.emit('callConnected', { targetPhone })
      }
    } else if (data.type === 'INCOMING_IVR_TRANSFER') {
      this.emit('incomingIvrTransfer', {
        customerPhone: data.customerPhone,
        customerName: data.customerName,
        reason: data.reason || 'IVR Option 2: Human Customer Expert',
      })
    } else if (data.type === 'IVR_TRANSFER_ACCEPTED') {
      this.emit('ivrTransferAccepted', {
        customerPhone: data.customerPhone,
      })
    } else if (data.type === 'PHONE_CALL_ENDED') {
      this.emit('callEnded', { reason: 'remote_hangup' })
    }
  }

  // Transfer an IVR call from customer to live human agent
  transferToAgent(customerPhone = '+91 93805 41855', customerName = 'Shivam Singh') {
    const payload = {
      type: 'INCOMING_IVR_TRANSFER',
      customerPhone,
      customerName,
      reason: 'IVR Transfer · Option 2: Human Customer Expert',
    }
    if (this.broadcastChannel) {
      this.broadcastChannel.postMessage(payload)
    }
    this.emit('incomingIvrTransfer', payload)
  }

  // Agent accepts the IVR transfer
  acceptIvrTransfer(customerPhone = '+91 93805 41855') {
    const payload = {
      type: 'IVR_TRANSFER_ACCEPTED',
      customerPhone,
    }
    if (this.broadcastChannel) {
      this.broadcastChannel.postMessage(payload)
    }
    this.emit('ivrTransferAccepted', payload)
  }

  // Get local user microphone
  async getLocalMicrophoneStream() {
    if (this.localStream) return this.localStream

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
          video: false,
        })
        this.localStream = stream
        return stream
      }
    } catch (err) {
      console.warn('Microphone permission denied, creating audio stream synthesizer:', err)
    }

    // Audio stream synthesis for environments where mic is blocked
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext
      if (AudioCtx) {
        const ctx = new AudioCtx()
        const osc = ctx.createOscillator()
        const dst = ctx.createMediaStreamDestination()
        osc.connect(dst)
        osc.start()
        this.localStream = dst.stream
        return this.localStream
      }
    } catch (e) {
      void e
    }

    return null
  }

  // Register this browser/device to receive calls at a specific phone number
  async registerCustomerPhone(phoneNumber) {
    const digits = sanitizePhoneNumber(phoneNumber) || '9380541855'
    if (this.customerPeer && !this.customerPeer.destroyed && sanitizePhoneNumber(this.registeredPhone) === digits) {
      return true
    }
    this.registeredPhone = phoneNumber
    const peerPhoneId = `tel-in-${digits}`

    await this.getLocalMicrophoneStream()

    if (this.customerPeer) {
      try {
        this.customerPeer.destroy()
      } catch (e) {
        void e
      }
    }

    try {
      const Peer = await getPeerClass()
      this.customerPeer = new Peer(peerPhoneId, {
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
            { urls: 'stun:stun2.l.google.com:19302' },
          ],
        },
      })

      this.customerPeer.on('call', (mediaCall) => {
        this.currentCall = mediaCall
        this.emit('incomingCall', {
          callerPhone: getTelephonyConfig().callCentreNumber,
          callerName: 'On-Ground.ai Call Centre',
          targetPhone: phoneNumber,
          mediaCall,
        })
      })

      this.customerPeer.on('error', (err) => {
        console.warn('Customer phone peer notice:', err)
      })

      return true
    } catch (err) {
      console.error('Failed to register customer phone:', err)
      return false
    }
  }

  // Answer an incoming call on the customer's phone
  answerCall(mediaCall) {
    const callToAnswer = mediaCall || this.currentCall
    if (!callToAnswer) return

    callToAnswer.answer(this.localStream)

    callToAnswer.on('stream', (remoteStream) => {
      this.remoteStream = remoteStream
      this.emit('remoteStream', remoteStream)
      this.emit('callConnected', { targetPhone: this.registeredPhone })
    })

    callToAnswer.on('close', () => {
      this.cleanup()
      this.emit('callEnded', { reason: 'closed' })
    })

    if (this.broadcastChannel) {
      this.broadcastChannel.postMessage({
        type: 'PHONE_CALL_ACCEPTED',
        targetPhone: this.registeredPhone,
      })
    }
  }

  // Dial a phone number from the Call Centre Agent softphone
  async dialPhoneNumber(phoneNumber, callerName = 'Agent Desk') {
    const config = getTelephonyConfig()
    const digits = sanitizePhoneNumber(phoneNumber)
    this.activeTargetPhone = phoneNumber
    const targetPeerId = `tel-in-${digits}`
    const agentPhoneId = `agent-${Math.floor(10000 + Math.random() * 90000)}`

    await this.getLocalMicrophoneStream()

    const incomingPayload = {
      callerPhone: config.callCentreNumber,
      callerName,
      targetPhone: phoneNumber,
    }

    // Broadcast incoming call event across tabs/devices
    if (this.broadcastChannel) {
      this.broadcastChannel.postMessage({
        type: 'INCOMING_PHONE_CALL',
        ...incomingPayload,
      })
    }

    // Emit locally so handset immediately rings on this same page/screen
    this.emit('incomingCall', incomingPayload)

    if (this.agentPeer) {
      try {
        this.agentPeer.destroy()
      } catch (e) {
        void e
      }
    }

    try {
      const Peer = await getPeerClass()
      this.agentPeer = new Peer(agentPhoneId, {
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
            { urls: 'stun:stun2.l.google.com:19302' },
          ],
        },
      })

      this.agentPeer.on('open', () => {
        if (!this.agentPeer || !this.localStream) return
        try {
          const mediaCall = this.agentPeer.call(targetPeerId, this.localStream)
          this.currentCall = mediaCall

          if (mediaCall) {
            mediaCall.on('stream', (remoteStream) => {
              this.remoteStream = remoteStream
              this.emit('remoteStream', remoteStream)
              this.emit('callConnected', { targetPhone: phoneNumber })
            })

            mediaCall.on('close', () => {
              this.cleanup()
              this.emit('callEnded', { reason: 'closed' })
            })
          }
        } catch (e) {
          console.warn('Call attempt:', e)
        }
      })

      this.agentPeer.on('error', (err) => {
        console.warn('Agent peer notice:', err)
      })

      return true
    } catch (err) {
      console.error('Failed to dial phone number:', err)
      return false
    }
  }

  hangUp() {
    if (this.broadcastChannel) {
      this.broadcastChannel.postMessage({
        type: 'PHONE_CALL_ENDED',
        targetPhone: this.activeTargetPhone || this.registeredPhone,
      })
    }
    this.cleanup()
    this.emit('callEnded', { reason: 'local_hangup' })
  }

  cleanup() {
    if (this.currentCall) {
      try {
        this.currentCall.close()
      } catch (e) {
        void e
      }
      this.currentCall = null
    }
    this.remoteStream = null
  }
}

export const phoneCallService = new PhoneCallService()
