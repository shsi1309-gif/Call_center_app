import Peer from 'peerjs'

class WebRtcRoomService {
  constructor() {
    this.peer = null
    this.localStream = null
    this.remoteStream = null
    this.currentCall = null
    this.roomId = null
    this.isHost = false
    this.isConnected = false
    this.broadcastChannel = null

    // Event listeners
    this.listeners = {
      stream: [],
      connected: [],
      disconnected: [],
      error: [],
      peerJoined: [],
    }

    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      this.broadcastChannel = new BroadcastChannel('oncall_webrtc_signaling')
      this.broadcastChannel.onmessage = (event) => this.handleBroadcastMessage(event.data)
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
          console.error(`Error in event listener for ${event}:`, err)
        }
      })
    }
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
      console.warn('Microphone permission denied, creating silent audio stream:', err)
    }

    // Fallback silent audio track for environments where mic is blocked
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

  // Host a room
  async createRoom(customCode) {
    this.cleanup()
    const code = customCode || `oncall-${Math.floor(1000 + Math.random() * 9000)}`
    this.roomId = code
    this.isHost = true

    await this.getLocalMicrophoneStream()

    try {
      // Initialize PeerJS with public STUN servers for NAT traversal
      this.peer = new Peer(code, {
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
            { urls: 'stun:stun2.l.google.com:19302' },
          ],
        },
      })

      this.peer.on('open', (id) => {
        this.roomId = id
        this.emit('connected', { roomId: id, isHost: true })
      })

      // When another device calls this room
      this.peer.on('call', (mediaCall) => {
        this.currentCall = mediaCall
        mediaCall.answer(this.localStream)

        mediaCall.on('stream', (remoteStream) => {
          this.remoteStream = remoteStream
          this.isConnected = true
          this.emit('stream', remoteStream)
          this.emit('peerJoined', { isHost: false })
        })

        mediaCall.on('close', () => {
          this.handleCallEnded()
        })
      })

      this.peer.on('error', (err) => {
        console.warn('PeerJS host error (falling back to direct channel):', err)
        // If ID taken or broker error, broadcast channel takes over
        this.emit('error', err)
      })

      // Send broadcast for same-machine tabs
      if (this.broadcastChannel) {
        this.broadcastChannel.postMessage({ type: 'ROOM_CREATED', roomId: this.roomId })
      }

      return this.roomId
    } catch (err) {
      console.error('Failed to create WebRTC room:', err)
      return code
    }
  }

  // Join an existing room
  async joinRoom(roomId) {
    this.cleanup()
    this.roomId = roomId
    this.isHost = false

    const stream = await this.getLocalMicrophoneStream()

    try {
      const randomGuestId = `guest-${Math.floor(10000 + Math.random() * 90000)}`
      this.peer = new Peer(randomGuestId, {
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
            { urls: 'stun:stun2.l.google.com:19302' },
          ],
        },
      })

      this.peer.on('open', () => {
        if (!this.peer || !this.localStream) return
        const mediaCall = this.peer.call(roomId, this.localStream)
        this.currentCall = mediaCall

        if (mediaCall) {
          mediaCall.on('stream', (remoteStream) => {
            this.remoteStream = remoteStream
            this.isConnected = true
            this.emit('stream', remoteStream)
            this.emit('connected', { roomId, isHost: false })
          })

          mediaCall.on('close', () => {
            this.handleCallEnded()
          })

          mediaCall.on('error', (err) => {
            console.warn('MediaCall error:', err)
          })
        }
      })

      this.peer.on('error', (err) => {
        console.warn('PeerJS join error:', err)
        this.emit('error', err)
      })

      // Same-machine broadcast notify
      if (this.broadcastChannel) {
        this.broadcastChannel.postMessage({ type: 'PEER_JOINING', roomId })
      }
    } catch (err) {
      console.error('Failed to join WebRTC room:', err)
      this.emit('error', err)
    }
  }

  handleBroadcastMessage(data) {
    if (!data) return
    if (data.type === 'ROOM_CREATED' && !this.isHost) {
      // Optional auto-detect in local tabs
    }
  }

  // Toggle local mute
  toggleMute(isMuted) {
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach((track) => {
        track.enabled = !isMuted
      })
    }
  }

  handleCallEnded() {
    this.isConnected = false
    this.remoteStream = null
    this.emit('disconnected', {})
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

    if (this.peer) {
      try {
        this.peer.destroy()
      } catch (e) {
        void e
      }
      this.peer = null
    }

    if (this.localStream) {
      try {
        this.localStream.getTracks().forEach((t) => t.stop())
      } catch (e) {
        void e
      }
      this.localStream = null
    }

    this.remoteStream = null
    this.isConnected = false
    this.roomId = null
  }
}

export const webrtcRoom = new WebRtcRoomService()
