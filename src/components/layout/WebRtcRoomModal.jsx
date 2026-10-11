import { useState, useEffect, useRef } from 'react'
import {
  Copy,
  Check,
  Headphones,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Radio,
  Share2,
  Users,
  Volume2,
  X,
  Sparkles,
} from 'lucide-react'
import { webrtcRoom } from '../../utils/webrtcRoomService'
import { formatTimer } from '../../utils/format'
import { useToast } from '../../context/ToastContext'

export function WebRtcRoomModal({ isOpen, onClose, initialRoomId }) {
  const toast = useToast()
  const [roomId, setRoomId] = useState(initialRoomId || '')
  const [inputCode, setInputCode] = useState('')
  const [mode, setMode] = useState(initialRoomId ? 'join' : 'host') // 'host' | 'join'
  const [peerState, setPeerState] = useState('idle') // 'idle' | 'waiting' | 'connected'
  const [copied, setCopied] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [remoteSpeakerActive, setRemoteSpeakerActive] = useState(false)
  const remoteAudioRef = useRef(null)

  // Timer
  useEffect(() => {
    if (peerState !== 'connected') return
    const id = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(id)
  }, [peerState])

  // Setup WebRTC listeners
  useEffect(() => {
    if (!isOpen) return

    const handleConnected = (data) => {
      setRoomId(data.roomId)
      if (data.isHost) {
        setPeerState('waiting')
      } else {
        setPeerState('connected')
        toast('Connected to Host! Both microphones are live.')
      }
    }

    const handlePeerJoined = () => {
      setPeerState('connected')
      toast('Second device connected! Two-way audio is now LIVE.')
    }

    const handleStream = (stream) => {
      if (remoteAudioRef.current) {
        remoteAudioRef.current.srcObject = stream
        remoteAudioRef.current.play().catch(() => {})
      }
      setRemoteSpeakerActive(true)
    }

    const handleDisconnected = () => {
      setPeerState('idle')
      toast('Call ended by remote device.')
    }

    const handleError = (err) => {
      console.warn('WebRTC Room error:', err)
      toast('Connecting peer channel...')
    }

    webrtcRoom.on('connected', handleConnected)
    webrtcRoom.on('peerJoined', handlePeerJoined)
    webrtcRoom.on('stream', handleStream)
    webrtcRoom.on('disconnected', handleDisconnected)
    webrtcRoom.on('error', handleError)

    // Auto-host if opened in host mode
    if (!initialRoomId && mode === 'host') {
      const generatedCode = `ROOM-${Math.floor(1000 + Math.random() * 9000)}`
      setRoomId(generatedCode)
      webrtcRoom.createRoom(generatedCode)
      setPeerState('waiting')
    } else if (initialRoomId) {
      setRoomId(initialRoomId)
      webrtcRoom.joinRoom(initialRoomId)
    }

    return () => {
      webrtcRoom.off('connected', handleConnected)
      webrtcRoom.off('peerJoined', handlePeerJoined)
      webrtcRoom.off('stream', handleStream)
      webrtcRoom.off('disconnected', handleDisconnected)
      webrtcRoom.off('error', handleError)
    }
  }, [isOpen, initialRoomId, mode, toast])

  if (!isOpen) return null

  const handleCopyLink = () => {
    const origin = window.location.origin
    const inviteUrl = `${origin}/?join=${roomId}`
    navigator.clipboard.writeText(inviteUrl)
    setCopied(true)
    toast('Invite link copied! Open it on your phone or another laptop to talk.')
    setTimeout(() => setCopied(false), 3000)
  }

  const handleJoinSubmit = (e) => {
    e.preventDefault()
    if (!inputCode.trim()) return
    const code = inputCode.trim().toUpperCase()
    setRoomId(code)
    setPeerState('waiting')
    webrtcRoom.joinRoom(code)
    toast(`Connecting to room ${code}...`)
  }

  const handleToggleMute = () => {
    const next = !isMuted
    setIsMuted(next)
    webrtcRoom.toggleMute(next)
    toast(next ? 'Your mic is muted' : 'Your mic is unmuted')
  }

  const handleHangUp = () => {
    webrtcRoom.cleanup()
    setPeerState('idle')
    setSeconds(0)
    onClose()
    toast('Two-way WebRTC call ended')
  }

  const inviteUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/?join=${roomId}`

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.55)',
        backdropFilter: 'blur(5px)',
        zIndex: 1100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.2s ease-out',
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Two-way WebRTC Room Call"
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '480px',
          padding: '24px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.3)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          animation: 'modalSlideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
              }}
            >
              <Users size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '17px', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                Two-Way WebRTC Room
              </h2>
              <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0 0' }}>
                Talk live between two real phones, laptops, or tabs
              </p>
            </div>
          </div>

          <button
            onClick={handleHangUp}
            style={{
              background: '#f1f5f9',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#64748b',
            }}
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Hidden Audio element for remote voice playback */}
        <audio ref={remoteAudioRef} autoPlay playsInline style={{ display: 'none' }} />

        {/* Connected Active State */}
        {peerState === 'connected' ? (
          <div
            style={{
              background: 'linear-gradient(135deg, #0f766e, #065f46)',
              borderRadius: '18px',
              padding: '24px 20px',
              color: '#fff',
              textAlign: 'center',
              boxShadow: '0 8px 24px rgba(15, 118, 110, 0.25)',
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(255, 255, 255, 0.2)',
                padding: '4px 12px',
                borderRadius: '99px',
                fontSize: '11px',
                fontWeight: 700,
                marginBottom: '10px',
              }}
            >
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#34d399',
                  boxShadow: '0 0 8px #34d399',
                }}
              />
              TWO-WAY AUDIO LIVE · OPUS 48KHZ
            </div>

            <div style={{ fontSize: '32px', fontWeight: 800, fontVariantNumeric: 'tabular-nums', marginBottom: '14px' }}>
              {formatTimer(seconds)}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '18px' }}>
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  borderRadius: '12px',
                  padding: '10px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Mic size={16} color={isMuted ? '#f87171' : '#34d399'} />
                <span style={{ fontSize: '12px', fontWeight: 600 }}>
                  You: {isMuted ? 'Muted' : 'Speaking'}
                </span>
              </div>
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  borderRadius: '12px',
                  padding: '10px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Headphones size={16} color="#60a5fa" />
                <span style={{ fontSize: '12px', fontWeight: 600 }}>Remote Peer: Live</span>
              </div>
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
              <button
                onClick={handleToggleMute}
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  background: isMuted ? '#f59e0b' : 'rgba(255, 255, 255, 0.25)',
                  border: 'none',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
              </button>
              <button
                onClick={handleHangUp}
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  background: '#ef4444',
                  border: 'none',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(239, 68, 68, 0.4)',
                }}
                title="End Call"
              >
                <PhoneOff size={20} />
              </button>
            </div>
          </div>
        ) : (
          /* Hosting / Joining State */
          <>
            {/* Mode Tabs */}
            <div
              style={{
                display: 'flex',
                background: '#f1f5f9',
                borderRadius: '12px',
                padding: '4px',
              }}
            >
              <button
                type="button"
                onClick={() => setMode('host')}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: mode === 'host' ? '#ffffff' : 'transparent',
                  color: mode === 'host' ? '#0f172a' : '#64748b',
                  boxShadow: mode === 'host' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
                }}
              >
                Host New Call
              </button>
              <button
                type="button"
                onClick={() => setMode('join')}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: mode === 'join' ? '#ffffff' : 'transparent',
                  color: mode === 'join' ? '#0f172a' : '#64748b',
                  boxShadow: mode === 'join' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
                }}
              >
                Join Existing Room
              </button>
            </div>

            {mode === 'host' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* Room Code Card */}
                <div
                  style={{
                    background: '#f8fafc',
                    border: '1.5px dashed #cbd5e1',
                    borderRadius: '16px',
                    padding: '16px',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                    YOUR ROOM CODE
                  </div>
                  <div
                    style={{
                      fontSize: '26px',
                      fontWeight: 800,
                      letterSpacing: '2px',
                      color: '#2563eb',
                      margin: '6px 0',
                    }}
                  >
                    {roomId || 'CONNECTING...'}
                  </div>
                  <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
                    Share this link with anyone on their mobile phone or laptop.
                  </p>
                </div>

                {/* Direct Link Share Button */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    readOnly
                    value={inviteUrl}
                    style={{
                      flex: 1,
                      padding: '10px 12px',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      fontSize: '12px',
                      color: '#334155',
                      background: '#f8fafc',
                    }}
                  />
                  <button
                    onClick={handleCopyLink}
                    style={{
                      padding: '10px 16px',
                      borderRadius: '10px',
                      border: 'none',
                      background: copied ? '#10b981' : '#2563eb',
                      color: '#fff',
                      fontSize: '12.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.15s ease',
                      flexShrink: 0,
                    }}
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    {copied ? 'Copied!' : 'Copy Link'}
                  </button>
                </div>

                {/* Waiting Pulsing Indicator */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    fontSize: '12.5px',
                    color: '#64748b',
                    padding: '8px',
                  }}
                >
                  <Radio size={14} color="#2563eb" className="animate-pulse" />
                  <span>Waiting for second device to connect...</span>
                </div>
              </div>
            ) : (
              /* Join Form */
              <form onSubmit={handleJoinSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '12px',
                      fontWeight: 700,
                      color: '#475569',
                      marginBottom: '6px',
                    }}
                  >
                    Enter Room Code:
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ROOM-7492"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      fontSize: '15px',
                      fontWeight: 700,
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    border: 'none',
                    background: '#2563eb',
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                  }}
                >
                  <Phone size={16} /> Connect to Audio Room
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  )
}
