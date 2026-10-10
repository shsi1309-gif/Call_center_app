import { useState } from 'react'
import { Grip, Mic, MicOff, Pause, Play, Phone, PhoneOff } from 'lucide-react'
import { useCall } from '../../context/CallContext'
import { formatTimer } from '../../utils/format'
import { AIAssistPanel } from '../layout/AIAssistPanel'
import { DialerModal } from '../layout/DialerModal'

export function CallPanel() {
  const { call, seconds, muted, accept, hangUp, toggleMute, startCall } = useCall()
  const [onHold, setOnHold] = useState(false)
  const [dialerOpen, setDialerOpen] = useState(false)

  if (!call) return null

  const ringing = call.phase === 'ringing'

  if (ringing) {
    return (
      <div style={{ padding: '16px 18px 0 18px' }} role="dialog" aria-label="Incoming call">
        <div
          style={{
            background: 'linear-gradient(135deg, #a93818, #c2410c)',
            color: '#ffffff',
            borderRadius: '16px',
            padding: '24px 20px',
            textAlign: 'center',
            boxShadow: '0 10px 25px rgba(180, 52, 20, 0.25)',
            animation: 'modalSlideUp 0.25s ease-out',
          }}
        >
          <div
            style={{
              fontSize: '11px',
              fontWeight: 800,
              letterSpacing: '0.6px',
              textTransform: 'uppercase',
              color: 'rgba(255, 255, 255, 0.8)',
              marginBottom: '4px',
            }}
          >
            INCOMING CALL
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, margin: '0 0 6px 0' }}>
            {call.contact.name || 'Ritu S.'}
          </h2>
          <div style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '18px' }}>
            {call.contact.detail || '🎯 Intent 96 · calling from +91 98450 xxxxx'}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
            <button
              onClick={hangUp}
              aria-label="Decline call"
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                background: '#e15241',
                border: 'none',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                transition: 'transform 0.15s ease',
              }}
              onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
              onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <PhoneOff size={20} />
            </button>
            <button
              onClick={accept}
              aria-label="Accept call"
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                background: '#0f9f6e',
                border: 'none',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                transition: 'transform 0.15s ease',
              }}
              onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
              onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <Phone size={20} />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Active Call + Live AI Assist Panel */}
      <div
        style={{
          padding: '16px 18px',
          display: 'grid',
          gridTemplateColumns: '1fr 340px',
          gap: '16px',
          alignItems: 'stretch',
          minHeight: '440px',
        }}
      >
        {/* Left Call In Progress Box */}
        <div
          style={{
            background: '#0f6e56',
            color: '#ffffff',
            borderRadius: '16px',
            padding: '40px 24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            boxShadow: '0 10px 30px rgba(15, 110, 86, 0.2)',
            minHeight: '360px',
          }}
        >
          <div
            style={{
              fontSize: '11px',
              fontWeight: 800,
              letterSpacing: '0.8px',
              textTransform: 'uppercase',
              color: 'rgba(255, 255, 255, 0.75)',
              marginBottom: '6px',
            }}
          >
            CALL IN PROGRESS
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 8px 0' }}>
            {call.contact.name || 'Faizan A.'}
          </h2>
          <div
            style={{
              fontSize: '32px',
              fontWeight: 800,
              fontVariantNumeric: 'tabular-nums',
              letterSpacing: '1px',
              marginBottom: '14px',
            }}
          >
            {formatTimer(seconds) || '00:33'}
          </div>

          {/* Sentiment Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '12px',
              color: 'rgba(255, 255, 255, 0.85)',
              marginBottom: '26px',
            }}
          >
            <span>Sentiment</span>
            <div
              style={{
                width: '60px',
                height: '5px',
                background: 'rgba(255, 255, 255, 0.25)',
                borderRadius: '999px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: '75%',
                  height: '100%',
                  background: '#34d399',
                  borderRadius: '999px',
                }}
              />
            </div>
            <span style={{ color: '#34d399', fontWeight: 700 }}>Positive</span>
          </div>

          {/* Call Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={toggleMute}
              aria-label={muted ? 'Unmute' : 'Mute'}
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: muted ? '#f59e0b' : 'rgba(255, 255, 255, 0.18)',
                border: 'none',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'background 0.15s ease',
              }}
            >
              {muted ? <MicOff size={18} /> : <Mic size={18} />}
            </button>
            <button
              onClick={() => setOnHold(!onHold)}
              aria-label={onHold ? 'Resume' : 'Hold'}
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: onHold ? '#f59e0b' : 'rgba(255, 255, 255, 0.18)',
                border: 'none',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'background 0.15s ease',
              }}
            >
              {onHold ? <Play size={18} /> : <Pause size={18} />}
            </button>
            <button
              onClick={hangUp}
              aria-label="End call"
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: '#dc2626',
                border: 'none',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(220, 38, 38, 0.4)',
                transition: 'transform 0.15s ease',
              }}
              onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
              onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <PhoneOff size={18} />
            </button>
          </div>
        </div>

        {/* Right Live AI Assist Panel */}
        <AIAssistPanel contact={call.contact} />
      </div>

      {/* Floating purple dialpad button */}
      <button
        onClick={() => setDialerOpen(true)}
        aria-label="Open dialpad"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          background: '#4f46e5',
          color: '#fff',
          border: 'none',
          boxShadow: '0 4px 14px rgba(79,70,229,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 360,
        }}
      >
        <Grip size={22} />
      </button>

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
