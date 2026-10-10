import { useState } from 'react'
import { ChevronDown, Grip, Phone } from 'lucide-react'
import { RANKED_LEADS } from '../../data/leads'
import { Avatar } from '../../components/ui/Avatar'
import { Pagination } from './Pagination'
import { LeadsModal } from '../leads/LeadsModal'
import { PhoneCallConsentModal } from '../../components/layout/PhoneCallConsentModal'
import { DialerModal } from '../../components/layout/DialerModal'
import { useCall } from '../../context/CallContext'
import { formatRupees } from '../../utils/format'
import { pageCount, paginate } from '../../utils/pagination'

const PAGE_SIZE = 2

const AVATAR_TONES = [
  { background: '#fdeede', color: '#c2410c' },
  { background: '#e1f5ee', color: '#0f6e56' },
  { background: '#e3effd', color: '#1d4ed8' },
]

export function CallsToMake() {
  const { startCall } = useCall()
  const [page, setPage] = useState(1)
  const [expandedId, setExpandedId] = useState('ritu') // start with top lead expanded as in mock
  const [modalIndex, setModalIndex] = useState(null)
  const [consentContact, setConsentContact] = useState(null)
  const [dialerOpen, setDialerOpen] = useState(false)

  const pages = pageCount(RANKED_LEADS.length, PAGE_SIZE)
  const rows = paginate(RANKED_LEADS, page, PAGE_SIZE)

  const changePage = (p) => {
    setPage(p)
    setExpandedId(null)
  }

  return (
    <section className="plan-section" style={{ position: 'relative' }}>
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
                <div className="plan-detail" style={{ padding: '14px 18px 16px', background: '#fff', borderTop: '1px solid #f2eef9' }}>
                  {/* STORY SO FAR */}
                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#8e8e93', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '4px' }}>
                    STORY SO FAR
                  </div>
                  <div style={{ fontSize: '13.5px', color: '#3a3a42', lineHeight: 1.5 }}>
                    {lead.story || `${lead.lastTouch} → ${lead.action}`}
                  </div>

                  {/* Grid 2 Items: PREFERRED PRODUCT & CROSS-SELL */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '12px' }}>
                    <div style={{ background: '#f7f7f9', borderRadius: '9px', padding: '10px 12px' }}>
                      <div style={{ fontSize: '11px', fontWeight: 800, color: '#8e8e93', textTransform: 'uppercase' }}>
                        PREFERRED PRODUCT
                      </div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#1a1a1a', marginTop: '2px' }}>
                        {lead.interest}
                      </div>
                    </div>
                    <div style={{ background: '#f7f7f9', borderRadius: '9px', padding: '10px 12px' }}>
                      <div style={{ fontSize: '11px', fontWeight: 800, color: '#8e8e93', textTransform: 'uppercase' }}>
                        CROSS-SELL
                      </div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#1a1a1a', marginTop: '2px' }}>
                        {lead.crossSell || 'Mattress Protector · ₹1,999'}
                      </div>
                    </div>
                  </div>

                  {/* EMI / FINANCING */}
                  <div style={{ background: '#fff8e1', border: '1px solid #f5cf94', borderRadius: '9px', padding: '10px 12px', marginTop: '10px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: '#a16207', textTransform: 'uppercase' }}>
                      EMI / FINANCING
                    </div>
                    <div style={{ fontSize: '13px', color: '#7c4a00', marginTop: '2px' }}>
                      {lead.emi || 'Not yet discussed — surface it early, she asked about total cost'}
                    </div>
                  </div>

                  {/* Full-width Place Call button */}
                  <button
                    onClick={() => {
                      startCall(
                        {
                          name: lead.name,
                          initials: lead.initials,
                          detail: `+91 ${lead.phone || '98450 61245'} · ${lead.interest}`,
                          phone: lead.phone || '98450 61245',
                          callType: 'Call centre',
                          product: lead.interest,
                          crossSell: lead.crossSell,
                          emi: lead.emi,
                        },
                        'outgoing',
                      )
                      setConsentContact({
                        name: lead.name,
                        phone: lead.phone || '98450 61245',
                        callType: 'Call centre',
                        initialMode: 'wa',
                      })
                    }}
                    style={{
                      width: '100%',
                      marginTop: '14px',
                      padding: '12px',
                      border: 'none',
                      borderRadius: '10px',
                      fontSize: '14.5px',
                      fontWeight: 700,
                      color: '#fff',
                      background: '#0f6e56',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 2px 6px rgba(15,110,86,0.25)',
                    }}
                  >
                    <Phone size={16} /> Place call
                  </button>
                </div>
              )}
            </li>
          )
        })}
      </ul>
      <Pagination page={page} pages={pages} onChange={changePage} />

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
          boxShadow: '0 4px 14px rgba(79,70,229,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 360,
        }}
      >
        <Grip size={22} />
      </button>

      {modalIndex !== null && <LeadsModal leads={RANKED_LEADS} startIndex={modalIndex} onClose={() => setModalIndex(null)} />}
      <DialerModal
        isOpen={dialerOpen}
        onClose={() => setDialerOpen(false)}
        onCallStarted={(num) =>
          setConsentContact({
            name: 'Manual Dial',
            phone: num,
            callType: 'Call centre',
            initialMode: 'wa',
          })
        }
      />
      {consentContact && (
        <PhoneCallConsentModal contact={consentContact} onClose={() => setConsentContact(null)} />
      )}
    </section>
  )
}
