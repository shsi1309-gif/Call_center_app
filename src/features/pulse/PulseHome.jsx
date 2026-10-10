import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, Plus, Search, Sparkles, MessageCircle, Newspaper, Hash } from 'lucide-react'
import { CHANNELS, DMS, KUDOS, ROLE_AGENTS, TASK_AGENTS } from '../../data/pulse'
import { usePulse } from '../../context/PulseContext'
import { useToast } from '../../context/ToastContext'
import { Avatar } from '../../components/ui/Avatar'
import { KudosModal } from './KudosModal'
import './Pulse.css'

const matches = (q, ...fields) => !q || fields.some((f) => f.toLowerCase().includes(q))

function Unread({ n }) {
  return n > 0 ? (
    <span className="unread" aria-label={`${n} unread`}>
      {n}
    </span>
  ) : null
}

function lastOf(messages) {
  const last = messages[messages.length - 1]
  return { text: last?.text ?? '', time: last?.time }
}

function Group({ label, hint, children }) {
  return (
    <div className="pulse-group">
      <div className="pulse-group__label">
        {label}
        {hint && <small>{hint}</small>}
      </div>
      {children}
    </div>
  )
}

export function PulseHome() {
  const navigate = useNavigate()
  const toast = useToast()
  const { postBotMessage, unreadFor, messagesFor, kudosNew, clearKudosNew } = usePulse()
  const [query, setQuery] = useState('')
  const [agentsOpen, setAgentsOpen] = useState(true)
  const [kudosOpen, setKudosOpen] = useState(false)
  const q = query.trim().toLowerCase()
  const roles = ROLE_AGENTS.filter((a) => matches(q, a.name, a.sub))
  const tasks = TASK_AGENTS.filter((a) => matches(q, a.name, a.sub))
  const channels = CHANNELS.filter((c) => matches(q, c.name, lastOf(messagesFor(c.id)).text))
  const dms = DMS.filter((d) => matches(q, d.name, lastOf(messagesFor(d.id)).text))
  const empty = !roles.length && !tasks.length && !channels.length && !dms.length
  const openChannel = (id) => navigate(`/pulse/${id}`)
  const dailyBrief = () => {
    postBotMessage(
      'avanibot',
      'Daily brief: 2 callbacks due (next 4:30pm), 2 hot leads untouched for 24h, greeting QA is at 71% vs 85% target.',
    )
    openChannel('avanibot')
  }

  return (
    <div className="pulse">
      <header className="pulse__head">
        <span className="pulse__logo">
          <MessageCircle size={14} />
        </span>
        <div>
          <h1>Pulse</h1>
          <small>The Sleep Company · Koramangala</small>
        </div>
        <button className="pulse__plus" onClick={() => toast('New conversation is not part of this demo')} aria-label="New conversation">
          <Plus size={16} />
        </button>
      </header>

      <div className="pulse__body">
        <label className="pulse-search">
          <Sparkles size={15} className="pulse-search__spark" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask AvaniBot or search Pulse…"
            aria-label="Search Pulse"
          />
          <Search size={15} />
        </label>

        {!q && (
          <section className="avani">
            <div className="avani__top">
              <span className="avani__icon">
                <Sparkles size={16} />
              </span>
              <strong>AvaniBot</strong>
              <span className="avani__tag">ALWAYS ON</span>
            </div>
            <p>Ask me about anything happening in Pulse — daily briefs, action items, quick answers</p>
            <div className="avani__btns">
              <button onClick={dailyBrief}>
                <Newspaper size={14} /> Daily Brief
              </button>
              <button onClick={() => openChannel('avanibot')}>
                <MessageCircle size={14} /> Ask a question
              </button>
            </div>
          </section>
        )}

        {!q && (
          <section className="agents">
            <button className="agents__head" aria-expanded={agentsOpen} onClick={() => setAgentsOpen((o) => !o)}>
              <span className="agents__icon">
                <Sparkles size={15} />
              </span>
              <span>
                <strong>Custom Agents</strong>
                <small>Set up by your manager — already live, tap to open</small>
              </span>
              <ChevronDown size={16} className={agentsOpen ? '' : 'is-closed'} />
            </button>
            {agentsOpen && (
              <div className="agents__body">
                <Group label="ROLE AGENTS" hint="run a team">
                  {roles.map((a) => (
                    <button key={a.id} className="agent agent--role" onClick={() => openChannel(a.id)}>
                      <span className="agent__text">
                        <strong># {a.name}</strong>
                        <small>{a.sub}</small>
                      </span>
                      <Unread n={unreadFor(a.id)} />
                    </button>
                  ))}
                </Group>
                <Group label="TASK AGENTS" hint="move one metric">
                  {tasks.map((a) => (
                    <button key={a.id} className="agent" style={{ borderLeftColor: a.color }} onClick={() => openChannel(a.id)}>
                      <span className="agent__text">
                        <strong># {a.name}</strong>
                        <small>{a.sub}</small>
                      </span>
                      <span className="agent__right">
                        {a.metric && (
                          <b className="agent__metric">
                            {a.metric} <em>{a.delta}</em>
                          </b>
                        )}
                        <Unread n={unreadFor(a.id)} />
                      </span>
                    </button>
                  ))}
                </Group>
              </div>
            )}
          </section>
        )}
        {q && (roles.length > 0 || tasks.length > 0) && (
          <Group label="AGENTS">
            {[...roles, ...tasks].map((a) => (
              <button key={a.id} className="agent agent--role" onClick={() => openChannel(a.id)}>
                <span className="agent__text">
                  <strong># {a.name}</strong>
                  <small>{a.sub}</small>
                </span>
              </button>
            ))}
          </Group>
        )}

        {!q && (
          <Group label="GENERAL">
            <button className="row" onClick={() => openChannel('customer-discussions')}>
              <span className="row__wa">
                <MessageCircle size={13} />
              </span>
              <span className="row__text">
                <strong>customer-discussions</strong>
                <small>{lastOf(messagesFor('customer-discussions')).text}</small>
              </span>
              <Unread n={unreadFor('customer-discussions')} />
            </button>
          </Group>
        )}

        {!q && (
          <button
            className="kudos"
            onClick={() => {
              setKudosOpen(true)
              clearKudosNew()
            }}
          >
            <span className="kudos__trophy">🏆</span>
            <span className="kudos__text">
              <strong>Kudos {kudosNew > 0 && <em>{kudosNew} NEW</em>}</strong>
              <small>{KUDOS.quote}</small>
            </span>
            <span className="kudos__total">
              <b>{KUDOS.total}</b>
              <small>ALL-TIME</small>
            </span>
          </button>
        )}

        {channels.length > 0 && (
          <Group label="CHANNELS">
            {channels.map((c) => {
              const last = lastOf(messagesFor(c.id))

              return (
                <button key={c.id} className="row" onClick={() => openChannel(c.id)}>
                  <span className="row__hash">
                    <Hash size={13} />
                  </span>
                  <span className="row__text">
                    <strong>{c.name}</strong>
                    <small>{last.text}</small>
                  </span>
                  <span className="row__meta">
                    {last.time && <small>{last.time}</small>}
                    <Unread n={unreadFor(c.id)} />
                  </span>
                </button>
              )
            })}
          </Group>
        )}
        {dms.length > 0 && (
          <Group label="DIRECT MESSAGES">
            {dms.map((d) => {
              const last = lastOf(messagesFor(d.id))

              return (
                <button key={d.id} className="row" onClick={() => openChannel(d.id)}>
                  <Avatar initials={d.initials} size="sm" background="#ede7fb" color="#5b21b6" />
                  <span className="row__text">
                    <strong>
                      {d.name} {d.badge && <em className="badge-mgr">{d.badge}</em>}
                    </strong>
                    <small>{last.text}</small>
                  </span>
                  <span className="row__meta">
                    <small>{last.time}</small>
                  </span>
                </button>
              )
            })}
          </Group>
        )}
        {empty && <p className="pulse__empty">No results for “{query}”.</p>}
      </div>
      {kudosOpen && <KudosModal onClose={() => setKudosOpen(false)} />}
    </div>
  )
}
