import { useState } from 'react'
import { PhoneMissed, PhoneCall } from 'lucide-react'
import { MISSED_CALLS } from '../../data/plan'
import { useCall } from '../../context/CallContext'
import { formatRupees } from '../../utils/format'

export function Incoming() {
  const [calledBack, setCalledBack] = useState(new Set())
  const { startCall } = useCall()
  const total = MISSED_CALLS.reduce((sum, c) => sum + (c.expectedValue ?? 0), 0)

  return (
    <section className="plan-section">
      <h2 className="plan-section__title">Missed calls</h2>
      <p className="plan-section__sub">Ranked by expected value — call the highest-value leads back first</p>
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
      <ul className="plan-list">
        {MISSED_CALLS.map((c) => {
          const done = calledBack.has(c.id)

          return (
            <li key={c.id} className="plan-card plan-row plan-row--static">
              <span className="missed-icon">
                <PhoneMissed size={16} />
              </span>
              <span className="plan-row__text">
                <strong>{c.name}</strong>
                <span>
                  {c.when} · {c.context}
                </span>
              </span>
              <span className="missed-action">
                <span className={c.expectedValue ? 'missed-action__value' : 'missed-action__new'}>
                  {c.expectedValue ? `${formatRupees(c.expectedValue)} expected` : 'New contact'}
                </span>
                <button
                  className="btn btn--primary btn--sm"
                  disabled={done}
                  onClick={() => {
                    setCalledBack((s) => new Set(s).add(c.id))
                    startCall({ name: c.name, initials: c.initials, detail: 'Calling back…' }, 'callback')
                  }}
                  aria-label={`${done ? 'Called back' : 'Call back'} ${c.name}`}
                >
                  <PhoneCall size={12} /> {done ? 'Called back' : 'Call back'}
                </button>
              </span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
