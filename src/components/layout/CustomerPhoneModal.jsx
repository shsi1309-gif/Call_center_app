import { useState, useEffect, useRef } from 'react'
import {
  Check,
  Copy,
  Headphones,
  Mic,
  PhoneCall,
  PhoneForwarded,
  PhoneIncoming,
  PhoneOff,
  Radio,
  Smartphone,
  Volume2,
  X,
} from 'lucide-react'
import { phoneCallService, formatPhoneNumber } from '../../utils/phoneCallService'
import { callAudio } from '../../utils/callAudioEngine'
import { getTelephonyConfig } from '../../utils/telephonyConfig'
import { formatTimer } from '../../utils/format'
import { useToast } from '../../context/ToastContext'

const IVR_MENU = {
  welcome:
    'Welcome to On-Ground.ai customer care! Namaste! Press 1 for information about our ergonomic smart products and offers. Press 2 to speak directly with our on-ground human customer support expert.',
  option1:
    'Thank you for inquiring about our products! The Sleep Company Tranquo Smart Massager Chair features 8-zone body mapping rollers with soothing heat therapy, available at zero-downpayment ₹2,082 per month EMI with a 3-year doorstep warranty. Our SmartLuxe Mattress features patented ergonomic Grid back support. Press 2 at any time to talk directly with our human expert, or press 1 to listen again.',
  option2:
    'Transferring your call to our human customer support expert. Please stay on the line while we connect your call...',
}

