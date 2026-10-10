import { useMemo, useState } from 'react'
import { CalendarDays, ChevronLeft, ChevronRight, Mail } from 'lucide-react'
import { EVENTS } from '../../data/calendar'
import { buildMonthGrid, dateToIso, formatLongDate, monthLabel, shiftMonth } from '../../utils/calendar'
import './Calendar.css'

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

function EventRow({ ev }) {
  return (
    <li className="cal-event">
      <div className="cal-event__time">
        <b>{ev.time}</b>
        <small>{ev.period}</small>
      </div>
      <div>
        <strong>{ev.title}</strong>
        <span>{ev.detail}</span>
      </div>
    </li>
  )
}

export function CalendarPage() {
  const [todayIso, setTodayIso] = useState(() => dateToIso(new Date()))
  const [cursor, setCursor] = useState(() => {
    const d = new Date()
    return { year: d.getFullYear(), month: d.getMonth() }
  })
  const [selected, setSelected] = useState(todayIso)
  const grid = useMemo(() => buildMonthGrid(cursor), [cursor])
  const eventsByDate = useMemo(() => {
    const map = new Map()
    EVENTS.forEach((e) => map.set(e.date, [...(map.get(e.date) ?? []), e]))
    return map
  }, [])
  const upcoming = EVENTS.filter((e) => e.date >= todayIso).sort((a, b) => a.date.localeCompare(b.date))
  const selectedEvents = eventsByDate.get(selected) ?? []
  const goToday = () => {
    const d = new Date()
    setCursor({ year: d.getFullYear(), month: d.getMonth() })
    setTodayIso(dateToIso(d))
    setSelected(dateToIso(d))
  }

  return (
    <div className="cal">
      <header className="cal__head">
        <h1>
          <CalendarDays size={14} /> Calendar
        </h1>
        <p>Mirrored from your mailbox — invites created here land there too</p>
      </header>
      <div className="cal__banner">
        <Mail size={16} /> Store visits, coaching sessions, and meeting invites all show up here — and in your mailbox.
      </div>

      <section className="cal__card" aria-label="Month view">
        <div className="cal__nav">
          <button onClick={() => setCursor((c) => shiftMonth(c, -1))} aria-label="Previous month">
            <ChevronLeft size={16} />
          </button>
          <h2 aria-live="polite">{monthLabel(cursor)}</h2>
          <button className="cal__today" onClick={goToday}>
            Today
          </button>
          <button onClick={() => setCursor((c) => shiftMonth(c, 1))} aria-label="Next month">
            <ChevronRight size={16} />
          </button>
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
                className={`cal__day ${cell.iso === todayIso ? 'is-today' : ''} ${cell.iso === selected ? 'is-selected' : ''}`}
                aria-pressed={cell.iso === selected}
                aria-label={`${formatLongDate(cell.iso)}${eventsByDate.has(cell.iso) ? ', has events' : ''}`}
                onClick={() => setSelected(cell.iso)}
              >
                {cell.day}
                {eventsByDate.has(cell.iso) && <i className="cal__dot" />}
              </button>
            ) : (
              <div key={`blank-${i}`} aria-hidden="true" />
            ),
          )}
        </div>
      </section>

      <section className="cal__list" aria-label="Selected day">
        <h2 className="section-label">{formatLongDate(selected)}</h2>
        {selectedEvents.length ? (
          <ul>
            {selectedEvents.map((e) => (
              <EventRow key={e.id} ev={e} />
            ))}
          </ul>
        ) : (
          <p className="cal__empty">Nothing scheduled for this day.</p>
        )}
      </section>
      <section className="cal__list" aria-label="Upcoming">
        <h2 className="section-label">Upcoming</h2>
        <ul>
          {upcoming.map((e) => (
            <EventRow key={e.id} ev={e} />
          ))}
        </ul>
      </section>
    </div>
  )
}
