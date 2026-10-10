import { useState } from 'react'
import { Grip, PhoneCall, PhoneMissed } from 'lucide-react'
import { MISSED_CALLS } from '../../data/plan'
import { useCall } from '../../context/CallContext'
import { DialerModal } from '../../components/layout/DialerModal'
import { formatRupees } from '../../utils/format'

export function Incoming() {
  const [calledBack, setCalledBack] = useState(new Set())
  const [dialerOpen, setDialerOpen] = useState(false)
  const { startCall } = useCall()
  const total = MISSED_CALLS.reduce((sum, c) => sum + (c.expectedValue ?? 0), 0)

  return (
    <section className="plan-section" style={{ position: 'relative' }}>
      <h2 className="plan-section__title">Missed calls</h2>
      <p className="plan-section__sub">Ranked by expected value — call the highest-value leads back first</p>

      {/* Missed Calls Summary */}
      <div className="missed-summary">
        <div>
          <b>{MISSED_CALLS.length}</b>
          <small>MISSED TODAY</small>
        </div>
        <div>
          <b className="missed-summary__value">{formatRupees(total)}</b>
          <small>EXPECTED VALUE AT STAKE</small>
        </div>
      </div>

      {/* Missed Calls List */}
      <ul className="plan-list">
        {MISSED_CALLS.map((c) => {
          const done = calledBack.has(c.id)

          return (
            <li key={c.id} className="plan-card plan-row plan-row--static" style={{ padding: '12px 14px' }}>
              <span className="missed-icon">
                <PhoneMissed size={16} />
              </span>
              <span className="plan-row__text" style={{ paddingLeft: '4px' }}>
                <strong style={{ fontSize: '15px', color: '#111827' }}>{c.name}</strong>
                <span style={{ fontSize: '13px', color: '#6b7280', marginTop: '2px' }}>
                  {c.when} · {c.context}
                </span>
              </span>
              <span className="missed-action" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                <span
                  style={{
                    fontWeight: 700,
                    fontSize: '13.5px',
                    color: c.expectedValue ? '#0f6e56' : '#6b7280',
                  }}
                >
                  {c.expectedValue ? `${formatRupees(c.expectedValue)} expected` : 'New contact'}
                </span>
                <button
                  className="btn btn--primary btn--sm"
                  disabled={done}
                  onClick={() => {
                    setCalledBack((s) => new Set(s).add(c.id))
                    startCall(
                      {
                        name: c.name,
                        initials: c.initials,
                        detail: '+91 98450 61245',
                        phone: '98450 61245',
                        callType: 'Call centre',
                      },
                      'callback',
                    )
                  }}
                  aria-label={`${done ? 'Called back' : 'Call back'} ${c.name}`}
                  style={{
                    background: done ? '#94a3b8' : '#0f6e56',
                    color: '#fff',
                    borderRadius: '8px',
                    padding: '6px 14px',
                    fontSize: '12.5px',
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    border: 'none',
                    cursor: done ? 'default' : 'pointer',
                  }}
                >
                  <PhoneCall size={13} /> {done ? 'Called back' : 'Call back'}
                </button>
              </span>
            </li>
          )
        })}
      </ul>

      {/* Floating purple dialpad button */}
      <button
        onClick={() => setDialerOpen(true)}
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

      <DialerModal
        isOpen={dialerOpen}
        onClose={() => setDialerOpen(false)}
        onCallStarted={(num) =>
          startCall(
            {
              name: 'Manual Dial',
              phone: num,
              callType: 'Call centre',
            },
            'outgoing',
          )
        }
      />
    </section>
  )
}
