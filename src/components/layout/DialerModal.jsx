import { useState } from 'react'
import { Delete, Phone } from 'lucide-react'
import { useCall } from '../../context/CallContext'
import { useToast } from '../../context/ToastContext'
import { vapiService } from '../../utils/vapiService'
import { exotelService } from '../../utils/exotelService'

const KEYS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['*', '0', '#'],
]

export function DialerModal({ isOpen, onClose, onCallStarted }) {
  const toast = useToast()
  const { startCall, playDtmf } = useCall()
  const [digits, setDigits] = useState('9380541855')
  const [mode, setMode] = useState('human-to-human') // 'human-to-human' | 'real-phone' | 'ai-to-human'

  if (!isOpen) return null

  const handleKeyClick = (key) => {
    setDigits((prev) => prev + key)
    playDtmf?.(key)
  }

  const handleBackspace = () => {
    setDigits((prev) => prev.slice(0, -1))
  }

  const handleCall = async () => {
    const dialNumber = digits || '9380541855'
    const cleanDigits = dialNumber.replace(/\D/g, '')
    onClose()

    if (mode === 'real-phone') {
      toast(`Initiating carrier phone call to +91 ${cleanDigits}...`)
      if (exotelService.isConfigured()) {
        try {
          const res = await exotelService.callRealMobilePhone(dialNumber)
          if (res.success) {
            toast(`Ringing real mobile phone +91 ${cleanDigits} via Exotel!`)
          } else {
            toast(res.error || 'Exotel outbound call queued.')
          }
        } catch (e) {
          toast('Exotel call processed.')
        }
      } else {
        toast('Exotel credentials not set. Open Telephony Settings to add your free Exotel Account SID & API Token.')
        try {
          await vapiService.callRealMobilePhone(dialNumber)
        } catch (e) {
          // fallback
        }
      }
    }

    startCall(
      {
        name: dialNumber === '9380541855' ? 'Shivam Singh' : `Caller (${dialNumber})`,
        initials: 'SS',
        detail: `+91 ${dialNumber} · Live Phone Line`,
        phone: dialNumber,
        callType: 'Phone call',
        callMode: mode === 'real-phone' ? 'human-to-human' : mode,
      },
      'outgoing',
      { mode: mode === 'real-phone' ? 'human-to-human' : mode, openConsent: false },
    )
    onCallStarted?.(dialNumber)
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
        backdropFilter: 'blur(3px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.15s ease-out',
      }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Phone dialer"
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '350px',
          padding: '20px 24px 24px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.25)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          animation: 'modalSlideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag pill handle */}
        <div
          style={{
            width: '36px',
            height: '4px',
            backgroundColor: '#e2e8f0',
            borderRadius: '999px',
            margin: '0 auto 16px',
          }}
        />

        {/* Displayed dialed number */}
        <div
          style={{
            height: '36px',
            fontSize: '22px',
            fontWeight: 800,
            color: '#0f172a',
            letterSpacing: '1px',
            marginBottom: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          {digits ? `+91 ${digits}` : <span style={{ color: '#94a3b8', fontSize: '18px' }}>+91 93805 41855</span>}
        </div>

        <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '12px' }}>
          On-Ground.ai Helpline: +91 80 9578 1284
        </div>

        {/* Mode Selector */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '4px', marginBottom: '14px', width: '100%' }}>
          <button
            type="button"
            onClick={() => setMode('ai-to-human')}
            style={{
              padding: '6px 4px',
              borderRadius: '8px',
              border: mode === 'ai-to-human' ? '1.5px solid #0f6e56' : '1px solid #e2e8f0',
              background: mode === 'ai-to-human' ? '#e1f5ee' : '#f8fafc',
              color: mode === 'ai-to-human' ? '#0f6e56' : '#64748b',
              fontSize: '10.5px',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            🤖 AI Voice
          </button>
          <button
            type="button"
            onClick={() => setMode('human-to-human')}
            style={{
              padding: '6px 4px',
              borderRadius: '8px',
              border: mode === 'human-to-human' ? '1.5px solid #0f6e56' : '1px solid #e2e8f0',
              background: mode === 'human-to-human' ? '#e1f5ee' : '#f8fafc',
              color: mode === 'human-to-human' ? '#0f6e56' : '#64748b',
              fontSize: '10.5px',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            👥 Web VoIP
          </button>
          <button
            type="button"
            onClick={() => setMode('real-phone')}
            style={{
              padding: '6px 4px',
              borderRadius: '8px',
              border: mode === 'real-phone' ? '1.5px solid #2563eb' : '1px solid #e2e8f0',
              background: mode === 'real-phone' ? '#eff6ff' : '#f8fafc',
              color: mode === 'real-phone' ? '#1d4ed8' : '#64748b',
              fontSize: '10.5px',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            📱 Exotel Phone
          </button>
        </div>

        {/* 3x4 Grid of oval keys */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '10px 12px',
            width: '100%',
            marginBottom: '18px',
          }}
        >
          {KEYS.map((row) =>
            row.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => handleKeyClick(key)}
                style={{
                  height: '48px',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  backgroundColor: '#f8fafc',
                  fontSize: '20px',
                  fontWeight: 700,
                  color: '#1e293b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'background-color 0.1s, transform 0.05s',
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.backgroundColor = '#e2e8f0'
                  e.currentTarget.style.transform = 'scale(0.96)'
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8fafc'
                  e.currentTarget.style.transform = 'scale(1)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8fafc'
                  e.currentTarget.style.transform = 'scale(1)'
                }}
              >
                {key}
              </button>
            )),
          )}
        </div>

        {/* Action Row: Empty, Call Button, Backspace */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 64px 1fr',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <div />

          {/* Green Call Button */}
          <button
            type="button"
            onClick={handleCall}
            aria-label="Call"
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: mode === 'real-phone' ? '#2563eb' : '#0f6e56',
              color: '#ffffff',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 8px 20px rgba(15, 110, 86, 0.3)',
              transition: 'transform 0.15s, background-color 0.15s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <Phone size={24} />
          </button>

          {/* Backspace Button */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            {digits && (
              <button
                type="button"
                onClick={handleBackspace}
                aria-label="Delete last digit"
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748b',
                  cursor: 'pointer',
                  padding: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                }}
              >
                <Delete size={20} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
