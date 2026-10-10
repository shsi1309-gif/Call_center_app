import { useState } from 'react'
import { CalendarDays, ChevronDown, ChevronRight, ClipboardList, Headset, PhoneCall, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { CALLS_LAST_7, CSAT_LAST_7, EARNINGS, KPIS } from '../../data/dashboard'
import { WAITING } from '../../data/plan'
import { TASK_LEADS } from '../../data/leads'
import { formatRupees } from '../../utils/format'
import { LeadsModal } from '../leads/LeadsModal'
import { DateRangeModal } from '../../components/layout/DateRangeModal'
import { BarTrendChart } from './BarTrendChart'
import './Dashboard.css'

const TASKS = [
  { id: 'callbacks', icon: PhoneCall, tone: 'blue', bold: '2 callbacks', rest: 'next 4:30pm' },
  { id: 'hot', icon: Users, tone: 'purple', bold: '2 hot leads', rest: 'untouched 24h' },
  { id: 'outcome', icon: ClipboardList, tone: 'amber', bold: '1 outcome', rest: 'to log' },
]

function greeting(hour) {
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export function DashboardPage() {
  const [leadsOpen, setLeadsOpen] = useState(false)
  const [dateRangeOpen, setDateRangeOpen] = useState(false)
  const [dateRange, setDateRange] = useState('This Week')
  const [hello] = useState(() => greeting(new Date().getHours()))
  const earningsPct = Math.round(((EARNINGS.amount - EARNINGS.min) / (EARNINGS.max - EARNINGS.min)) * 100)

  return (
    <div className="dash">
      <section className="dash-hero">
        <div className="dash-hero__row">
          <div>
            <div className="dash-hero__greet">{hello} 👋</div>
            <h1 className="dash-hero__name">Arvind Rajan</h1>
            <div className="dash-hero__store">The Sleep Company · Call Centre</div>
          </div>
          <div className="dash-hero__right">
            <span className="chip chip--queue">
              <i />
              On Queue
            </span>
            <button className="chip chip--range" onClick={() => setDateRangeOpen(true)}>
              <CalendarDays size={13} /> {dateRange} <ChevronDown size={13} />
            </button>
          </div>
        </div>
        <div className="kpis">
          {KPIS.map((k) => (
            <div className="kpi" key={k.id}>
              <div className="kpi__value">{k.value}</div>
              <div className="kpi__label">{k.label}</div>
              <span className={`kpi__delta kpi__delta--${k.tone}`}>{k.delta}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="dash-grid">
        <div className="dash-col">
          <section className="progress" aria-label="My progress today">
            <h2 className="progress__title">
              <i />
              My progress · today
            </h2>
            <div className="progress__tiles">
              <div className="progress__tile">
                <b>3</b>
                <span className="pill pill--gold">▲ +1</span>
                <small>Leads Created</small>
              </div>
              <div className="progress__tile">
                <b>2</b>
                <span className="pill pill--teal">▲ +2</span>
                <small>Leads Called</small>
              </div>
            </div>
          </section>

          <div className="waiting">
            <div className="waiting__head">
              <h2 className="section-label">Who's waiting</h2>
              <Link to="/plan/calls" className="waiting__link">
                Open planner →
              </Link>
            </div>
            {WAITING.map((w) => (
              <div className="waiting__row" key={w.id}>
                <span className="waiting__icon">
                  <Headset size={16} />
                </span>
                <div className="waiting__text">
                  <strong>{w.name}</strong>
                  <span>{w.note}</span>
                </div>
                <span className={`wait ${w.urgent ? 'wait--urgent' : 'wait--warn'}`}>{w.wait}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="dash-col">
          <section className="earnings" aria-label="Earnings">
            <div className="earnings__row">
              <strong>💰 My earnings this month</strong>
              <span>
                ₹{EARNINGS.min} to ₹{EARNINGS.max.toLocaleString('en-IN')} slab
              </span>
            </div>
            <div className="earnings__amount">
              <b>{formatRupees(EARNINGS.amount)}</b>
              <span>{formatRupees(EARNINGS.coached)} from coached moves</span>
            </div>
            <div
              className="earnings__bar"
              role="progressbar"
              aria-label="Earnings slab progress"
              aria-valuenow={earningsPct}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div style={{ width: `${earningsPct}%` }} />
            </div>
          </section>

          <section className="tasks" aria-label="My tasks">
            <h2 className="tasks__title">
              <ClipboardList size={14} /> My Tasks <span className="tasks__count">{TASKS.length}</span>
            </h2>
            {TASKS.map(({ id, icon: Icon, tone, bold, rest }) => (
              <button className="task" key={id} onClick={() => setLeadsOpen(true)}>
                <span className={`task__icon task__icon--${tone}`}>
                  <Icon size={16} />
                </span>
                <span className="task__text">
                  <b>{bold}</b> {rest}
                </span>
                <ChevronRight size={16} />
              </button>
            ))}
          </section>
        </div>
      </div>

      <div className="dash-charts">
        <BarTrendChart title="Calls handled · last 7 days" data={CALLS_LAST_7} max={28} baseColor="#5dcaa5" highlightColor="#0f7157" />
        <BarTrendChart
          title="CSAT trend · last 7 days"
          data={CSAT_LAST_7}
          max={100}
          baseColor="#93b4f5"
          highlightColor="#1a5fa8"
          unit="%"
        />
      </div>

      {leadsOpen && <LeadsModal leads={TASK_LEADS} onClose={() => setLeadsOpen(false)} />}
      {dateRangeOpen && (
        <DateRangeModal
          currentRange={dateRange}
          onApply={(newRange) => setDateRange(newRange)}
          onClose={() => setDateRangeOpen(false)}
        />
      )}
    </div>
  )
}
