import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Mail, Share2, Users } from 'lucide-react'
import { EVENTS } from '../../data/calendar'
import { buildMonthGrid, formatLongDate, monthLabel, shiftMonth } from '../../utils/calendar'
import { useToast } from '../../context/ToastContext'
import { ShareInviteModal } from './ShareInviteModal'
import './Calendar.css'

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

function UpcomingEventCard({ ev, onShare }) {
  return (
    <div className="cal-upcoming-card">
      <div className="cal-upcoming-card__accent" />
      <div className="cal-upcoming-card__time">
        <span className="cal-upcoming-card__hour">{ev.time}</span>
        <span className="cal-upcoming-card__period">{ev.period}</span>
      </div>
      <div className="cal-upcoming-card__content">
        <div className="cal-upcoming-card__title">{ev.title}</div>
        <div className="cal-upcoming-card__detail">
          <Users size={14} className="cal-upcoming-card__icon" />
          <span>{ev.detail}</span>
        </div>
      </div>
      <button
        className="cal-upcoming-card__share"
        onClick={() => onShare(ev)}
        aria-label={`Share invite for ${ev.title}`}
      >
        <Share2 size={16} />
      </button>
    </div>
  )
}

export function CalendarPage() {
  const { showToast } = useToast()
  // Mock October 2026 as standard base date
  const [cursor, setCursor] = useState({ year: 2026, month: 9 }) // 0-indexed: 9 = October
  const [selected, setSelected] = useState('2026-10-10')
  const [shareModalEvent, setShareModalEvent] = useState(null)

  const grid = useMemo(() => buildMonthGrid(cursor), [cursor])
  const eventsByDate = useMemo(() => {
    const map = new Map()
    EVENTS.forEach((e) => map.set(e.date, [...(map.get(e.date) ?? []), e]))
    return map
  }, [])

  // Dynamic events based on selected date
  const displayEvents = useMemo(() => {
    const onSelected = eventsByDate.get(selected) ?? []
    const future = EVENTS.filter((e) => e.date > selected).sort((a, b) => a.date.localeCompare(b.date))
    const combined = [...onSelected, ...future]
    if (combined.length > 0) {
      return combined.slice(0, 3)
    }
    // Fallback to all sorted events if nothing found from selected onward
    return [...EVENTS].sort((a, b) => a.date.localeCompare(b.date)).slice(0, 3)
  }, [selected, eventsByDate])

  const goToday = () => {
    setCursor({ year: 2026, month: 9 })
    setSelected('2026-10-10')
  }

  const handleShareSuccess = (event) => {
    showToast(`Invite shared for ${event.title}`)
  }

  return (
    <div className="cal">
      <div className="cal__subtitle-top">
        Mirrored from your mailbox — invites created here land there too
      </div>

      <div className="cal__banner">
        <Mail size={16} className="cal__banner-icon" />
        <span>Store visits, coaching sessions, and meeting invites all show up here — and in your mailbox.</span>
      </div>

      <section className="cal__card" aria-label="Month view">
        <div className="cal__nav">
          <button
            onClick={() => setCursor((c) => shiftMonth(c, -1))}
            aria-label="Previous month"
            className="cal__nav-arrow"
          >
            <ChevronLeft size={16} />
          </button>
          <h2 aria-live="polite">{monthLabel(cursor)}</h2>
          <div className="cal__nav-right">
            <button className="cal__today" onClick={goToday}>
              Today
            </button>
            <button
              onClick={() => setCursor((c) => shiftMonth(c, 1))}
              aria-label="Next month"
              className="cal__nav-arrow"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className="cal__grid" role="grid" aria-label={monthLabel(cursor)}>
          {WEEKDAYS.map((d, i) => (
            <div className="cal__dow" key={`${d}${i}`} role="columnheader">
              {d}
            </div>
          ))}
          {grid.map((cell, i) =>
            cell ? (
              <button
                key={cell.iso}
                role="gridcell"
                className={`cal__day ${cell.iso === selected ? 'is-selected' : ''}`}
                aria-pressed={cell.iso === selected}
                aria-label={`${formatLongDate(cell.iso)}${eventsByDate.has(cell.iso) ? ', has events' : ''}`}
                onClick={() => setSelected(cell.iso)}
              >
                <span className="cal__day-num">{cell.day}</span>
                {eventsByDate.has(cell.iso) && <i className="cal__dot" />}
              </button>
            ) : (
              <div key={`blank-${i}`} aria-hidden="true" className="cal__day-blank" />
            ),
          )}
        </div>
      </section>

      <section className="cal__upcoming-section" aria-label="Upcoming events">
        <div className="cal__section-header">UPCOMING</div>
        <div className="cal__upcoming-list">
          {displayEvents.map((e) => (
            <UpcomingEventCard
              key={e.id}
              ev={e}
              onShare={(ev) => setShareModalEvent(ev)}
            />
          ))}
        </div>
      </section>

      {/* Share Invite Modal */}
      <ShareInviteModal
        isOpen={Boolean(shareModalEvent)}
        event={shareModalEvent}
        onClose={() => setShareModalEvent(null)}
        onShareSuccess={handleShareSuccess}
      />
    </div>
  )
}
