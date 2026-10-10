import { useEffect, useRef, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Send, Smile, Sparkles } from 'lucide-react'
import { AUTO_REPLIES, CHANNELS, DMS, ROLE_AGENTS, TASK_AGENTS } from '../../data/pulse'
import { usePulse } from '../../context/PulseContext'
import { useToast } from '../../context/ToastContext'
import { Avatar } from '../../components/ui/Avatar'
import { NeedsInputCard } from './NeedsInputCard'
import './Pulse.css'

function resolveChannel(id) {
  const ch = CHANNELS.find((c) => c.id === id)
  if (ch) return { title: `#${ch.name}`, sub: `${ch.members} members · ${ch.topic}`, rawName: ch.name }
  const agent = [...ROLE_AGENTS, ...TASK_AGENTS].find((a) => a.id === id)
  if (agent) return { title: `# ${agent.name}`, sub: agent.sub, rawName: agent.name }
  const dm = DMS.find((d) => d.id === id)
  if (dm) return { title: dm.name, sub: 'Direct message', rawName: dm.name }
  if (id === 'avanibot') return { title: 'AvaniBot', sub: 'Always on · ask anything about Pulse', rawName: 'AvaniBot' }
  if (id === 'customer-discussions') return { title: 'customer-discussions', sub: 'Relayed via WhatsApp Business', rawName: 'customer-discussions' }
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

  const getAvatarStyle = (initials, mine) => {
    if (mine) return { background: '#0f6e56', color: '#ffffff' }
    if (initials === 'SR') return { background: '#fed7aa', color: '#7c2d12' }
    return { background: '#ede7fb', color: '#5b21b6' }
  }

  return (
    <div className="chan">
      <header className="chan__head" style={{ background: '#1c1335', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => navigate('/pulse')}
            aria-label="Back to Pulse"
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.15)',
              border: 'none',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <ArrowLeft size={16} />
          </button>
          <h1 style={{ fontSize: '15px', fontWeight: 700, color: '#fff', margin: 0 }}>
            {info.title}
          </h1>
        </div>
        <button
          onClick={() => toast('AI suggestions for this channel')}
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.15)',
            border: 'none',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
          aria-label="Channel options"
        >
          <Sparkles size={15} />
        </button>
      </header>

      {channelId === 'callcentre-team' && <NeedsInputCard channelId={channelId} />}

      <div className="chan__messages" role="log" aria-label="Messages">
        <div className="chan__divider">
          <span>Today · Call Centre Team</span>
        </div>
        {messages.map((m) => {
          const avStyle = getAvatarStyle(m.initials, m.mine)
          return (
            <div key={m.id} className={`msg ${m.mine ? 'msg--mine' : ''}`}>
              {!m.mine && (
                <Avatar initials={m.initials} size="sm" background={avStyle.background} color={avStyle.color} />
              )}
              <div className="msg__col">
                <div className="msg__meta">
                  <strong>{m.mine ? 'You' : m.author}</strong> <small>{m.time}</small>
                </div>
                <div className="msg__bubble">{m.text}</div>
              </div>
              {m.mine && (
                <Avatar initials={m.initials || 'AR'} size="sm" background={avStyle.background} color={avStyle.color} />
              )}
            </div>
          )
        })}
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
