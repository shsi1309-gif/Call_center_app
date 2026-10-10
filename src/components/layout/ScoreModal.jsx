import { useEffect } from 'react'
import { GraduationCap, X } from 'lucide-react'
import { useToast } from '../../context/ToastContext'
import { useCall } from '../../context/CallContext'

export function ScoreModal({ onClose }) {
  const toast = useToast()
  const { startPractice } = useCall()

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const handlePractice = () => {
    onClose()
    startPractice()
  }

  const handleLinkedIn = () => {
    toast('Announced OG Score™ 76 (#3 in Store) to LinkedIn!')
  }

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
      aria-label="OG Score Details"
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '430px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '22px 22px 24px',
          position: 'relative',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.2)',
          border: '2.5px solid #facc15',
          animation: 'modalSlideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          color: '#1e293b',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
        }}
      >
        {/* Top Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <div
            style={{
              fontSize: '12px',
              fontWeight: 800,
              color: '#64748b',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            OG SCORE™
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              position: 'absolute',
              right: 0,
              top: '-4px',
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
        </div>

        {/* Circular Gauge Score */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div
            style={{
              width: '84px',
              height: '84px',
              borderRadius: '50%',
              border: '5px solid #10b981',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.15)',
              marginBottom: '8px',
              backgroundColor: '#ffffff',
            }}
          >
            <span style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>76</span>
            <span style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 600 }}>/ 100</span>
          </div>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#059669' }}>
            ▲ +13 since period start
          </div>
          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
            72nd percentile across all staff
          </div>
        </div>

        {/* Radar / Spider Chart */}
        <div style={{ display: 'flex', justifyContent: 'center', margin: '4px 0' }}>
          <svg width="270" height="185" viewBox="0 0 270 185" style={{ overflow: 'visible' }}>
            {/* Concentric Guide Hexagons */}
            {[0.33, 0.66, 1.0].map((scale, sIdx) => {
              const r = 58 * scale
              const cx = 135
              const cy = 92
              const points = [
                `${cx},${cy - r}`,
                `${cx + r * 0.866},${cy - r * 0.5}`,
                `${cx + r * 0.866},${cy + r * 0.5}`,
                `${cx},${cy + r}`,
                `${cx - r * 0.866},${cy + r * 0.5}`,
                `${cx - r * 0.866},${cy - r * 0.5}`,
              ].join(' ')
              return (
                <polygon
                  key={sIdx}
                  points={points}
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth={scale === 1 ? '1.5' : '1'}
                />
              )
            })}

            {/* Axis Spokes */}
            {[
              [135, 34],
              [185, 63],
              [185, 121],
              [135, 150],
              [85, 121],
              [85, 63],
            ].map(([x, y], i) => (
              <line key={i} x1="135" y1="92" x2={x} y2={y} stroke="#e2e8f0" strokeWidth="1" />
            ))}

            {/* Data Polygon */}
            {/* Values: Follow-up 0.90, Greeting 0.80, Product Knowledge 0.82, Warranty 0.70, Objections 0.65, Closing 0.58 */}
            <polygon
              points="135,40 176,69 174,115 135,133 99,111 106,75"
              fill="rgba(16, 185, 129, 0.16)"
              stroke="#10b981"
              strokeWidth="2"
            />

            {/* Data Vertex Dots */}
            {[
              [135, 40],
              [176, 69],
              [174, 115],
              [135, 133],
              [99, 111],
              [106, 75],
            ].map(([vx, vy], vi) => (
              <circle key={vi} cx={vx} cy={vy} r="3" fill="#10b981" stroke="#fff" strokeWidth="1" />
            ))}

            {/* Axis Labels */}
            <text x="135" y="24" textAnchor="middle" fontSize="10" fontWeight="600" fill="#64748b">
              Follow-up
            </text>
            <text x="194" y="66" textAnchor="start" fontSize="10" fontWeight="600" fill="#64748b">
              Greeting
            </text>
            <text x="194" y="126" textAnchor="start" fontSize="10" fontWeight="600" fill="#64748b">
              Product Knowledge
            </text>
            <text x="135" y="165" textAnchor="middle" fontSize="10" fontWeight="600" fill="#64748b">
              Warranty
            </text>
            <text x="76" y="126" textAnchor="end" fontSize="10" fontWeight="600" fill="#64748b">
              Objections
            </text>
            <text x="76" y="66" textAnchor="end" fontSize="10" fontWeight="600" fill="#64748b">
              Closing
            </text>
          </svg>
        </div>

        {/* Earning Potential Card */}
        <div
          style={{
            backgroundColor: '#fffdf5',
            border: '1px solid #fef08a',
            borderRadius: '14px',
            padding: '12px 14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', fontWeight: 700, color: '#78350f' }}>
            <span style={{ fontSize: '15px' }}>🔥</span>
            <span>
              Top 28% on OG Score™ · +5pts unlocks <strong style={{ color: '#047857' }}>+4% earning potential</strong>
            </span>
          </div>

          {/* Slider / Segment Bar */}
          <div style={{ position: 'relative', height: '8px', backgroundColor: '#e2e8f0', borderRadius: '999px', overflow: 'hidden' }}>
            <div
              style={{
                width: '76%',
                height: '100%',
                background: 'linear-gradient(90deg, #34d399, #059669)',
                borderRadius: '999px',
              }}
            />
            {/* Divider Marker */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: '76%',
                width: '2px',
                backgroundColor: '#0f172a',
              }}
            />
          </div>

          <div style={{ fontSize: '11.5px', color: '#78350f', lineHeight: 1.4 }}>
            This is why OG Score™ matters — it&apos;s the single number most closely tied to your earning potential. Keep an eye on it every week.
          </div>
        </div>

        {/* Your biggest lever right now Card */}
        <div
          style={{
            backgroundColor: '#fff5f5',
            border: '1px solid #fecdd3',
            borderRadius: '14px',
            padding: '12px 14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#991b1b', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>✨</span>
            <span>Your biggest lever right now</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px', color: '#334155', lineHeight: 1.4 }}>
            <div>
              🔴 <strong>Closing (58)</strong> — great rapport, but the ask for the sale often doesn&apos;t happen.
            </div>
            <div>
              🟠 <strong>Objections (65)</strong> — EMI/price pushback stalls more than it resolves.
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '2px' }}>
          <button
            onClick={handlePractice}
            style={{
              width: '100%',
              backgroundColor: '#0f6e56',
              color: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              padding: '11px',
              fontSize: '13.5px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(15, 110, 86, 0.25)',
              transition: 'background-color 0.15s ease',
            }}
          >
            <GraduationCap size={16} />
            <span>Practise these 2 skills →</span>
          </button>

          <button
            onClick={handleLinkedIn}
            style={{
              width: '100%',
              backgroundColor: '#0a66c2',
              color: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              padding: '11px',
              fontSize: '13.5px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(10, 102, 194, 0.25)',
              transition: 'background-color 0.15s ease',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76c.97 0 1.76-.79 1.76-1.76a1.76 1.76 0 0 0-1.76-1.76 1.76 1.76 0 0 0-1.76 1.76c0 .97.79 1.76 1.76 1.76m1.4 9.74v-8.37H5.06v8.37h2.8z" />
            </svg>
            <span>Announce this on LinkedIn</span>
          </button>
        </div>
      </div>
    </div>
  )
}
