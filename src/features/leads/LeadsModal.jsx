import { useState } from 'react'
import { ChevronLeft, ChevronRight, IndianRupee, Receipt, ShieldCheck, Users } from 'lucide-react'
import { Modal } from '../../components/ui/Modal'
import { Avatar } from '../../components/ui/Avatar'
import { CollapsibleSection } from './CollapsibleSection'
import { clampIndex } from '../../utils/pagination'
import { formatRupees } from '../../utils/format'
import { useCall } from '../../context/CallContext'
import { useToast } from '../../context/ToastContext'
import './LeadsModal.css'

const SIGNAL_ICON = { financing: IndianRupee, quotation: Receipt, warranty: ShieldCheck }

export function LeadsModal({ leads, startIndex = 0, onClose }) {
  const [index, setIndex] = useState(() => clampIndex(startIndex, leads.length))
  const { startCall } = useCall()
  const toast = useToast()
  const lead = leads[index]
  const isFirst = index === 0
  const isLast = index === leads.length - 1
  const go = (delta) => setIndex((i) => clampIndex(i + delta, leads.length))

  return (
    <Modal title="Leads" subtitle={`Lead ${index + 1} of ${leads.length} · SLA to close`} icon={<Users size={18} />} onClose={onClose}>
      <div className="lm__pager">
        <button className="lm__nav" onClick={() => go(-1)} disabled={isFirst} aria-label="Previous lead">
          <ChevronLeft size={16} />
        </button>
        <div className="lm__dots" aria-hidden="true">
          {leads.map((l, i) => (
            <span key={l.id} className={i === index ? 'is-on' : ''} />
          ))}
        </div>
        <button className="lm__nav" onClick={() => go(1)} disabled={isLast} aria-label="Next lead">
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="lm__body" key={lead.id}>
        <div className="lm__status">
          <span />
          OPEN
        </div>
        <div className="lm__who">
          <Avatar initials={lead.initials} />
          <div className="lm__who-text">
            <strong>{lead.name}</strong>
            <span>
              Interested: {lead.interest} · {formatRupees(lead.value)}
            </span>
          </div>
          <span className="lm__sla">{lead.slaLeft}</span>
        </div>
        <div className="lm__action">🧾 {lead.action}</div>

        <div className="lm__icp">
          <span>🎯 ICP</span>
          <div className="lm__bar" role="progressbar" aria-label="ICP fit" aria-valuenow={lead.icp} aria-valuemin={0} aria-valuemax={100}>
            <div style={{ width: `${lead.icp}%` }} />
          </div>
          <b>{lead.icp}%</b>
        </div>
        <div className="lm__intent">
          <span>🎯 Lead Intent Score</span>
          <b>{lead.intent}</b>
        </div>

        <CollapsibleSection tone="neutral" title="ICP FIT BREAKDOWN">
          {lead.breakdown.map((b) => (
            <div className="lm__row" key={b.label}>
              <span>{b.label}</span>
              <b>{b.pct}%</b>
            </div>
          ))}
        </CollapsibleSection>
        <CollapsibleSection tone="purple" title="↯ HOW WE GOT HERE">
          {lead.journey.map((j) => (
            <div className="lm__step" key={`${j.date}-${j.channel}`}>
              <span className="lm__step-icon">{j.icon}</span>
              <div>
                <small>
                  {j.date} · {j.channel}
                </small>
                <p>{j.text}</p>
              </div>
            </div>
          ))}
        </CollapsibleSection>
        <CollapsibleSection tone="amber" defaultOpen title="📋 WHERE WE PICKED UP SIGNALS">
          {lead.signals.map((s) => {
            const Icon = SIGNAL_ICON[s.kind]

            return (
              <div className="lm__signal" key={s.kind}>
                <h3>
                  <Icon size={13} /> {s.title}
                </h3>
                <p>{s.text}</p>
              </div>
            )
          })}
        </CollapsibleSection>

        <div className="lm__tips">
          <div className="section-label">Before you reach out</div>
          <ul>
            {lead.tips.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
        <div className="lm__actions">
          <button className="btn btn--ghost" onClick={() => toast(`${lead.name} marked as No Interest`)}>
            No Interest
          </button>
          <button className="btn btn--ghost" onClick={() => toast(`WhatsApp message drafted for ${lead.name}`)}>
            WhatsApp
          </button>
          <button
            className="btn btn--primary"
            onClick={() => {
              startCall({ name: lead.name, initials: lead.initials, detail: lead.phone }, 'outgoing')
              onClose()
            }}
          >
            On-ground Call
          </button>
          <button className="btn btn--ghost" onClick={() => toast(`${lead.name} marked as Came Back`)}>
            Came Back ✓
          </button>
        </div>
      </div>

      <footer className="lm__footer">
        <span /> <b>CUMULATIVE MISSED: {lead.missed}</b> · expired without close, visible to manager
      </footer>
    </Modal>
  )
}
