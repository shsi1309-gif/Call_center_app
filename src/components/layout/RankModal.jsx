import { useEffect } from 'react'

const RANK_WEIGHTS = [
  { key: 'og', label: 'OG Score™', icon: '🏆', value: 76, max: 100, weight: 40 },
  { key: 'called', label: 'Leads Called', icon: '📞', value: 2, max: 5, weight: 20 },
  { key: 'created', label: 'Leads Created', icon: '🎯', value: 3, max: 5, weight: 15 },
  { key: 'convtime', label: 'Conversation Time', icon: '⏱️', value: 62, max: 120, weight: 15 },
  { key: 'delivery', label: 'On-time Delivery', icon: '🛺', value: 92, max: 100, weight: 10 },
]

export function RankModal({ onClose }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{ zIndex: 600, padding: '16px' }}
      role="dialog"
      aria-modal="true"
      aria-label="Your Rank"
    >
      <div
        style={{
          background: '#fff',
          borderRadius: '20px',
          width: '100%',
          maxWidth: '520px',
          padding: '20px 22px 24px',
          position: 'relative',
          boxShadow: '0 20px 30px rgba(0,0,0,0.15)',
          animation: 'scaleIn 0.2s ease-out',
        }}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: '#f0f0f3',
            border: 'none',
            borderRadius: '50%',
            width: '28px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#8e8e93',
            fontSize: '13px',
            cursor: 'pointer',
          }}
        >
          ✕
        </button>

        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#0f6e56', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '6px' }}>
            YOUR RANK
          </div>
          <div style={{ fontSize: '42px', fontWeight: 800, color: '#1a1a1a', lineHeight: 1 }}>#3</div>
          <div style={{ fontSize: '13px', color: '#8e8e93', marginTop: '4px' }}>
            within <span style={{ color: '#1a1a1a', fontWeight: 600 }}>RT Nagar</span> · 6 staff ranked
          </div>
        </div>

        <div style={{ background: '#f7f7f5', borderRadius: '12px', padding: '12px 14px', marginBottom: '16px' }}>
          <div style={{ fontSize: '12.5px', color: '#4b4b52', lineHeight: 1.5 }}>
            Your rank is a weighted blend of the same numbers in <b>My Progress</b> above — not just one metric. Here's exactly how it adds up this period.
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '14px' }}>
          {RANK_WEIGHTS.map((r) => {
            const achievement = Math.min(1, r.value / r.max)
            const valLabel = r.key === 'convtime' ? `${r.value}m` : r.key === 'delivery' ? `${r.value}%` : r.value

            return (
              <div key={r.key}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#1a1a1a' }}>
                    {r.icon} {r.label}
                  </span>
                  <span style={{ fontSize: '12.5px', color: '#8e8e93' }}>
                    <b style={{ color: '#1a1a1a' }}>{valLabel}</b> · {r.weight}% weight
                  </span>
                </div>
                <div style={{ height: '6px', background: '#eef0f2', borderRadius: '99px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${(achievement * 100).toFixed(0)}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg,#5dcaa5,#1d9e75)',
                      borderRadius: '99px',
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid #eee', marginBottom: '12px' }}>
          <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#1a1a1a' }}>Composite score</span>
          <span style={{ fontSize: '15px', fontWeight: 800, color: '#0f6e56' }}>66.9 / 100</span>
        </div>

        <div style={{ background: 'linear-gradient(135deg,#0a1a14,#1d3a2e)', borderRadius: '12px', padding: '12px 14px', color: '#fff', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <span style={{ fontSize: '16px', color: '#FFD700', flexShrink: 0 }}>💡</span>
            <span style={{ fontSize: '12.5px', lineHeight: 1.45, color: '#e6f4ea' }}>
              Closing 1 more lead this week would add ~4 points — enough to pass #2. <b>Leads Called</b> is your fastest lever right now.
            </span>
          </div>
        </div>

        <div style={{ fontSize: '11px', color: '#8e8e93', textAlign: 'center', cursor: 'pointer' }}>
          Weights are store defaults, set by your manager under Settings →
        </div>
      </div>
    </div>
  )
}
