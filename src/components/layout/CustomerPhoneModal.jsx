import { useState, useEffect, useRef } from 'react'
import {
  Check,
  Copy,
  Mic,
  PhoneCall,
  PhoneIncoming,
  PhoneOff,
  Smartphone,
  Volume2,
  X,
} from 'lucide-react'
import { phoneCallService, formatPhoneNumber } from '../../utils/phoneCallService'
import { callAudio } from '../../utils/callAudioEngine'
import { getTelephonyConfig } from '../../utils/telephonyConfig'
import { formatTimer } from '../../utils/format'
import { useToast } from '../../context/ToastContext'

export function CustomerPhoneModal({ isOpen, onClose, initialPhone = '+91 63611 67314' }) {
  const toast = useToast()
  const [phone] = useState(initialPhone)
  const [isRegistered, setIsRegistered] = useState(false)
  // 'idle' | 'calling-agent' | 'ringing' | 'connected'
  const [callState, setCallState] = useState('idle')
  const [incomingCallData, setIncomingCallData] = useState(null)
  const [seconds, setSeconds] = useState(0)
  const [copied, setCopied] = useState(false)
  const remoteAudioRef = useRef(null)

  const helplineNumber = getTelephonyConfig().callCentreNumber || '+91 80 9578 1284'

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
      callAudio.startRingback()
      toast(`Incoming call from ${data.callerName || 'On-Ground Call Centre'}!`)
    }

    const handleConnected = () => {
      callAudio.stopRingback()
      callAudio.stopHoldMusic()
      setCallState('connected')
      toast('Call connected! Live two-way microphone audio active.')
    }

    const handleAgentAccepted = () => {
      callAudio.stopRingback()
      callAudio.stopHoldMusic()
      callAudio.playConnectedChime()
      setCallState('connected')
      toast('Agent accepted! Two-way audio connected.')
    }

    const handleStream = (stream) => {
      if (remoteAudioRef.current) {
        remoteAudioRef.current.srcObject = stream
        remoteAudioRef.current.play().catch(() => {})
      }
    }

    const handleEnded = () => {
      callAudio.stopRingback()
      callAudio.stopHoldMusic()
      setCallState('idle')
      setIncomingCallData(null)
      setSeconds(0)
      toast('Call ended.')
    }

    phoneCallService.on('incomingCall', handleIncoming)
    phoneCallService.on('callConnected', handleConnected)
    phoneCallService.on('ivrTransferAccepted', handleAgentAccepted)
    phoneCallService.on('remoteStream', handleStream)
    phoneCallService.on('callEnded', handleEnded)

    return () => {
      phoneCallService.off('incomingCall', handleIncoming)
      phoneCallService.off('callConnected', handleConnected)
      phoneCallService.off('ivrTransferAccepted', handleAgentAccepted)
      phoneCallService.off('remoteStream', handleStream)
      phoneCallService.off('callEnded', handleEnded)
    }
  }, [isOpen, phone, toast])

  if (!isOpen) return null

  // Shivam calls On-Ground Call Centre (+91 80 9578 1284) directly
  const handleCallAgent = () => {
    setCallState('calling-agent')
    setSeconds(0)
    callAudio.initAudio()
    callAudio.startRingback()
    // Directly ring the agent dashboard
    phoneCallService.transferToAgent(phone, 'Shivam Singh')
    toast(`Ringing On-Ground Agent at ${helphoneNumber}...`)
  }

  // Shivam answers incoming call from agent
  const handleAnswer = () => {
    callAudio.stopRingback()
    callAudio.playConnectedChime()
    phoneCallService.answerCall(incomingCallData?.mediaCall)
    setCallState('connected')
  }

  // Hang up
  const handleHangUp = () => {
    callAudio.stopRingback()
    callAudio.stopHoldMusic()
    phoneCallService.hangUp()
    setCallState('idle')
    setIncomingCallData(null)
    setSeconds(0)
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
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(8px)',
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
          background: '#090d16',
          borderRadius: '36px',
          width: '100%',
          maxWidth: '380px',
          padding: '24px 20px',
          boxShadow: '0 30px 70px rgba(0, 0, 0, 0.7)',
          color: '#ffffff',
          position: 'relative',
          border: '2px solid rgba(255, 255, 255, 0.12)',
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
          <Smartphone size={17} color="#38bdf8" />
          <span style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.04em', textTransform: 'uppercase', color: '#94a3b8' }}>
            Shivam&apos;s Phone
          </span>
        </div>

        <h3 style={{ fontSize: '21px', fontWeight: 800, margin: '0 0 4px 0', color: '#f8fafc' }}>
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
            marginBottom: '18px',
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
          {isRegistered ? 'Carrier Handset Online' : 'Connecting to line...'}
        </div>

        {/* State 1: IDLE - Call Agent Button */}
        {callState === 'idle' && (
          <div
            style={{
              width: '100%',
              background: 'rgba(255, 255, 255, 0.04)',
              borderRadius: '20px',
              padding: '22px 16px',
              textAlign: 'center',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              marginBottom: '16px',
            }}
          >
            <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '16px' }}>
              Call Centre Line: <strong style={{ color: '#38bdf8' }}>{helphoneNumber}</strong>
            </div>

            <button
              onClick={handleCallAgent}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #059669, #047857)',
                color: '#fff',
                border: 'none',
                borderRadius: '14px',
                padding: '14px 18px',
                fontSize: '15px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                boxShadow: '0 6px 20px rgba(5, 150, 105, 0.35)',
                marginBottom: '14px',
              }}
            >
              <PhoneCall size={18} />
              <span>Call On-Ground Call Centre</span>
            </button>

            <p style={{ fontSize: '12px', color: '#64748b', margin: 0, lineHeight: 1.4 }}>
              Rings the Call Centre Agent desk instantly. When the agent accepts, you connect in a live two-way human audio call.
            </p>
          </div>
        )}

        {/* State 2: CALLING AGENT (Ringing Agent) */}
        {callState === 'calling-agent' && (
          <div
            style={{
              width: '100%',
              background: 'linear-gradient(145deg, #1e293b, #0f172a)',
              borderRadius: '24px',
              padding: '28px 16px',
              textAlign: 'center',
              border: '1.5px solid #22c55e',
              boxShadow: '0 0 25px rgba(34, 197, 94, 0.2)',
              marginBottom: '16px',
            }}
          >
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#4ade80', letterSpacing: '0.05em', marginBottom: '8px' }}>
              RINGING CALL CENTRE AGENT...
            </div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>
              {helphoneNumber}
            </div>
            <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '24px' }}>
              Waiting for agent to accept your call...
            </div>
            <button
              onClick={handleHangUp}
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                background: '#ef4444',
                border: 'none',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(239, 68, 68, 0.4)',
              }}
              title="Cancel Call"
            >
              <PhoneOff size={22} />
            </button>
          </div>
        )}

        {/* State 3: RINGING - Incoming Call from Agent */}
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
              📞 INCOMING CALL
            </div>

            <div style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', marginBottom: '2px' }}>
              {incomingCallData?.callerName || 'On-Ground Call Centre'}
            </div>
            <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '24px' }}>
              {incomingCallData?.callerPhone || helplineNumber}
            </div>

            {/* Answer / Decline buttons */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '32px' }}>
              <button
                onClick={handleHangUp}
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

        {/* State 4: CONNECTED - Active Human-to-Human Live Call */}
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
              On-Ground Call Centre Agent
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
              <Mic size={16} />
              <span>Two-Way Live Voice Active</span>
            </div>

            <button
              onClick={handleHangUp}
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
            fontSize: '12px',
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
          <span>{copied ? 'Link Copied!' : 'Copy Link for Testing on 2nd Phone/Tab'}</span>
        </button>

        {/* Audio element for remote agent audio */}
        <audio ref={remoteAudioRef} autoPlay playsInline />
      </div>
    </div>
  )
}
