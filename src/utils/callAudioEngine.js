// Web Audio API and Speech Synthesis / Recognition Audio Engine for OnCall
// Provides real synthesized phone tones, WebRTC audio streaming, live microphone analysis,
// and natural browser SpeechSynthesis & SpeechRecognition.

class CallAudioEngine {
  constructor() {
    this.audioCtx = null
    this.micStream = null
    this.micSource = null
    this.analyser = null
    this.dataArray = null
    this.ringInterval = null
    this.holdInterval = null
    this.isMuted = false
    this.isOnHold = false
    this.isSpeaking = false
    this.simulatedTime = 0
    this.recognition = null
    this.peerConnection = null
    this.remotePeerConnection = null
  }

  // Ensure AudioContext is initialized within a user gesture
  initAudio() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass()
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {})
    }
    if (!this.analyser && this.audioCtx) {
      this.analyser = this.audioCtx.createAnalyser()
      this.analyser.fftSize = 64
      this.analyser.smoothingTimeConstant = 0.8
      this.dataArray = new Uint8Array(this.analyser.frequencyBinCount)
    }
  }

  // Play realistic dual-frequency DTMF tone
  playDtmf(key) {
    this.initAudio()
    if (!this.audioCtx) return

    const dtmfFreqs = {
      '1': [697, 1209],
      '2': [697, 1336],
      '3': [697, 1477],
      '4': [770, 1209],
      '5': [770, 1336],
      '6': [770, 1477],
      '7': [852, 1209],
      '8': [852, 1336],
      '9': [852, 1477],
      '*': [941, 1209],
      '0': [941, 1336],
      '#': [941, 1477],
    }

    const freqs = dtmfFreqs[key] || [440, 480]
    const now = this.audioCtx.currentTime
    const osc1 = this.audioCtx.createOscillator()
    const osc2 = this.audioCtx.createOscillator()
    const gainNode = this.audioCtx.createGain()

    osc1.frequency.setValueAtTime(freqs[0], now)
    osc2.frequency.setValueAtTime(freqs[1], now)

    gainNode.gain.setValueAtTime(0.12, now)
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.18)

    osc1.connect(gainNode)
    osc2.connect(gainNode)
    gainNode.connect(this.audioCtx.destination)

    osc1.start(now)
    osc2.start(now)
    osc1.stop(now + 0.18)
    osc2.stop(now + 0.18)
  }

  // Realistic phone ringback tone (440Hz + 480Hz US/UK ring cadence)
  startRingback() {
    this.stopRingback()
    this.initAudio()
    if (!this.audioCtx) return

    const playOneRing = () => {
      if (!this.audioCtx) return
      const now = this.audioCtx.currentTime
      const osc1 = this.audioCtx.createOscillator()
      const osc2 = this.audioCtx.createOscillator()
      const gainNode = this.audioCtx.createGain()

      osc1.frequency.setValueAtTime(440, now)
      osc2.frequency.setValueAtTime(480, now)

      gainNode.gain.setValueAtTime(0, now)
      gainNode.gain.linearRampToValueAtTime(0.1, now + 0.05)
      gainNode.gain.setValueAtTime(0.1, now + 1.2)
      gainNode.gain.linearRampToValueAtTime(0, now + 1.25)

      osc1.connect(gainNode)
      osc2.connect(gainNode)
      gainNode.connect(this.audioCtx.destination)

      osc1.start(now)
      osc2.start(now)
      osc1.stop(now + 1.3)
      osc2.stop(now + 1.3)
    }

    playOneRing()
    this.ringInterval = window.setInterval(playOneRing, 3000)
  }

  stopRingback() {
    if (this.ringInterval) {
      clearInterval(this.ringInterval)
      this.ringInterval = null
    }
  }

  // Harmonic chime when call connects
  playConnectedChime() {
    this.stopRingback()
    this.initAudio()
    if (!this.audioCtx) return

    const now = this.audioCtx.currentTime
    const notes = [523.25, 659.25, 783.99, 1046.5] // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = this.audioCtx.createOscillator()
      const gain = this.audioCtx.createGain()
      const startTime = now + idx * 0.08

      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, startTime)

      gain.gain.setValueAtTime(0.08, startTime)
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.28)

      osc.connect(gain)
      gain.connect(this.audioCtx.destination)

      osc.start(startTime)
      osc.stop(startTime + 0.3)
    })
  }

  // Call termination tone
  playHangupChime() {
    this.stopRingback()
    this.stopHoldMusic()
    this.stopSpeech()
    this.initAudio()
    if (!this.audioCtx) return

    const now = this.audioCtx.currentTime
    const freqs = [480, 480, 480]
    freqs.forEach((freq, idx) => {
      const osc = this.audioCtx.createOscillator()
      const gain = this.audioCtx.createGain()
      const startTime = now + idx * 0.15

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, startTime)

      gain.gain.setValueAtTime(0.09, startTime)
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.12)

      osc.connect(gain)
      gain.connect(this.audioCtx.destination)

      osc.start(startTime)
      osc.stop(startTime + 0.13)
    })
  }

  // Synthesized hold music (pleasant soothing chord progression)
  startHoldMusic() {
    this.stopHoldMusic()
    this.initAudio()
    if (!this.audioCtx) return

    const chords = [
      [261.63, 329.63, 392.0], // C major
      [220.0, 261.63, 329.63], // A minor
      [174.61, 220.0, 261.63], // F major
      [196.0, 246.94, 293.66], // G major
    ]
    let chordIdx = 0

    const playChord = () => {
      if (!this.audioCtx || !this.isOnHold) return
      const chord = chords[chordIdx]
      chordIdx = (chordIdx + 1) % chords.length
      const now = this.audioCtx.currentTime

      chord.forEach((freq) => {
        const osc = this.audioCtx.createOscillator()
        const gain = this.audioCtx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, now)

        gain.gain.setValueAtTime(0.02, now)
        gain.gain.linearRampToValueAtTime(0.05, now + 0.4)
        gain.gain.linearRampToValueAtTime(0.005, now + 1.8)

        osc.connect(gain)
        gain.connect(this.audioCtx.destination)

        osc.start(now)
        osc.stop(now + 1.9)
      })
    }

    this.isOnHold = true
    playChord()
    this.holdInterval = window.setInterval(playChord, 2000)
  }

  stopHoldMusic() {
    this.isOnHold = false
    if (this.holdInterval) {
      clearInterval(this.holdInterval)
      this.holdInterval = null
    }
  }

  // Request real microphone access and connect to Analyser
  async startMicrophone() {
    this.initAudio()
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        })
        this.micStream = stream
        if (this.audioCtx && this.analyser) {
          this.micSource = this.audioCtx.createMediaStreamSource(stream)
          this.micSource.connect(this.analyser)
        }
        return { success: true, stream }
      } catch (err) {
        console.warn('Microphone access denied or unavailable, using audio synthesizer fallback:', err)
        return { success: false, error: err.message }
      }
    }
    return { success: false, error: 'getUserMedia not supported' }
  }

  stopMicrophone() {
    if (this.micStream) {
      this.micStream.getTracks().forEach((track) => track.stop())
      this.micStream = null
    }
    if (this.micSource) {
      try {
        this.micSource.disconnect()
      } catch (e) {
        void e
      }
      this.micSource = null
    }
  }

  // True WebRTC PeerConnection loopback demonstration
  async startWebRtcLoopback() {
    try {
      if (typeof window.RTCPeerConnection === 'undefined') return false

      const pc1 = new window.RTCPeerConnection()
      const pc2 = new window.RTCPeerConnection()

      this.peerConnection = pc1
      this.remotePeerConnection = pc2

      pc1.onicecandidate = (e) => e.candidate && pc2.addIceCandidate(e.candidate)
      pc2.onicecandidate = (e) => e.candidate && pc1.addIceCandidate(e.candidate)

      // Add local audio tracks if microphone exists, or synthetic stream
      if (this.micStream) {
        this.micStream.getTracks().forEach((track) => pc1.addTrack(track, this.micStream))
      }

      const offer = await pc1.createOffer({ offerToReceiveAudio: true })
      await pc1.setLocalDescription(offer)
      await pc2.setRemoteDescription(offer)

      const answer = await pc2.createAnswer()
      await pc2.setLocalDescription(answer)
      await pc1.setRemoteDescription(answer)

      return true
    } catch (err) {
      console.warn('WebRTC loopback setup error:', err)
      return false
    }
  }

  stopWebRtc() {
    if (this.peerConnection) {
      this.peerConnection.close()
      this.peerConnection = null
    }
    if (this.remotePeerConnection) {
      this.remotePeerConnection.close()
      this.remotePeerConnection = null
    }
  }

  // Get real-time audio visualization frequency bars (0 to 1)
  getVisualizerLevels(speakingSource = 'none') {
    this.simulatedTime += 0.08
    const numBars = 18

    // If real microphone is streaming and active
    if (this.micSource && this.analyser && this.dataArray && !this.isMuted) {
      this.analyser.getByteFrequencyData(this.dataArray)
      const bars = []
      const step = Math.max(1, Math.floor(this.dataArray.length / numBars))
      let hasRealInput = false

      for (let i = 0; i < numBars; i++) {
        const val = this.dataArray[i * step] || 0
        if (val > 15) hasRealInput = true
        bars.push(Math.min(1, Math.max(0.08, val / 255)))
      }

      if (hasRealInput) {
        return bars
      }
    }

    // Dynamic wave synthesis based on who is currently speaking
    const baseEnergy = speakingSource === 'customer' || speakingSource === 'ai' ? 0.75 : speakingSource === 'agent' ? 0.65 : 0.15
    const bars = []

    for (let i = 0; i < numBars; i++) {
      const freq1 = Math.sin(this.simulatedTime * 4 + i * 0.45)
      const freq2 = Math.cos(this.simulatedTime * 2.5 - i * 0.3)
      const freq3 = Math.sin(this.simulatedTime * 6 + i * 0.8)
      const combined = Math.abs((freq1 + freq2 + freq3) / 3)

      let height = baseEnergy * (0.2 + combined * 0.8)
      if (speakingSource === 'none') {
        height = 0.06 + Math.sin(this.simulatedTime + i * 0.5) * 0.03
      }
      bars.push(Math.min(1, Math.max(0.05, height)))
    }

    return bars
  }

  // Speak using browser SpeechSynthesis (TTS)
  speak(text, onStart, onEnd) {
    if (!('speechSynthesis' in window)) {
      onStart?.()
      setTimeout(() => onEnd?.(), 1800)
      return
    }

    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 1.05
    utterance.pitch = 1.0
    utterance.volume = 1.0

    // Pick natural voice if available
    const voices = window.speechSynthesis.getVoices()
    const preferredVoice = voices.find(
      (v) =>
        (v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Karen'))) ||
        v.lang === 'en-IN' ||
        v.lang === 'en-US',
    )
    if (preferredVoice) {
      utterance.voice = preferredVoice
    }

    utterance.onstart = () => {
      this.isSpeaking = true
      onStart?.()
    }

    utterance.onend = () => {
      this.isSpeaking = false
      onEnd?.()
    }

    utterance.onerror = () => {
      this.isSpeaking = false
      onEnd?.()
    }

    window.speechSynthesis.speak(utterance)
  }

  stopSpeech() {
    this.isSpeaking = false
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
  }

  // Start browser speech recognition if supported
  startSpeechRecognition(onResult, onError) {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRec) {
      return null
    }

    try {
      const recognition = new SpeechRec()
      recognition.continuous = true
      recognition.interimResults = false
      recognition.lang = 'en-IN'

      recognition.onresult = (event) => {
        const last = event.results.length - 1
        const transcript = event.results[last][0].transcript
        onResult?.(transcript)
      }

      recognition.onerror = (err) => {
        console.warn('Speech recognition error:', err)
        onError?.(err)
      }

      recognition.start()
      this.recognition = recognition
      return recognition
    } catch (err) {
      console.warn('Could not start speech recognition:', err)
      return null
    }
  }

  stopSpeechRecognition() {
    if (this.recognition) {
      try {
        this.recognition.stop()
      } catch (e) {
        void e
      }
      this.recognition = null
    }
  }

  cleanup() {
    this.stopRingback()
    this.stopHoldMusic()
    this.stopSpeech()
    this.stopMicrophone()
    this.stopSpeechRecognition()
    this.stopWebRtc()
    if (this.audioCtx && this.audioCtx.state !== 'closed') {
      try {
        this.audioCtx.close()
      } catch (e) {
        void e
      }
      this.audioCtx = null
    }
  }
}

export const callAudio = new CallAudioEngine()
