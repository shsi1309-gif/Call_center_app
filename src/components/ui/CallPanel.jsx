import { useState } from 'react'
import {
  Grip,
  Mic,
  MicOff,
  Pause,
  Play,
  Phone,
  PhoneOff,
  Bot,
  Users,
  Radio,
  Volume2,
} from 'lucide-react'
import { useCall } from '../../context/CallContext'
import { formatTimer } from '../../utils/format'
import { AIAssistPanel } from '../layout/AIAssistPanel'
import { DialerModal } from '../layout/DialerModal'
import { AudioVisualizer } from './AudioVisualizer'

export function CallPanel() {
  const {
    call,
    seconds,
    muted,
    onHold,
    callMode,
    speakingSource,
    sentiment,
    isMicActive,
    accept,
    hangUp,
    toggleMute,
    toggleHold,
    switchCallMode,
  } = useCall()

  const [dialerOpen, setDialerOpen] = useState(false)

  if (!call) return null

  const ringing = call.phase === 'ringing'

  if (ringing) {
    return (
      <div style={{ padding: '16px 18px 0 18px' }} role="dialog" aria-label="Incoming call">
        <div
          style={{
            background: 'linear-gradient(135deg, #0f766e, #0d9488)',
            color: '#ffffff',
            borderRadius: '16px',
            padding: '28px 24px',
            textAlign: 'center',
            boxShadow: '0 10px 25px rgba(13, 148, 136, 0.25)',
            animation: 'modalSlideUp 0.25s ease-out',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '11px',
              fontWeight: 800,
              letterSpacing: '0.6px',
              textTransform: 'uppercase',
              color: 'rgba(255, 255, 255, 0.9)',
              background: 'rgba(255, 255, 255, 0.15)',
              padding: '4px 10px',
              borderRadius: '99px',
              marginBottom: '12px',
            }}
          >
            <Radio size={12} className="animate-pulse" />
            {callMode === 'ai-to-human' ? 'INCOMING AI PRACTICE CALL' : 'INCOMING WEBRTC CALL'}
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 6px 0' }}>
            {call.contact.name || 'Faizan A.'}
          </h2>
          <div style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '18px' }}>
            {call.contact.detail || '🎯 Intent 85 · Tranquo Massager Chair'}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
            <button
              onClick={hangUp}
              aria-label="Decline call"
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: '#ef4444',
                border: 'none',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(239, 68, 68, 0.4)',
                transition: 'transform 0.15s ease',
              }}
              onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
              onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <PhoneOff size={22} />
            </button>
            <button
              onClick={accept}
              aria-label="Accept call"
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: '#10b981',
                border: 'none',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)',
                transition: 'transform 0.15s ease',
              }}
              onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
              onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <Phone size={22} />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div
        style={{
          padding: '16px 18px',
          display: 'grid',
          gridTemplateColumns: 'minmax(420px, 1.4fr) minmax(320px, 1fr)',
          gap: '16px',
          alignItems: 'stretch',
        }}
      >
        {/* Left Live Call Control & Audio Screen */}
        <div
          style={{
            background: 'linear-gradient(145deg, #0f6e56, #0b503e)',
            color: '#ffffff',
            borderRadius: '20px',
            padding: '24px 20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 12px 36px rgba(15, 110, 86, 0.25)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Top Bar inside Call Box: Mode Selector & Live Indicator */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              marginBottom: '16px',
            }}
          >
            {/* Mode Toggle Switcher */}
            <div
              style={{
                display: 'inline-flex',
                background: 'rgba(0, 0, 0, 0.25)',
                borderRadius: '99px',
                padding: '3px',
                backdropFilter: 'blur(4px)',
              }}
            >
              <button
                onClick={() => switchCallMode('ai-to-human')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '5px 12px',
                  borderRadius: '99px',
                  border: 'none',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: callMode === 'ai-to-human' ? '#ffffff' : 'transparent',
                  color: callMode === 'ai-to-human' ? '#0f6e56' : '#e2e8f0',
                  transition: 'all 0.15s ease',
                }}
              >
                <Bot size={13} /> AI-to-Human
              </button>
              <button
                onClick={() => switchCallMode('human-to-human')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '5px 12px',
                  borderRadius: '99px',
                  border: 'none',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: callMode === 'human-to-human' ? '#ffffff' : 'transparent',
                  color: callMode === 'human-to-human' ? '#0f6e56' : '#e2e8f0',
                  transition: 'all 0.15s ease',
                }}
              >
                <Users size={13} /> Human-to-Human
              </button>
            </div>

            {/* Live Status Pill */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(255, 255, 255, 0.16)',
                padding: '4px 10px',
                borderRadius: '99px',
                fontSize: '11px',
                fontWeight: 700,
              }}
            >
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: onHold ? '#f59e0b' : '#34d399',
                  boxShadow: onHold ? '0 0 8px #f59e0b' : '0 0 8px #34d399',
                }}
              />
              {onHold ? 'ON HOLD' : 'CONNECTED'}
            </div>
          </div>

          {/* Caller Profile & Timer */}
          <div style={{ textAlign: 'center', marginBottom: '8px' }}>
            <h2 style={{ fontSize: '26px', fontWeight: 800, margin: '0 0 4px 0', letterSpacing: '-0.02em' }}>
              {call.contact.name || 'Faizan A.'}
            </h2>
            <div style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.85)', marginBottom: '8px' }}>
              {call.contact.detail || '+91 98450 61245 · Tranquo Massager Chair'}
            </div>
            <div
              style={{
                fontSize: '36px',
                fontWeight: 800,
                fontVariantNumeric: 'tabular-nums',
                letterSpacing: '1px',
                color: '#ffffff',
              }}
            >
              {formatTimer(seconds) || '00:33'}
            </div>
          </div>

          {/* Real-time Dynamic Waveform Canvas Visualizer */}
          <div
            style={{
              background: 'rgba(0, 0, 0, 0.22)',
              borderRadius: '14px',
              padding: '12px 14px',
              margin: '8px 0 16px',
              backdropFilter: 'blur(6px)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '11px',
                fontWeight: 700,
                color: 'rgba(255, 255, 255, 0.8)',
                marginBottom: '6px',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Volume2 size={13} />
                {speakingSource === 'customer'
                  ? '🔊 Customer Speaking (Speech Synthesis Active)'
                  : speakingSource === 'agent'
                    ? '🎙️ Agent Speaking (Voice Active)'
                    : onHold
                      ? '⏸️ Hold Music Synthesizer Active'
                      : muted
                        ? '🔇 Microphone Muted'
                        : '🟢 Real-time Web Audio Channel'}
              </span>
              <span style={{ color: '#34d399', fontSize: '10.5px' }}>Web Audio API 48kHz</span>
            </div>

            <AudioVisualizer speakingSource={speakingSource} isMuted={muted} isOnHold={onHold} />
          </div>

          {/* Sentiment Meter */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '10px',
              padding: '8px 14px',
              marginBottom: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600 }}>Live Sentiment:</span>
              <div
                style={{
                  width: '90px',
                  height: '6px',
                  background: 'rgba(255, 255, 255, 0.25)',
                  borderRadius: '999px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${sentiment.score}%`,
                    height: '100%',
                    background: sentiment.score >= 80 ? '#34d399' : sentiment.score >= 60 ? '#facc15' : '#f87171',
                    borderRadius: '999px',
                    transition: 'width 0.4s ease',
                  }}
                />
              </div>
            </div>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#34d399' }}>
              {sentiment.score}% · {sentiment.label}
            </span>
          </div>

          {/* Real Audio Stream Status & Live Mic Info */}
          <div
            style={{
              marginBottom: '16px',
              padding: '12px 14px',
              background: 'rgba(0, 0, 0, 0.18)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '11.5px',
                fontWeight: 700,
                color: 'rgba(255, 255, 255, 0.9)',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Mic size={14} color={muted ? '#f87171' : '#34d399'} />
                {muted
                  ? 'Microphone Muted'
                  : isMicActive
                    ? 'Live Microphone Active — Speak Naturally'
                    : 'Audio Stream Active'}
              </span>
              <span
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  padding: '2px 8px',
                  borderRadius: '99px',
                  fontSize: '10.5px',
                  color: '#e2e8f0',
                }}
              >
                {callMode === 'ai-to-human' ? 'Vapi Voice WebRTC' : 'P2P WebRTC Audio'}
              </span>
            </div>

            <div
              style={{
                fontSize: '12px',
                color: 'rgba(255, 255, 255, 0.75)',
                lineHeight: 1.4,
              }}
            >
              {callMode === 'ai-to-human'
                ? 'Your voice is streamed directly to the AI Assistant. Real-time transcription, sentiment analysis, and SOP notes generate automatically as you speak.'
                : `Connected to customer phone line (${call?.contact?.phone || '+91 98450 61245'}). Two-way live voice streaming with noise suppression active.`}
            </div>
          </div>

          {/* Call Action Controls: Mute, Hold, Hang Up, Dialpad */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
              paddingTop: '6px',
              borderTop: '1px solid rgba(255, 255, 255, 0.15)',
            }}
          >
            <button
              onClick={toggleMute}
              aria-label={muted ? 'Unmute microphone' : 'Mute microphone'}
              title={muted ? 'Unmute' : 'Mute'}
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                background: muted ? '#f59e0b' : 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {muted ? <MicOff size={20} /> : <Mic size={20} />}
            </button>

            <button
              onClick={toggleHold}
              aria-label={onHold ? 'Resume call from hold' : 'Put call on hold'}
              title={onHold ? 'Resume' : 'Hold (Plays hold music)'}
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                background: onHold ? '#f59e0b' : 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {onHold ? <Play size={20} /> : <Pause size={20} />}
            </button>

            <button
              onClick={() => setDialerOpen(true)}
              aria-label="Open DTMF dialpad"
              title="Keypad (DTMF Tones)"
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <Grip size={20} />
            </button>

            <button
              onClick={hangUp}
              aria-label="End call"
              title="End call"
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                background: '#dc2626',
                border: 'none',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(220, 38, 38, 0.45)',
                transition: 'transform 0.15s ease',
              }}
              onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
              onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <PhoneOff size={22} />
            </button>
          </div>
        </div>

        {/* Right Live AI Assist & Real-time Transcript Panel */}
        <AIAssistPanel contact={call.contact} />
      </div>

      <DialerModal
        isOpen={dialerOpen}
        onClose={() => setDialerOpen(false)}
        onCallStarted={(num) =>
          startCall(
            {
              name: 'Manual Dial',
              phone: num,
              callType: 'Call centre',
            },
            'outgoing',
          )
        }
      />
    </>
  )
}
