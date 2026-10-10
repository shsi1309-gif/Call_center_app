import { Check, ClipboardList, X } from 'lucide-react'

const DEFAULT_SOP_ITEMS = [
  { title: 'Opening & Intent Confirm', status: 'pass', quote: '"Hi, calling about your enquiry — good time to talk?"' },
  { title: 'Needs Discovery', status: 'pass', quote: '"So tell me, what are you looking for exactly?"' },
  { title: 'Product Pitch', status: 'missed', reason: "Jumped to price before confirming the customer's actual need." },
  { title: 'EMI / Financing Mention', status: 'pass', quote: '"There\'s an EMI option starting at ₹1,200/month."' },
  { title: 'Warranty Mention', status: 'missed', reason: 'No warranty details were shared.' },
  { title: 'Closing / Callback Booking', status: 'missed', reason: 'Call ended without confirming a next step or callback time.' },
]

export function CallDetailModal({ call, onClose }) {
  const items = call.sopItems && call.sopItems.length > 0 ? call.sopItems : DEFAULT_SOP_ITEMS
  const score = call.sopScore ?? 50
  const isHigh = score >= 80
  const scoreColor = isHigh ? '#0f6e56' : '#d97706'

  return (
    <div
      className="overlay"
      onClick={(e) => e.target === e.currentTarget && onClose?.()}
      style={{ zIndex: 650, padding: '16px' }}
      role="dialog"
      aria-modal="true"
      aria-label={`Call with ${call.name}`}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '20px',
          width: '100%',
          maxWidth: '480px',
          padding: '20px 24px 24px',
          position: 'relative',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.22)',
          animation: 'modalSlideUp 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          color: '#1e293b',
          fontFamily: 'inherit',
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
                borderRadius: '10px',
                background: '#f3e8ff',
                color: '#7c3aed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ClipboardList size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '16px', color: '#111827' }}>
                Call with {call.name}
              </div>
              <div style={{ fontSize: '13px', color: '#6b7280' }}>
                {call.when || 'Just now'} · {call.duration || '01:52'}
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

        {/* SOP Adherence Bar */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', letterSpacing: '0.3px', textTransform: 'uppercase' }}>
              SOP adherence on this call
            </span>
            <span style={{ fontSize: '16px', fontWeight: 800, color: scoreColor }}>
              {score}%
            </span>
          </div>
          <div
            style={{
              width: '100%',
              height: '6px',
              background: '#f1f5f9',
              borderRadius: '999px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${score}%`,
                height: '100%',
                background: scoreColor,
                borderRadius: '999px',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>

        {/* SOP Checklist */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {items.map((item, idx) => {
            const isPass = item.status === 'pass'
            return (
              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <span
                  style={{
                    color: isPass ? '#0f6e56' : '#dc2626',
                    fontWeight: 800,
                    fontSize: '14px',
                    lineHeight: '18px',
                    marginTop: '1px',
                  }}
                >
                  {isPass ? '✓' : '✕'}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                    <strong style={{ fontSize: '13.5px', fontWeight: 700, color: '#0f172a' }}>
                      {item.title}
                    </strong>
                    {!isPass && (
                      <span
                        style={{
                          background: '#fee2e2',
                          color: '#dc2626',
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '1px 6px',
                          borderRadius: '4px',
                        }}
                      >
                        Missed
                      </span>
                    )}
                  </div>
                  {isPass ? (
                    <div style={{ fontSize: '12.5px', fontStyle: 'italic', color: '#64748b', marginTop: '2px' }}>
                      {item.quote}
                    </div>
                  ) : (
                    <div style={{ fontSize: '12.5px', color: '#b91c1c', marginTop: '2px' }}>
                      {item.reason}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
