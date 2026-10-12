import { useState, useEffect, useRef } from 'react'
import {
  Check,
  Copy,
  PhoneCall,
  PhoneIncoming,
  PhoneOff,
  Smartphone,
  Volume2,
  X,
} from 'lucide-react'
import { phoneCallService, formatPhoneNumber } from '../../utils/phoneCallService'
import { formatTimer } from '../../utils/format'
import { useToast } from '../../context/ToastContext'

export function CustomerPhoneModal({ isOpen, onClose, initialPhone = '+91 63611 67314' }) {
  const toast = useToast()
  const [phone] = useState(initialPhone)
  const [isRegistered, setIsRegistered] = useState(false)
  const [callState, setCallState] = useState('idle') // 'idle' | 'ringing' | 'connected'
  const [incomingCallData, setIncomingCallData] = useState(null)
  const [seconds, setSeconds] = useState(0)
  const [copied, setCopied] = useState(false)
  const remoteAudioRef = useRef(null)

  // Timer for active call
  useEffect(() => {
    if (callState !== 'connected') return
    const id = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(id)
  }, [callState])

  // Register phone number on open
  useEffect(() => {
    if (!isOpen) return

    phoneCallService
      .registerCustomerPhone(phone)
      .then((ok) => {
        setIsRegistered(ok)
        if (ok) {
          toast(`Customer phone line ${phone} is online and ready for calls.`)
        }
      })
      .catch((err) => {
        console.warn('Registration notice:', err)
      })

    const handleIncoming = (data) => {
      setIncomingCallData(data)
      setCallState('ringing')
      toast(`Incoming call from ${data.callerName || 'Call Centre'}!`)
    }

    const handleConnected = () => {
      setCallState('connected')
      toast('Call connected! Live two-way microphone audio active.')
    }

    const handleStream = (stream) => {
      if (remoteAudioRef.current) {
        remoteAudioRef.current.srcObject = stream
        remoteAudioRef.current.play().catch(() => {})
      }
    }

    const handleEnded = () => {
      setCallState('idle')
      setIncomingCallData(null)
      toast('Call ended.')
    }

    phoneCallService.on('incomingCall', handleIncoming)
    phoneCallService.on('callConnected', handleConnected)
    phoneCallService.on('remoteStream', handleStream)
    phoneCallService.on('callEnded', handleEnded)

    return () => {
      phoneCallService.off('incomingCall', handleIncoming)
      phoneCallService.off('callConnected', handleConnected)
      phoneCallService.off('remoteStream', handleStream)
      phoneCallService.off('callEnded', handleEnded)
    }
  }, [isOpen, phone, toast])

  if (!isOpen) return null

  const handleAnswer = () => {
    phoneCallService.answerCall(incomingCallData?.mediaCall)
    setCallState('connected')
  }

  const handleDecline = () => {
    phoneCallService.hangUp()
    setCallState('idle')
    setIncomingCallData(null)
  }

  const handleCopyLink = () => {
    const digits = phone.replace(/[^\d]/g, '')
    const url = `${window.location.origin}/?customerPhone=${digits}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    toast('Customer phone link copied! Open on phone or 2nd window.')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(6px)',
        zIndex: 1100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.2s ease-out',
      }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Customer Phone Simulator"
    >
      <div
        style={{
          background: '#0f172a',
          borderRadius: '32px',
          width: '100%',
          maxWidth: '380px',
          padding: '24px 20px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.5)',
          color: '#ffffff',
          position: 'relative',
          border: '2px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          animation: 'modalSlideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'rgba(255, 255, 255, 0.12)',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          <X size={18} />
        </button>

        {/* Phone Notch & Header */}
        <div
          style={{
            width: '110px',
            height: '18px',
            background: '#000000',
            borderRadius: '99px',
            marginBottom: '16px',
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <Smartphone size={18} color="#38bdf8" />
          <span style={{ fontSize: '13px', fontWeight: 800, letterSpacing: '0.04em', textTransform: 'uppercase', color: '#94a3b8' }}>
            Customer Phone Line
          </span>
        </div>

        <h3 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 4px 0', color: '#f8fafc' }}>
          {formatPhoneNumber(phone)}
        </h3>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '3px 10px',
            borderRadius: '99px',
            fontSize: '11px',
            fontWeight: 700,
            background: isRegistered ? 'rgba(34, 197, 94, 0.15)' : 'rgba(234, 179, 8, 0.15)',
            color: isRegistered ? '#4ade80' : '#facc15',
            marginBottom: '20px',
          }}
        >
          <span
            style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              background: isRegistered ? '#22c55e' : '#eab308',
            }}
          />
          {isRegistered ? 'Ready to receive calls' : 'Connecting to phone line...'}
        </div>

        {/* State 1: IDLE - Waiting for call from call centre */}
        {callState === 'idle' && (
          <div
            style={{
              width: '100%',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '20px',
              padding: '24px 16px',
              textAlign: 'center',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              marginBottom: '16px',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(56, 189, 248, 0.12)',
                color: '#38bdf8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 14px',
              }}
            >
              <PhoneIncoming size={28} />
            </div>

            <div style={{ fontSize: '15px', fontWeight: 700, color: '#f1f5f9', marginBottom: '6px' }}>
              Waiting for Call Centre
            </div>
            <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.5, margin: 0 }}>
              Go to <strong>Plan → Calls to make</strong> or open the <strong>Dialer</strong> and click <strong>Call</strong> on {phone}. This phone will ring instantly!
            </p>
          </div>
        )}

        {/* State 2: RINGING - Incoming Call from Call Centre */}
        {callState === 'ringing' && (
          <div
            style={{
              width: '100%',
              background: 'linear-gradient(145deg, #1e293b, #0f172a)',
              borderRadius: '24px',
              padding: '24px 16px',
              textAlign: 'center',
              border: '2px solid #22c55e',
              boxShadow: '0 0 30px rgba(34, 197, 94, 0.25)',
              animation: 'pulse 1.5s infinite',
              marginBottom: '16px',
            }}
          >
            <div
              style={{
                fontSize: '11px',
                fontWeight: 800,
                color: '#4ade80',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                marginBottom: '8px',
              }}
            >
              📞 INCOMING PHONE CALL
            </div>

            <div style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', marginBottom: '2px' }}>
              {incomingCallData?.callerName || 'On-Ground.ai Call Centre'}
            </div>
            <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '24px' }}>
              {incomingCallData?.callerPhone || '+91 80 6900 1234'}
            </div>

            {/* Answer / Decline buttons */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '32px' }}>
              <button
                onClick={handleDecline}
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: '#ef4444',
                  border: 'none',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(239, 68, 68, 0.4)',
                }}
                title="Decline"
              >
                <PhoneOff size={26} />
              </button>

              <button
                onClick={handleAnswer}
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: '#22c55e',
                  border: 'none',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(34, 197, 94, 0.4)',
                }}
                title="Answer"
              >
                <PhoneCall size={26} />
              </button>
            </div>
          </div>
        )}

        {/* State 3: CONNECTED - Active Live Call */}
        {callState === 'connected' && (
          <div
            style={{
              width: '100%',
              background: 'linear-gradient(145deg, #064e3b, #022c22)',
              borderRadius: '24px',
              padding: '24px 16px',
              textAlign: 'center',
              border: '1px solid rgba(52, 211, 153, 0.3)',
              marginBottom: '16px',
            }}
          >
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#34d399', letterSpacing: '0.05em', marginBottom: '4px' }}>
              LIVE CALL CONNECTED
            </div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', marginBottom: '2px' }}>
              Call Centre Agent
            </div>
            <div style={{ fontSize: '28px', fontWeight: 800, fontVariantNumeric: 'tabular-nums', color: '#34d399', marginBottom: '20px' }}>
              {formatTimer(seconds)}
            </div>

            <div
              style={{
                background: 'rgba(0, 0, 0, 0.3)',
                borderRadius: '12px',
                padding: '10px 12px',
                fontSize: '12px',
                color: '#a7f3d0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginBottom: '20px',
              }}
            >
              <Volume2 size={16} />
              <span>Two-Way Live Voice Streaming</span>
            </div>

            <button
              onClick={handleDecline}
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: '#ef4444',
                border: 'none',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                margin: '0 auto',
                boxShadow: '0 4px 16px rgba(239, 68, 68, 0.4)',
              }}
              title="Hang Up"
            >
              <PhoneOff size={24} />
            </button>
          </div>
        )}

        {/* Shareable Link button for testing across 2 devices/browsers */}
        <button
          onClick={handleCopyLink}
          style={{
            width: '100%',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '12px',
            padding: '10px 14px',
            color: '#cbd5e1',
            fontSize: '12.5px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.15s ease',
          }}
        >
          {copied ? <Check size={15} color="#22c55e" /> : <Copy size={15} />}
          <span>{copied ? 'Link Copied!' : 'Copy Customer Phone Link for 2nd Device'}</span>
        </button>

        {/* Audio element for remote agent audio */}
        <audio ref={remoteAudioRef} autoPlay playsInline />
      </div>
    </div>
  )
}
