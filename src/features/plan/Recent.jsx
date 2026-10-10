import { useState } from 'react'
import { ChevronRight, Grip, PhoneIncoming, PhoneMissed, PhoneOutgoing } from 'lucide-react'
import { RECENT_CALLS } from '../../data/plan'
import { CallDetailModal } from './CallDetailModal'
import { PhoneCallConsentModal } from '../../components/layout/PhoneCallConsentModal'

const KIND_ICON = { completed: PhoneIncoming, outgoing: PhoneOutgoing, missed: PhoneMissed }

export function Recent() {
  const [selected, setSelected] = useState(null)
  const [consentContact, setConsentContact] = useState(null)

  return (
    <section className="plan-section" style={{ position: 'relative' }}>
      <h2 className="plan-section__title">Recent calls</h2>
      <p className="plan-section__sub">Tap a call to review it against SOP</p>
      <ul className="plan-list">
        {RECENT_CALLS.map((c) => {
          const Icon = KIND_ICON[c.kind]

          return (
            <li key={c.id} className="plan-card">
              <button
                className="plan-row"
                onClick={() => setSelected(c)}
                aria-label={`Review call with ${c.name}`}
                style={{ padding: '12px 14px', alignItems: 'center' }}
              >
                <span className={`call-icon call-icon--${c.kind}`}>
                  <Icon size={16} />
                </span>
                <span className="plan-row__text" style={{ paddingLeft: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <strong style={{ fontSize: '15px', color: '#111827' }}>{c.name}</strong>
                    {c.badge && (
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '6px',
                          background: c.badgeTone === 'green' ? '#e1f5ee' : '#f1f5f9',
                          color: c.badgeTone === 'green' ? '#0f6e56' : '#475569',
                        }}
                      >
                        {c.badge}
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: '13px', color: '#6b7280', marginTop: '2px' }}>
                    {c.when} · {c.duration ?? '—'}
                  </span>
                </span>
                <ChevronRight size={18} style={{ color: '#cbd5e1' }} />
              </button>
            </li>
          )
        })}
      </ul>

      {/* Floating purple dialpad button */}
      <button
        onClick={() => setConsentContact({ name: 'Dialer', phone: '98450 61245' })}
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
          boxShadow: '0 4px 14px rgba(79, 70, 229, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 360,
        }}
      >
        <Grip size={22} />
      </button>

      {selected && <CallDetailModal call={selected} onClose={() => setSelected(null)} />}
      {consentContact && (
        <PhoneCallConsentModal contact={consentContact} onClose={() => setConsentContact(null)} />
      )}
    </section>
  )
}