export function CustomerPhoneModal({ isOpen, onClose, initialPhone = '+91 63611 67314' }) {
  const toast = useToast()
  const [phone] = useState(initialPhone)
  const [isRegistered, setIsRegistered] = useState(false)
  // 'idle' | 'calling-helpline' | 'ivr' | 'transferring' | 'ringing' | 'connected'
  const [callState, setCallState] = useState('idle')
  const [incomingCallData, setIncomingCallData] = useState(null)
  const [seconds, setSeconds] = useState(0)
  const [copied, setCopied] = useState(false)
  const [ivrTranscript, setIvrTranscript] = useState([])
  const [isAiSpeaking, setIsAiSpeaking] = useState(false)
  const [lastKeyPressed, setLastKeyPressed] = useState(null)
  const remoteAudioRef = useRef(null)

  const helplineNumber = getTelephonyConfig().callCentreNumber || '+91 80 9578 1284'

  // Timer for active call or IVR session
  useEffect(() => {
    if (callState !== 'connected' && callState !== 'ivr' && callState !== 'transferring') return
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
      toast(`Incoming call from ${data.callerName || 'On-Ground.ai Helpline'}!`)
    }

    const handleConnected = () => {
      callAudio.stopRingback()
      callAudio.stopHoldMusic()
      setCallState('connected')
      toast('Call connected! Live two-way microphone audio active.')
    }

    const handleIvrAccepted = () => {
      callAudio.stopHoldMusic()
      callAudio.playConnectedChime()
      setCallState('connected')
      toast('Human expert joined! Two-way audio connected.')
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
      callAudio.stopSpeech()
      setCallState('idle')
      setIncomingCallData(null)
      toast('Call ended.')
    }

    phoneCallService.on('incomingCall', handleIncoming)
    phoneCallService.on('callConnected', handleConnected)
    phoneCallService.on('ivrTransferAccepted', handleIvrAccepted)
    phoneCallService.on('remoteStream', handleStream)
    phoneCallService.on('callEnded', handleEnded)

    return () => {
      phoneCallService.off('incomingCall', handleIncoming)
      phoneCallService.off('callConnected', handleConnected)
      phoneCallService.off('ivrTransferAccepted', handleIvrAccepted)
      phoneCallService.off('remoteStream', handleStream)
      phoneCallService.off('callEnded', handleEnded)
    }
  }, [isOpen, phone, toast])

  if (!isOpen) return null

  // Initiate call to On-Ground AI Helpline (+91 80 9578 1284)
  const handleCallHelpline = () => {
    setCallState('calling-helpline')
    setSeconds(0)
    setIvrTranscript([])
    callAudio.initAudio()
    callAudio.startRingback()

    setTimeout(() => {
      callAudio.stopRingback()
      callAudio.playConnectedChime()
      setCallState('ivr')

      const prompt = IVR_MENU.welcome
      setIvrTranscript([{ speaker: 'ai', text: prompt }])
      callAudio.speak(
        prompt,
        () => setIsAiSpeaking(true),
        () => setIsAiSpeaking(false),
      )
    }, 1500)
  }

  // Handle DTMF Keypad Presses during IVR call
  const handlePressKey = (key) => {
    setLastKeyPressed(key)
    callAudio.playDtmf(key)
    setTimeout(() => setLastKeyPressed(null), 300)

    if (key === '1') {
      // Option 1: Product Information & Offers
      const text = IVR_MENU.option1
      setIvrTranscript((prev) => [
        ...prev,
        { speaker: 'customer', text: 'Pressed [1] · Product Information' },
        { speaker: 'ai', text },
      ])
      callAudio.speak(
        text,
        () => setIsAiSpeaking(true),
        () => setIsAiSpeaking(false),
      )
    } else if (key === '2') {
      // Option 2: Connect to Human Expert
      const text = IVR_MENU.option2
      setIvrTranscript((prev) => [
        ...prev,
        { speaker: 'customer', text: 'Pressed [2] · Transfer to Human Customer Expert' },
        { speaker: 'ai', text },
      ])

      callAudio.speak(
        text,
        () => setIsAiSpeaking(true),
        () => {
          setIsAiSpeaking(false)
          setCallState('transferring')
          callAudio.playHoldMusic()
          // Dispatch IVR Transfer to Call Centre Agent Dashboard
          phoneCallService.transferToAgent(phone, 'Shivam Singh')
          toast('Ringing On-Ground human customer expert...')
        },
      )
    } else {
      callAudio.speak('Invalid option. Press 1 for product information, or press 2 to speak with a human expert.')
    }
  }

  // Answer incoming call from call centre
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
    callAudio.stopSpeech()
    phoneCallService.hangUp()
    setCallState('idle')
    setIncomingCallData(null)
    setIvrTranscript([])
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
          maxWidth: '400px',
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
            Shivam&apos;s Mobile Handset
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
            marginBottom: '16px',
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
          {isRegistered ? 'Carrier Handset Online · Ready' : 'Registering phone line...'}
        </div>

        {/* State 1: IDLE - Call Helpline Button */}
        {callState === 'idle' && (
          <div
            style={{
              width: '100%',
              background: 'rgba(255, 255, 255, 0.04)',
              borderRadius: '20px',
              padding: '20px 16px',
              textAlign: 'center',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              marginBottom: '16px',
            }}
          >
            <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '14px' }}>
              On-Ground.ai Helpline: <strong style={{ color: '#38bdf8' }}>{helphoneNumber}</strong>
            </div>

            <button
              onClick={handleCallHelpline}
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
                marginBottom: '12px',
              }}
            >
              <PhoneCall size={18} />
              <span>Call On-Ground.ai Helpline</span>
            </button>

            <p style={{ fontSize: '11.5px', color: '#64748b', margin: 0, lineHeight: 1.4 }}>
              Dials {helphoneNumber} → AI Assistant answers with voice IVR → Press 1 for products, Press 2 to connect with human expert.
            </p>
          </div>
        )}

        {/* State 2: CALLING HELPLINE (Ringing) */}
        {callState === 'calling-helpline' && (
          <div
            style={{
              width: '100%',
              background: 'linear-gradient(145deg, #1e293b, #0f172a)',
              borderRadius: '24px',
              padding: '28px 16px',
              textAlign: 'center',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              marginBottom: '16px',
            }}
          >
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.05em', marginBottom: '6px' }}>
              DIALING HELPLINE...
            </div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>
              {helphoneNumber}
            </div>
            <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '20px' }}>
              Ringing On-Ground.ai Gateway...
            </div>
            <button
              onClick={handleHangUp}
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: '#ef4444',
                border: 'none',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                cursor: 'pointer',
              }}
            >
              <PhoneOff size={22} />
            </button>
          </div>
        )}

        {/* State 3: IVR ACTIVE - AI Voice Assistant with Interactive DTMF Keypad */}
        {callState === 'ivr' && (
          <div
            style={{
              width: '100%',
              background: 'linear-gradient(145deg, #131d31, #0b1120)',
              borderRadius: '24px',
              padding: '18px 16px',
              border: '1.5px solid rgba(56, 189, 248, 0.4)',
              boxShadow: '0 0 25px rgba(56, 189, 248, 0.15)',
              marginBottom: '14px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Radio size={14} color="#38bdf8" />
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.04em' }}>
                  AI VOICE ASSISTANT (IVR)
                </span>
              </div>
              <span style={{ fontSize: '13px', fontWeight: 800, fontVariantNumeric: 'tabular-nums', color: '#38bdf8' }}>
                {formatTimer(seconds)}
              </span>
            </div>

            {/* AI Speaking Indicator */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                background: isAiSpeaking ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                borderRadius: '10px',
                padding: '8px 12px',
                marginBottom: '12px',
              }}
            >
              <Volume2 size={15} color={isAiSpeaking ? '#38bdf8' : '#94a3b8'} />
              <span style={{ fontSize: '12px', fontWeight: 700, color: isAiSpeaking ? '#38bdf8' : '#cbd5e1' }}>
                {isAiSpeaking ? 'AI Voice Speaking...' : 'Listening for Keypad Input'}
              </span>
            </div>

            {/* Latest Transcript Message */}
            <div
              style={{
                background: 'rgba(0, 0, 0, 0.35)',
                borderRadius: '12px',
                padding: '10px 12px',
                fontSize: '11.5px',
                lineHeight: 1.45,
                color: '#e2e8f0',
                maxHeight: '85px',
                overflowY: 'auto',
                marginBottom: '12px',
                textAlign: 'left',
              }}
            >
              {ivrTranscript[ivrTranscript.length - 1]?.text || 'Press 1 for products, Press 2 to talk to human expert.'}
            </div>

            {/* Quick IVR Options */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
              <button
                type="button"
                onClick={() => handlePressKey('1')}
                style={{
                  padding: '10px 8px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.18), rgba(56, 189, 248, 0.08))',
                  border: '1.5px solid rgba(56, 189, 248, 0.4)',
                  color: '#fff',
                  cursor: 'pointer',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '16px', fontWeight: 900, color: '#38bdf8' }}>Press 1</div>
                <div style={{ fontSize: '10.5px', color: '#94a3b8', marginTop: '2px' }}>Product Info & Offers</div>
              </button>

              <button
                type="button"
                onClick={() => handlePressKey('2')}
                style={{
                  padding: '10px 8px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.22), rgba(34, 197, 94, 0.1))',
                  border: '1.5px solid #22c55e',
                  color: '#fff',
                  cursor: 'pointer',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '16px', fontWeight: 900, color: '#4ade80' }}>Press 2</div>
                <div style={{ fontSize: '10.5px', color: '#86efac', marginTop: '2px' }}>Talk to Human Expert</div>
              </button>
            </div>

            {/* Numeric Dialpad */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '6px',
                marginBottom: '12px',
              }}
            >
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => handlePressKey(k)}
                  style={{
                    padding: '8px',
                    borderRadius: '10px',
                    background: lastKeyPressed === k ? '#38bdf8' : 'rgba(255, 255, 255, 0.06)',
                    color: lastKeyPressed === k ? '#000' : '#f8fafc',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    fontSize: '14px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.1s ease',
                  }}
                >
                  {k}
                </button>
              ))}
            </div>

            {/* End Call Button */}
            <button
              onClick={handleHangUp}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '10px',
                background: 'rgba(239, 68, 68, 0.2)',
                border: '1px solid #ef4444',
                color: '#fca5a5',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <PhoneOff size={14} /> End Call
            </button>
          </div>
        )}

        {/* State 4: TRANSFERRING TO HUMAN EXPERT */}
        {callState === 'transferring' && (
          <div
            style={{
              width: '100%',
              background: 'linear-gradient(145deg, #142a1f, #0b1c14)',
              borderRadius: '24px',
              padding: '24px 16px',
              textAlign: 'center',
              border: '2px solid #22c55e',
              boxShadow: '0 0 30px rgba(34, 197, 94, 0.25)',
              animation: 'pulse 1.5s infinite',
              marginBottom: '16px',
            }}
          >
            <div style={{ fontSize: '11.5px', fontWeight: 800, color: '#4ade80', letterSpacing: '0.05em', marginBottom: '8px' }}>
              <PhoneForwarded size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: '-3px' }} />
              CONNECTING TO HUMAN EXPERT
            </div>
            <div style={{ fontSize: '17px', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>
              On-Ground Call Centre Desk
            </div>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '16px' }}>
              Ringing agent dashboard... Ambient hold chords playing.
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, fontVariantNumeric: 'tabular-nums', color: '#4ade80', marginBottom: '18px' }}>
              {formatTimer(seconds)}
            </div>
            <button
              onClick={handleHangUp}
              style={{
                padding: '8px 20px',
                borderRadius: '99px',
                background: '#ef4444',
                border: 'none',
                color: '#fff',
                fontSize: '12.5px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Cancel Transfer
            </button>
          </div>
        )}

        {/* State 5: RINGING - Incoming Call from Call Centre */}
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

        {/* State 6: CONNECTED - Active Human-to-Human Live Call */}
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
              LIVE HUMAN CALL CONNECTED
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
              <span>Two-Way Live Voice Streaming Active</span>
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
