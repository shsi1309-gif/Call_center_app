import { useEffect, useRef, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Send, Smile } from 'lucide-react'
import { AUTO_REPLIES, CHANNELS, DMS, ROLE_AGENTS, TASK_AGENTS } from '../../data/pulse'
import { usePulse } from '../../context/PulseContext'
import { useToast } from '../../context/ToastContext'
import { Avatar } from '../../components/ui/Avatar'
import { NeedsInputCard } from './NeedsInputCard'
import './Pulse.css'

function resolveChannel(id) {
  const ch = CHANNELS.find((c) => c.id === id)
  if (ch) return { title: `#${ch.name}`, sub: `${ch.members} members · ${ch.topic}` }
  const agent = [...ROLE_AGENTS, ...TASK_AGENTS].find((a) => a.id === id)
  if (agent) return { title: `# ${agent.name}`, sub: agent.sub }
  const dm = DMS.find((d) => d.id === id)
  if (dm) return { title: dm.name, sub: 'Direct message' }
  if (id === 'avanibot') return { title: 'AvaniBot', sub: 'Always on · ask anything about Pulse' }
  if (id === 'customer-discussions') return { title: 'customer-discussions', sub: 'Relayed via WhatsApp Business' }
  return null
}

export function PulseChannel() {
  const { channelId = '' } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const { messagesFor, sendMessage, postBotMessage, markRead } = usePulse()
  const [draft, setDraft] = useState('')
  const [error, setError] = useState('')
  const endRef = useRef(null)
  const info = resolveChannel(channelId)
  const messages = messagesFor(channelId)
  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' })
  }, [messages.length, channelId])
  useEffect(() => {
    markRead(channelId)
  }, [channelId, markRead])
  if (!info) return <Navigate to="/pulse" replace />
  const submit = (e) => {
    e.preventDefault()
    if (!sendMessage(channelId, draft)) {
      setError('Type a message before sending.')
      return
    }
    const reply = AUTO_REPLIES[channelId]
    if (reply) postBotMessage(channelId, reply.text, reply.author)
    setDraft('')
    setError('')
  }

  return (
    <div className="chan">
      <header className="chan__head">
        <button onClick={() => navigate('/pulse')} aria-label="Back to Pulse">
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1>{info.title}</h1>
          <small>{info.sub}</small>
        </div>
      </header>

      {channelId === 'callcentre-team' && <NeedsInputCard channelId={channelId} />}

      <div className="chan__messages" role="log" aria-label="Messages">
        <div className="chan__divider">
          <span>Today · {info.title.replace(/^#\s?/, '')}</span>
        </div>
        {messages.map((m) => (
          <div key={m.id} className={`msg ${m.mine ? 'msg--mine' : ''}`}>
            {!m.mine && <Avatar initials={m.initials} size="sm" background="#ede7fb" color="#5b21b6" />}
            <div className="msg__col">
              <div className="msg__meta">
                <strong>{m.mine ? 'You' : m.author}</strong> <small>{m.time}</small>
              </div>
              <div className="msg__bubble">{m.text}</div>
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <form className="chan__composer" onSubmit={submit} noValidate>
        <div className={`chan__input ${error ? 'has-error' : ''}`}>
          <input
            value={draft}
            onChange={(e) => {
              setDraft(e.target.value)
              if (error) setError('')
            }}
            placeholder={`Message ${info.title}…`}
            aria-label={`Message ${info.title}`}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'chan-error' : undefined}
          />
          <button type="button" onClick={() => toast('Emoji picker is not part of this demo')} aria-label="Emoji">
            <Smile size={16} />
          </button>
          <button type="submit" className="chan__send" aria-label="Send message">
            <Send size={15} />
          </button>
        </div>
        {error && (
          <p className="chan__error" id="chan-error" role="alert">
            {error}
          </p>
        )}
      </form>
    </div>
  )
}
