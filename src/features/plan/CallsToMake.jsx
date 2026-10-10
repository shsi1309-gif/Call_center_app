import { useState } from 'react'
import { ChevronDown, MessageCircle, Phone, UserSearch } from 'lucide-react'
import { RANKED_LEADS } from '../../data/leads'
import { Avatar } from '../../components/ui/Avatar'
import { Pagination } from './Pagination'
import { LeadsModal } from '../leads/LeadsModal'
import { useCall } from '../../context/CallContext'
import { useToast } from '../../context/ToastContext'
import { formatRupees } from '../../utils/format'
import { pageCount, paginate } from '../../utils/pagination'

const PAGE_SIZE = 2

const AVATAR_TONES = [
  { background: '#fdeede', color: '#c2410c' },
  { background: '#e1f5ee', color: '#0f6e56' },
  { background: '#e3effd', color: '#1d4ed8' },
]

export function CallsToMake() {
  const [page, setPage] = useState(1)
  const [expandedId, setExpandedId] = useState(null)
  const [modalIndex, setModalIndex] = useState(null)
  const { startCall } = useCall()
  const toast = useToast()
  const pages = pageCount(RANKED_LEADS.length, PAGE_SIZE)
  const rows = paginate(RANKED_LEADS, page, PAGE_SIZE)
  const changePage = (p) => {
    setPage(p)
    setExpandedId(null)
  }

  return (
    <section className="plan-section">
      <h2 className="plan-section__title">Planned outgoing calls</h2>
      <p className="plan-section__sub">Ranked by lead attractiveness score — tap a lead for the full picture</p>
      <ul className="plan-list">
        {rows.map((lead) => {
          const open = expandedId === lead.id
          const rank = RANKED_LEADS.indexOf(lead)
          const tone = AVATAR_TONES[rank % AVATAR_TONES.length]

          return (
            <li key={lead.id} className="plan-card">
              <button className="plan-row" aria-expanded={open} onClick={() => setExpandedId(open ? null : lead.id)}>
                <Avatar initials={lead.initials} {...tone} />
                <span className="plan-row__text">
                  <strong>{lead.name}</strong>
                  <span>
                    Interested: {lead.interest} · {formatRupees(lead.value)}
                  </span>
                </span>
                <span className="plan-row__score">
                  <b>{lead.score}</b>
                  <small>SCORE</small>
                </span>
                <ChevronDown size={16} className={`plan-row__chev ${open ? 'is-open' : ''}`} />
              </button>
              {open && (
                <div className="plan-detail">
                  <dl>
                    <div>
                      <dt>Phone</dt>
                      <dd>{lead.phone}</dd>
                    </div>
                    <div>
                      <dt>Last touch</dt>
                      <dd>{lead.lastTouch}</dd>
                    </div>
                    <div>
                      <dt>Next step</dt>
                      <dd>{lead.action}</dd>
                    </div>
                  </dl>
                  <p className="plan-detail__opener">“{lead.opener}”</p>
                  <div className="plan-detail__actions">
                    <button
                      className="btn btn--primary"
                      onClick={() => startCall({ name: lead.name, initials: lead.initials, detail: lead.phone }, 'outgoing')}
                    >
                      <Phone size={14} /> Call now
                    </button>
                    <button className="btn btn--ghost" onClick={() => toast(`WhatsApp message drafted for ${lead.name}`)}>
                      <MessageCircle size={14} /> WhatsApp
                    </button>
                    <button className="btn btn--ghost" onClick={() => setModalIndex(rank)}>
                      <UserSearch size={14} /> Full picture
                    </button>
                  </div>
                </div>
              )}
            </li>
          )
        })}
      </ul>
      <Pagination page={page} pages={pages} onChange={changePage} />
      {modalIndex !== null && <LeadsModal leads={RANKED_LEADS} startIndex={modalIndex} onClose={() => setModalIndex(null)} />}
    </section>
  )
}
