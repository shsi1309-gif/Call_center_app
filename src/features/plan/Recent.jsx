import { useState } from 'react'
import { ChevronRight, PhoneIncoming, PhoneMissed, PhoneOutgoing } from 'lucide-react'
import { RECENT_CALLS } from '../../data/plan'
import { CallDetailModal } from './CallDetailModal'

const KIND_ICON = { completed: PhoneIncoming, outgoing: PhoneOutgoing, missed: PhoneMissed }

export function Recent() {
  const [selected, setSelected] = useState(null)

  return (
    <section className="plan-section">
      <h2 className="plan-section__title">Recent calls</h2>
      <p className="plan-section__sub">Tap a call to review it against SOP</p>
      <ul className="plan-list">
        {RECENT_CALLS.map((c) => {
          const Icon = KIND_ICON[c.kind]

          return (
            <li key={c.id} className="plan-card">
              <button className="plan-row" onClick={() => setSelected(c)} aria-label={`Review call with ${c.name}`}>
                <span className={`call-icon call-icon--${c.kind}`}>
                  <Icon size={16} />
                </span>
                <span className="plan-row__text">
                  <strong>{c.name}</strong>
                  <span>
                    {c.when} · {c.duration ?? '—'}
                  </span>
                </span>
                <ChevronRight size={16} className="plan-row__chev" />
              </button>
            </li>
          )
        })}
      </ul>
      {selected && <CallDetailModal call={selected} onClose={() => setSelected(null)} />}
    </section>
  )
}
