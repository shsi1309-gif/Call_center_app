import { useEffect } from 'react'
import { X } from 'lucide-react'

export function RankModal({ onClose }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const metrics = [
    {
      icon: '🏆',
      label: 'OG Score™',
      value: '76',
      weight: '40% weight',
      progress: 76,
    },
    {
      icon: '📞',
      label: 'Leads Called',
      value: '2',
      weight: '20% weight',
      progress: 40,
    },
    {
      icon: '🎯',
      label: 'Leads Created',
      value: '3',
      weight: '15% weight',
      progress: 55,
    },
    {
      icon: '⏱️',
      label: 'Conversation Time',
      value: '62m',
      weight: '15% weight',
      progress: 65,
    },
    {
      icon: '🛺',
      label: 'On-time Delivery',
      value: '92%',
      weight: '10% weight',
      progress: 92,
    },
  ]

  return (
    <div
      className="overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        zIndex: 800,
        padding: '16px',
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
        backdropFilter: 'blur(3px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'fadeIn 0.15s ease-out',
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Staff Rank Breakdown"
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '430px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '24px 22px 22px',
          position: 'relative',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.2)',
          border: '1px solid #e2e8f0',
          animation: 'modalSlideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          color: '#1e293b',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: 'absolute',
            right: '16px',
            top: '16px',
            background: '#f1f5f9',
            border: 'none',
            borderRadius: '50%',
            width: '28px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64748b',
            cursor: 'pointer',
          }}
        >
          <X size={16} />
        </button>

        {/* Top Header */}
        <div style={{ textAlign: 'center', marginTop: '4px' }}>
          <div
            style={{
              fontSize: '34px',
              fontWeight: 800,
              color: '#0f172a',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
            }}
          >
            #3
          </div>
          <div
            style={{
              fontSize: '13px',
              fontWeight: 500,
              color: '#64748b',
              marginTop: '4px',
            }}
          >
            within RT Nagar · 6 staff ranked
          </div>
        </div>

        {/* Gray Explanation Box */}
        <div
          style={{
            backgroundColor: '#f8fafc',
            border: '1px solid #f1f5f9',
            borderRadius: '12px',
            padding: '12px 14px',
            fontSize: '12.5px',
            color: '#475569',
            lineHeight: 1.45,
          }}
        >
          Your rank is a weighted blend of the same numbers in <strong>My Progress</strong> above — not just one metric. Here&apos;s exactly how it adds up this period.
        </div>

        {/* Metrics List with Progress Bars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {metrics.map((m, idx) => (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: '#1e293b' }}>
                  <span>{m.icon}</span>
                  <span>{m.label}</span>
                </div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  <strong style={{ color: '#0f172a', fontSize: '13px' }}>{m.value}</strong> · {m.weight}
                </div>
              </div>
              <div
                style={{
                  height: '6px',
                  backgroundColor: '#e2e8f0',
                  borderRadius: '999px',
                  overflow: 'hidden',
                  width: '100%',
                }}
              >
                <div
                  style={{
                    width: `${m.progress}%`,
                    height: '100%',
                    backgroundColor: '#0d9488',
                    borderRadius: '999px',
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{ height: '1px', backgroundColor: '#e2e8f0', margin: '2px 0' }} />

        {/* Composite Score */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2px' }}>
          <span style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>
            Composite score
          </span>
          <span style={{ fontSize: '15px', fontWeight: 800, color: '#0d9488' }}>
            66.9 / 100
          </span>
        </div>

        {/* Dark Green Tip Box */}
        <div
          style={{
            backgroundColor: '#0d281e',
            borderRadius: '12px',
            padding: '14px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            color: '#ffffff',
            fontSize: '12.5px',
            lineHeight: 1.45,
            boxShadow: '0 4px 12px rgba(13, 40, 30, 0.25)',
          }}
        >
          <span style={{ fontSize: '16px', lineHeight: 1 }}>💡</span>
          <div>
            Closing 1 more lead this week would add ~4 points — enough to pass #2.{' '}
            <strong>Leads Called</strong> is your fastest lever right now.
          </div>
        </div>

        {/* Settings Footnote */}
        <div
          style={{
            fontSize: '11px',
            color: '#94a3b8',
            textAlign: 'center',
            lineHeight: 1.4,
            padding: '0 8px',
          }}
        >
          Weights are store defaults, set by your manager under Settings → Customer Interaction preferences.
        </div>
      </div>
    </div>
  )
}
