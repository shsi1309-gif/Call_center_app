import { useState } from 'react'
import { Phone, Sparkles, X, Check, Calendar, PhoneCall, Ban, ThumbsUp, BookmarkCheck } from 'lucide-react'
import { useToast } from '../../context/ToastContext'

const OUTCOMES = [
  { id: 'interested', label: 'Interested', icon: '👍' },
  { id: 'followup', label: 'Follow-up needed', icon: '📅' },
  { id: 'callback', label: 'Requested callback', icon: '📞' },
  { id: 'resolved', label: 'Resolved', icon: '✓' },
  { id: 'not_interested', label: 'Not interested', icon: '🚫' },
]

export function CallWrapupModal({
  contact = { name: 'Mukunda', product: 'Ortho GRID · ₹8,490' },
  duration = '01:52',
  onClose,
  onSave,
}) {
  const toast = useToast()
  const [selectedOutcome, setSelectedOutcome] = useState('interested')
  const [summary, setSummary] = useState(
    `Discussed ${contact.product || 'Ortho GRID · ₹8,490'}. Asked specifically about EMI options on the ${
      contact.product?.split('·')[0]?.trim() || 'Ortho GRID'
    } — budget is a live concern, not a blocker. Call lasted ${duration}.`
  )

  const handleSave = () => {
    toast(`Summary & outcome saved to CRM for ${contact.name}`)
    if (onSave) onSave({ outcome: selectedOutcome, summary })
    if (onClose) onClose()
  }

  const handleSkip = () => {
    toast('Call wrapup skipped')
    if (onClose) onClose()
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Call wrap-up summary">
      <div
        className="modal-content"
        style={{
          background: '#ffffff',
          borderRadius: '20px',
          maxWidth: '460px',
          width: '92%',
          padding: '20px 24px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.22)',
          position: 'relative',
          color: '#1e293b',
          fontFamily: 'inherit',
          animation: 'modalSlideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Top drag pill */}
        <div
          style={{
            width: '36px',
            height: '4px',
            background: '#e2e8f0',
            borderRadius: '999px',
            margin: '0 auto 16px auto',
          }}
        />

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: '#ecfdf5',
                color: '#0f766e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Phone size={18} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '16px', color: '#111827' }}>
                Call with {contact.name}
              </div>
              <div style={{ fontSize: '13px', color: '#6b7280' }}>
                {duration} · just now
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: '#f3f4f6',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6b7280',
              cursor: 'pointer',
              transition: 'background 0.15s ease',
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = '#e5e7eb')}
            onMouseOut={(e) => (e.currentTarget.style.background = '#f3f4f6')}
          >
            <X size={15} />
          </button>
        </div>

        {/* AI summary banner */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: '#7c3aed',
            fontWeight: 700,
            fontSize: '11px',
            letterSpacing: '0.6px',
            textTransform: 'uppercase',
            marginBottom: '8px',
          }}
        >
          <Sparkles size={13} />
          <span>AI-DRAFTED SUMMARY — EDIT IF NEEDED</span>
        </div>

        {/* Summary textarea */}
        <textarea
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          rows={3}
          style={{
            width: '100%',
            padding: '12px 14px',
            borderRadius: '10px',
            border: '1px solid #cbd5e1',
            background: '#ffffff',
            fontSize: '13.5px',
            lineHeight: '1.5',
            color: '#1e293b',
            resize: 'none',
            outline: 'none',
            marginBottom: '18px',
            fontFamily: 'inherit',
            boxSizing: 'border-box',
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = '#7c3aed')}
          onBlur={(e) => (e.currentTarget.style.borderColor = '#cbd5e1')}
        />

        {/* Outcome Selector */}
        <div style={{ marginBottom: '22px' }}>
          <div
            style={{
              fontSize: '11px',
              fontWeight: 700,
              color: '#64748b',
              letterSpacing: '0.6px',
              textTransform: 'uppercase',
              marginBottom: '10px',
            }}
          >
            OUTCOME
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {OUTCOMES.map((o) => {
              const isSelected = selectedOutcome === o.id
              return (
                <button
                  key={o.id}
                  onClick={() => setSelectedOutcome(o.id)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '7px 14px',
                    borderRadius: '999px',
                    fontSize: '13px',
                    fontWeight: isSelected ? 600 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    border: isSelected ? '1.5px solid #0f6e56' : '1px solid #e2e8f0',
                    background: isSelected ? '#f0fdf4' : '#ffffff',
                    color: isSelected ? '#0f6e56' : '#475569',
                  }}
                >
                  <span>{o.icon}</span>
                  <span>{o.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={handleSkip}
            style={{
              flex: 1,
              padding: '11px 16px',
              borderRadius: '12px',
              border: '1.5px solid #0f6e56',
              background: 'transparent',
              color: '#0f6e56',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'background 0.15s ease',
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = '#f0fdf4')}
            onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            Skip
          </button>
          <button
            onClick={handleSave}
            style={{
              flex: 1,
              padding: '11px 16px',
              borderRadius: '12px',
              border: 'none',
              background: '#0f6e56',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: '0 2px 6px rgba(15, 110, 86, 0.3)',
              transition: 'background 0.15s ease',
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = '#0d5c48')}
            onMouseOut={(e) => (e.currentTarget.style.background = '#0f6e56')}
          >
            <span>💾</span> Save to CRM
          </button>
        </div>
      </div>
    </div>
  )
}
