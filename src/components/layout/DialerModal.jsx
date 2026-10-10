import { useState } from 'react'
import { Delete, Phone } from 'lucide-react'
import { useCall } from '../../context/CallContext'

const KEYS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['*', '0', '#'],
]

export function DialerModal({ isOpen, onClose, onCallStarted }) {
  const { startCall } = useCall()
  const [digits, setDigits] = useState('')

  if (!isOpen) return null

  const handleKeyClick = (key) => {
    setDigits((prev) => prev + key)
  }

  const handleBackspace = () => {
    setDigits((prev) => prev.slice(0, -1))
  }

  const handleCall = () => {
    const dialNumber = digits || '98450 61245'
    onClose()
    startCall(
      {
        name: 'Manual Dial',
        initials: 'MD',
        detail: `+91 ${dialNumber}`,
        phone: dialNumber,
        callType: 'Call centre',
      },
      'outgoing',
    )
    onCallStarted?.(dialNumber)
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.35)',
        backdropFilter: 'blur(2px)',
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
          maxWidth: '340px',
          padding: '20px 24px 24px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.2)',
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

        {/* Displayed dialed number if any */}
        {digits ? (
          <div
            style={{
              height: '32px',
              fontSize: '22px',
              fontWeight: 700,
              color: '#0f172a',
              letterSpacing: '1px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '12px',
              width: '100%',
              position: 'relative',
            }}
          >
            <span>{digits}</span>
            <button
              onClick={handleBackspace}
              style={{
                position: 'absolute',
                right: '4px',
                background: 'none',
                border: 'none',
                color: '#64748b',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: '4px',
              }}
              aria-label="Delete digit"
            >
              <Delete size={18} />
            </button>
          </div>
        ) : (
          <div style={{ height: '12px' }} />
        )}

        {/* 3x4 Grid of oval keys */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px 14px',
            width: '100%',
            marginBottom: '20px',
          }}
        >
          {KEYS.map((row) =>
            row.map((key) => (
              <button
                key={key}
                onClick={() => handleKeyClick(key)}
                style={{
                  height: '48px',
                  borderRadius: '999px',
                  backgroundColor: '#f1f5f9',
                  border: 'none',
                  fontSize: '18px',
                  fontWeight: 700,
                  color: '#0f172a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'background-color 0.12s ease',
                  userSelect: 'none',
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#e2e8f0')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                onMouseDown={(e) => (e.currentTarget.style.backgroundColor = '#cbd5e1')}
                onMouseUp={(e) => (e.currentTarget.style.backgroundColor = '#e2e8f0')}
              >
                {key}
              </button>
            )),
          )}
        </div>

        {/* Green Call Button at bottom center */}
        <button
          onClick={handleCall}
          aria-label="Start call"
          style={{
            width: '52px',
            height: '52px',
            borderRadius: '50%',
            backgroundColor: '#0f6e56',
            color: '#ffffff',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(15, 110, 86, 0.35)',
            transition: 'transform 0.15s ease',
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
          onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <Phone size={22} />
        </button>
      </div>
    </div>
  )
}
