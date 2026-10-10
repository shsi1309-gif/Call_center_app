import { MessageSquare, MicOff, Hand, UserCheck, UserPlus, X } from 'lucide-react'

const RULES = [
  {
    id: 'ask_first',
    icon: MessageSquare,
    iconBg: '#e1f5ee',
    iconColor: '#0f6e56',
    title: 'Ask first',
    sec: 'Sec 5–6',
    desc: 'Read the line, then send it on WhatsApp. Nothing records until they tap Yes.',
  },
  {
    id: 'no_means_no',
    icon: MicOff,
    iconBg: '#e0e7ff',
    iconColor: '#4338ca',
    title: 'No means no',
    sec: 'Sec 6',
    desc: 'Carry on without recording. Offers stay off unless they say yes.',
  },
  {
    id: 'stop_means_stop',
    icon: Hand,
    iconBg: '#fee2e2',
    iconColor: '#dc2626',
    title: 'Stop means stop',
    sec: 'Sec 6',
    desc: 'The app stops recording itself the moment it hears it.',
  },
  {
    id: 'dpo_questions',
    icon: UserCheck,
    iconBg: '#ede9fe',
    iconColor: '#6d28d9',
    title: 'Data questions go to the DPO',
    sec: 'Sec 11–14',
    desc: "One tap. They get a reference number. Don't promise anything.",
  },
  {
    id: 'under_18',
    icon: UserPlus,
    iconBg: '#ffedd5',
    iconColor: '#ea580c',
    title: 'Under 18 needs a parent',
    sec: 'Sec 9',
    desc: 'Switch on "Under 18?" and the parent says yes.',
  },
]

export function DpdpSafeModal({ onClose }) {
  return (
    <div
      className="overlay"
      onClick={(e) => e.target === e.currentTarget && onClose?.()}
      style={{ zIndex: 650, padding: '16px' }}
      role="dialog"
      aria-modal="true"
      aria-label="How this app keeps you DPDP-safe"
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '20px',
          width: '100%',
          maxWidth: '520px',
          padding: '22px 24px 20px',
          position: 'relative',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
          animation: 'modalSlideUp 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          color: '#1e293b',
          fontFamily: 'inherit',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: '0 0 3px 0' }}>
              How this app keeps you DPDP-safe
            </h2>
            <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
              Five rules. The app does most of the work.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
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
              transition: 'background 0.15s ease',
              marginTop: '-2px',
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = '#e2e8f0')}
            onMouseOut={(e) => (e.currentTarget.style.background = '#f1f5f9')}
          >
            <X size={15} />
          </button>
        </div>

        {/* Rules List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '18px' }}>
          {RULES.map((rule) => {
            const Icon = rule.icon
            return (
              <div key={rule.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '10px',
                    background: rule.iconBg,
                    color: rule.iconColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px',
                  }}
                >
                  <Icon size={16} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                    <strong style={{ fontSize: '13.5px', fontWeight: 700, color: '#0f172a' }}>
                      {rule.title}
                    </strong>
                    <span style={{ fontSize: '11px', fontWeight: 600, color: '#94a3b8', letterSpacing: '0.2px' }}>
                      {rule.sec}
                    </span>
                  </div>
                  <p style={{ fontSize: '12.5px', color: '#64748b', margin: '2px 0 0 0', lineHeight: 1.45 }}>
                    {rule.desc}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div
          style={{
            borderTop: '1px solid #f1f5f9',
            paddingTop: '12px',
            fontSize: '11.5px',
            color: '#64748b',
            lineHeight: 1.4,
          }}
        >
          Every tap is logged for your DPO, on a trail nobody can quietly change.
        </div>
      </div>
    </div>
  )
}
