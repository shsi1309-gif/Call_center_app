import { useEffect, useRef, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Send, Smile, Sparkles, Users } from 'lucide-react'
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
  if (agent) {
    const isRole = ROLE_AGENTS.some((r) => r.id === id)
    return {
      title: `# ${agent.name}`,
      sub: isRole ? 'Call Centre Agent · All call-centre staff · Your view · only your information' : agent.sub,
      rawName: agent.name,
      isRoleAgent: isRole,
    }
  }
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
      <header
        className="chan__head"
        style={{
          background: '#1c1335',
          padding: '12px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '15.5px', fontWeight: 700, color: '#fff', margin: 0 }}>
                {info.title}
              </h1>
              {info.isRoleAgent && (
                <span
                  style={{
                    backgroundColor: 'rgba(59, 130, 246, 0.25)',
                    color: '#93c5fd',
                    fontSize: '11px',
                    fontWeight: 600,
                    padding: '2px 8px',
                    borderRadius: '999px',
                    border: '1px solid rgba(59, 130, 246, 0.4)',
                  }}
                >
                  Role agent
                </span>
              )}
            </div>
            {info.sub && (
              <span style={{ fontSize: '11.5px', color: '#a5b4fc' }}>
                {info.sub}
              </span>
            )}
          </div>
        </div>

        {info.isRoleAgent ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              color: '#ffffff',
              padding: '4px 10px',
              borderRadius: '999px',
              fontSize: '12px',
              fontWeight: 600,
            }}
          >
            <Users size={14} />
            <span>3</span>
          </div>
        ) : (
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
        )}
      </header>

      {(channelId === 'callcentre-team' || channelId === 'avanibot' || channelId === 'callcentre-agent') && (
        <NeedsInputCard channelId={channelId} />
      )}

      <div className="chan__messages" role="log" aria-label="Messages">
        <div className="chan__divider">
          <span>{channelId === 'avanibot' || channelId === 'callcentre-agent' ? 'Today' : `Today · ${info.rawName || info.title.replace(/^#\s?/, '')}`}</span>
        </div>
        {messages.map((m) => {
          const isBot = m.author === 'AvaniBot' || m.author === 'callcentre-agent'
          const avStyle = getAvatarStyle(m.initials, m.mine)
          const isCheckDone = m.text.includes('✓ Task done · removed from your tasks')
          const lines = m.text.split('\n')

          return (
            <div key={m.id} className={`msg ${m.mine ? 'msg--mine' : ''}`}>
              {!m.mine && (
                isBot ? (
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: '#f5f3ff',
                      color: '#7c3aed',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Sparkles size={14} />
                  </div>
                ) : (
                  <Avatar initials={m.initials} size="sm" background={avStyle.background} color={avStyle.color} />
                )
              )}
              <div className="msg__col">
                <div className="msg__meta" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <strong>{m.mine ? 'You' : m.author}</strong>
                  {m.badge && (
                    <span
                      style={{
                        background: m.badge === 'BOT' ? '#8b5cf6' : m.badge === 'Nudge' ? '#3b82f6' : '#6366f1',
                        color: '#ffffff',
                        fontSize: '9.5px',
                        fontWeight: 800,
                        padding: '1px 6px',
                        borderRadius: '4px',
                        letterSpacing: '0.4px',
                      }}
                    >
                      {m.badge}
                    </span>
                  )}
                  {isBot && !m.badge && (
                    <span
                      style={{
                        background: '#8b5cf6',
                        color: '#ffffff',
                        fontSize: '9.5px',
                        fontWeight: 800,
                        padding: '1px 5px',
                        borderRadius: '4px',
                        letterSpacing: '0.4px',
                      }}
                    >
                      BOT
                    </span>
                  )}
                  <small>{m.time}</small>
                </div>
                <div className="msg__bubble" style={{ whiteSpace: 'pre-wrap' }}>
                  {lines.map((line, idx) => {
                    if (line.includes('✓ Task done')) {
                      return (
                        <div key={idx} style={{ color: '#047857', fontWeight: 600, fontSize: '12px', marginTop: '3px' }}>
                          {line}
                        </div>
                      )
                    }
                    return <div key={idx}>{line}</div>
                  })}
                </div>
              </div>
              {m.mine && (
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: '#0f6e56',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '12px',
                    flexShrink: 0,
                  }}
                >
                  Y
                </div>
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
          <button
            type="submit"
            className="chan__send"
            aria-label="Send message"
            style={{
              backgroundColor: '#059669',
              color: '#ffffff',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
              cursor: 'pointer',
            }}
          >
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
