import { getTelephonyConfig } from './telephonyConfig'

export const ICE_SERVERS = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
  { urls: 'stun:stun2.l.google.com:19302' },
  { urls: 'stun:stun.relay.metered.ca:80' },
  {
    urls: 'turn:standard.relay.metered.ca:80',
    username: '984eb8d998ba29d639b9409d',
    credential: 'Jm8Z7hYwK6M4hL+X',
  },
  {
    urls: 'turn:standard.relay.metered.ca:443',
    username: '984eb8d998ba29d639b9409d',
    credential: 'Jm8Z7hYwK6M4hL+X',
  },
  {
    urls: 'turn:standard.relay.metered.ca:443?transport=tcp',
    username: '984eb8d998ba29d639b9409d',
    credential: 'Jm8Z7hYwK6M4hL+X',
  },
]

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
      registered: [],
    }

    this.dataConnection = null
    this.signalSource = null
    this.agentSignalSource = null
    this.remotePeerId = null

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

  // Cross-device Realtime WebSocket Signaling over wss://ntfy.sh (zero setup, works on all mobile networks)
  initCustomerSignalChannel(phoneNumber) {
    const digits = sanitizePhoneNumber(phoneNumber) || '9380541855'
    if (typeof window === 'undefined' || !('WebSocket' in window)) return

    if (this.signalWs) {
      try {
        this.signalWs.close()
      } catch (e) {
        void e
      }
      this.signalWs = null
    }

    const topic = `oncall-customer-${digits}`
    try {
      const ws = new WebSocket(`wss://ntfy.sh/${topic}/ws`)
      this.signalWs = ws

      ws.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data)
          if (parsed.event === 'message' && parsed.message) {
            const payload = JSON.parse(parsed.message)
            this.handleIncomingSignal(payload)
          }
        } catch (e) {
          void e
        }
      }

      ws.onerror = () => {
        console.warn('Customer signal WebSocket reconnecting...')
      }
    } catch (err) {
      console.warn('Could not initialize customer signal WebSocket:', err)
    }
  }

  initAgentDeskChannel() {
    if (typeof window === 'undefined' || !('WebSocket' in window)) return

    if (this.agentSignalWs) {
      try {
        this.agentSignalWs.close()
      } catch (e) {
        void e
      }
      this.agentSignalWs = null
    }

    const topic = 'oncall-helpline-desk'
    try {
      const ws = new WebSocket(`wss://ntfy.sh/${topic}/ws`)
      this.agentSignalWs = ws

      ws.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data)
          if (parsed.event === 'message' && parsed.message) {
            const payload = JSON.parse(parsed.message)
            this.handleIncomingSignal(payload)
          }
        } catch (e) {
          void e
        }
      }

      ws.onerror = () => {
        console.warn('Agent desk signal WebSocket reconnecting...')
      }
    } catch (err) {
      console.warn('Could not initialize agent desk WebSocket:', err)
    }
  }

  async publishSignal(topic, payload) {
    try {
      await fetch(`https://ntfy.sh/${topic}`, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(payload),
      })
    } catch (err) {
      console.warn('Signal publish notice:', err)
    }
  }

  handleIncomingSignal(data) {
    if (!data) return
    console.log('[Telephony Realtime Signal]', data)

    if (data.type === 'INCOMING_PHONE_CALL') {
      this.remotePeerId = data.agentPeerId
      this.emit('incomingCall', {
        callerPhone: data.callerPhone || getTelephonyConfig().callCentreNumber,
        callerName: data.callerName || 'On-Ground.ai Call Centre',
        targetPhone: data.targetPhone,
        agentPeerId: data.agentPeerId,
      })
    } else if (data.type === 'PHONE_CALL_ACCEPTED') {
      this.remotePeerId = data.customerPeerId || this.remotePeerId
      this.emit('callConnected', { targetPhone: data.targetPhone })
    } else if (data.type === 'INCOMING_IVR_TRANSFER') {
      this.emit('incomingIvrTransfer', data)
    } else if (data.type === 'IVR_TRANSFER_ACCEPTED') {
      this.emit('ivrTransferAccepted', data)
    } else if (data.type === 'PHONE_CALL_ENDED') {
      this.emit('callEnded', { reason: 'remote_hangup' })
    }
  }

  setupDataConnection(conn) {
    if (!conn) return
    this.dataConnection = conn

    conn.on('open', () => {
      console.log('PeerJS WebRTC Data Channel active between devices')
    })

    conn.on('data', (data) => {
      if (!data) return
      this.handleIncomingSignal(data)
    })

    conn.on('close', () => {
      this.dataConnection = null
    })

    conn.on('error', (err) => {
      console.warn('Data connection error:', err)
    })
  }

  sendDataMessage(payload) {
    if (this.dataConnection && this.dataConnection.open) {
      try {
        this.dataConnection.send(payload)
      } catch (err) {
        console.warn('Data connection send warning:', err)
      }
    }
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage(payload)
      } catch (err) {
        console.warn('Broadcast channel post warning:', err)
      }
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
    this.publishSignal('oncall-helpline-desk', payload)
    this.sendDataMessage(payload)
    this.emit('incomingIvrTransfer', payload)
  }

  // Agent accepts the IVR transfer
  acceptIvrTransfer(customerPhone = '+91 93805 41855') {
    const digits = sanitizePhoneNumber(customerPhone) || '9380541855'
    const payload = {
      type: 'IVR_TRANSFER_ACCEPTED',
      customerPhone,
    }
    this.publishSignal(`oncall-customer-${digits}`, payload)
    this.sendDataMessage(payload)
    this.emit('ivrTransferAccepted', payload)
  }

  // Get local user microphone
  async getLocalMicrophoneStream(forceFresh = false) {
    if (this.localStream && !forceFresh) return this.localStream

    try {
      if (typeof navigator !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
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
      console.warn('Microphone permission notice:', err)
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
    this.registeredPhone = phoneNumber
    const peerPhoneId = `tel-in-${digits}`

    // 1. Instantly subscribe to real-time incoming call signals (no mic required, zero latency)
    this.initCustomerSignalChannel(phoneNumber)

    if (this.customerPeer && !this.customerPeer.destroyed && sanitizePhoneNumber(this.registeredPhone) === digits) {
      return true
    }

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
          iceServers: ICE_SERVERS,
        },
      })

      this.customerPeer.on('open', (id) => {
        console.log(`[Telephony] Phone line registered online: ${id}`)
        this.emit('registered', { phone: phoneNumber, id })
      })

      // Cross-device WebRTC DataChannel connection
      this.customerPeer.on('connection', (conn) => {
        this.setupDataConnection(conn)
      })

      // Incoming WebRTC Media voice call
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
      console.error('Failed to register customer peer:', err)
      return true
    }
  }

  // Answer an incoming call on the customer's phone
  async answerCall(mediaCall) {
    const digits = sanitizePhoneNumber(this.registeredPhone) || '9380541855'
    const customerPeerId = `cust-${Math.floor(10000 + Math.random() * 90000)}`

    // Notify agent that phone was answered
    const acceptPayload = {
      type: 'PHONE_CALL_ACCEPTED',
      targetPhone: this.registeredPhone,
      customerPeerId,
    }
    this.publishSignal('oncall-helpline-desk', acceptPayload)

    if (!this.localStream) {
      await this.getLocalMicrophoneStream(true)
    }

    const callToAnswer = mediaCall || this.currentCall
    if (callToAnswer) {
      try {
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
      } catch (err) {
        console.error('Error answering media call:', err)
      }
    }

    this.sendDataMessage(acceptPayload)
  }

  // Dial a phone number from the Call Centre Agent softphone
  async dialPhoneNumber(phoneNumber, callerName = 'On-Ground.ai Call Centre') {
    const config = getTelephonyConfig()
    const digits = sanitizePhoneNumber(phoneNumber) || '9380541855'
    this.activeTargetPhone = phoneNumber
    const targetPeerId = `tel-in-${digits}`
    const agentPeerId = `agent-${Math.floor(10000 + Math.random() * 90000)}`

    // Ensure agent desk is listening on helpline topic
    this.initAgentDeskChannel()

    const incomingPayload = {
      type: 'INCOMING_PHONE_CALL',
      callerPhone: config.callCentreNumber,
      callerName,
      targetPhone: phoneNumber,
      agentPeerId,
      timestamp: Date.now(),
    }

    // Publish real-time ring signal directly to customer phone channel (instant cross-device delivery)
    this.publishSignal(`oncall-customer-${digits}`, incomingPayload)

    // Broadcast incoming call event across tabs/devices
    if (this.broadcastChannel) {
      this.broadcastChannel.postMessage(incomingPayload)
    }

    if (this.agentPeer) {
      try {
        this.agentPeer.destroy()
      } catch (e) {
        void e
      }
    }

    try {
      const Peer = await getPeerClass()
      this.agentPeer = new Peer(agentPeerId, {
        config: {
          iceServers: ICE_SERVERS,
        },
      })

      this.agentPeer.on('open', async () => {
        // 1. Establish cross-device data connection with phone
        try {
          const conn = this.agentPeer.connect(targetPeerId, { reliable: true })
          this.setupDataConnection(conn)
        } catch (e) {
          console.warn('Agent data connect notice:', e)
        }

        // 2. Ensure microphone audio stream is ready
        if (!this.localStream) {
          await this.getLocalMicrophoneStream()
        }

        // 3. Initiate WebRTC voice call to phone
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
          console.warn('Call attempt error:', e)
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
    const digits = sanitizePhoneNumber(this.activeTargetPhone || this.registeredPhone) || '9380541855'
    const endPayload = {
      type: 'PHONE_CALL_ENDED',
      targetPhone: this.activeTargetPhone || this.registeredPhone,
    }
    this.publishSignal(`oncall-customer-${digits}`, endPayload)
    this.publishSignal('oncall-helpline-desk', endPayload)
    this.sendDataMessage(endPayload)
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
