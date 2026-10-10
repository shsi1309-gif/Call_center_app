import { useState } from 'react'

const PERSONAS = [
  { id: 'captain', name: 'Captain', emoji: '🦸‍♂️', bg: '#e1f5ee', color: '#0f6e56' },
  { id: 'valkyrie', name: 'Valkyrie', emoji: '🦸‍♀️', bg: '#fde7ee', color: '#9d174d' },
  { id: 'vortex', name: 'Vortex', emoji: '🦹', bg: '#ede7fb', color: '#5b21b6' },
  { id: 'blaze', name: 'Blaze', emoji: '🦹‍♂️', bg: '#fef3c7', color: '#b45309' },
  { id: 'shadow', name: 'Shadow', emoji: '🥷', bg: '#e2e8f0', color: '#334155' },
]

export function AvatarView({ onClose, currentPersona = 'captain', onSelectPersona }) {
  const [selected, setSelected] = useState(currentPersona)

  const active = PERSONAS.find((p) => p.id === selected) || PERSONAS[0]

  const handleSave = () => {
    onSelectPersona?.(selected, active.emoji)
    onClose()
  }

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: '#f7f7f9',
        zIndex: 320,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
      role="region"
      aria-label="Avatar Customization"
    >
      {/* Top Header */}
      <div
        style={{
          background: 'rgba(18, 60, 48, 0.97)',
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          color: '#fff',
        }}
      >
        <button
          onClick={onClose}
          aria-label="Back"
          style={{
            background: 'none',
            border: 'none',
            color: '#fff',
            fontSize: '18px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          ←
        </button>
        <div style={{ fontSize: '16px', fontWeight: 700 }}>Avatar</div>
      </div>

      <div style={{ padding: '20px', flex: 1, overflowY: 'auto' }}>
        <div style={{ fontSize: '11.5px', fontWeight: 800, color: '#8e8e93', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '14px' }}>
          YOUR SELLING PERSONA
        </div>

        {/* Selected Persona Summary Card */}
        <div
          style={{
            background: '#fff',
            borderRadius: '12px',
            padding: '16px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            marginBottom: '24px',
            border: '1px solid #e5e5ea',
          }}
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: active.bg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
              border: '2px solid #1d9e75',
            }}
          >
            {active.emoji}
          </div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#1a1a1a' }}>{active.name}</div>
            <div style={{ fontSize: '12.5px', color: '#8e8e93' }}>Pick the persona shown on your profile badge</div>
          </div>
        </div>

        {/* Persona Options List */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '12px',
            background: '#fff',
            borderRadius: '12px',
            padding: '24px 16px',
            border: '1px solid #e5e5ea',
            marginBottom: '28px',
            textAlign: 'center',
          }}
        >
          {PERSONAS.map((p) => {
            const isSelected = p.id === selected
            return (
              <button
                key={p.id}
                onClick={() => setSelected(p.id)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px',
                }}
              >
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    background: p.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '22px',
                    border: isSelected ? '2.5px solid #1d9e75' : '1px solid transparent',
                    boxShadow: isSelected ? '0 0 0 3px rgba(29,158,117,0.2)' : 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {p.emoji}
                </div>
                <span style={{ fontSize: '12.5px', fontWeight: isSelected ? 700 : 500, color: isSelected ? '#1d9e75' : '#45454d' }}>
                  {p.name}
                </span>
              </button>
            )
          })}
        </div>

        {/* Save Avatar Button */}
        <button
          onClick={handleSave}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: '12px',
            background: '#1d9e75',
            color: '#fff',
            fontSize: '15px',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(29,158,117,0.3)',
            transition: 'background 0.15s ease',
          }}
        >
          Save Avatar
        </button>
      </div>
    </div>
  )
}
