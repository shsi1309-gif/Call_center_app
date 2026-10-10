import { useEffect, useRef, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ChevronRight, Info, MessageCircle, Phone, PhoneCall, Send, Smile, Sparkles, Users } from 'lucide-react'
import { AUTO_REPLIES, CHANNELS, DMS, ROLE_AGENTS, TASK_AGENTS } from '../../data/pulse'
import { usePulse } from '../../context/PulseContext'
import { useToast } from '../../context/ToastContext'
import { useCall } from '../../context/CallContext'
import { Avatar } from '../../components/ui/Avatar'
import { NeedsInputCard } from './NeedsInputCard'
import './Pulse.css'

function resolveChannel(id) {
  if (id === 'kudos') {
    return {
      title: 'kudos',
      sub: 'Team recognition, sent by your leaders',
      rawName: 'kudos',
      isKudos: true,
    }
  }
  const ch = CHANNELS.find((c) => c.id === id)
  if (ch) return { title: `#${ch.name}`, sub: `${ch.members} members · ${ch.topic}`, rawName: ch.name }
  const agent = [...ROLE_AGENTS, ...TASK_AGENTS].find((a) => a.id === id)
  if (agent) {
    const isRole = ROLE_AGENTS.some((r) => r.id === id)
    const isTask = TASK_AGENTS.some((t) => t.id === id)
    let taskSub = agent.sub
    let metricPill = ''
    if (id === 'cross-sell-agent') {
      taskSub = 'Cross-sell & Upsell Agent · Stores, calls and field · Your view · only your information'
      metricPill = 'Your Attach rate 24% ▲2 today'
    } else if (id === 'sop-agent') {
      taskSub = 'SOP Agent · Stores, calls and field · Your view · only your information'
      metricPill = 'Your SOP adherence 81% ▲2 today'
    }

    return {
      title: `# ${agent.name}`,
      sub: isRole ? 'Call Centre Agent · All call-centre staff · Your view · only your information' : taskSub,
      rawName: agent.name,
      isRoleAgent: isRole,
      isTaskAgent: isTask,
      metricPill,
    }
  }
  const dm = DMS.find((d) => d.id === id)
  if (dm) return { title: dm.name, sub: 'Direct message', rawName: dm.name }
  if (id === 'avanibot') return { title: 'AvaniBot', sub: 'Always on · ask anything about Pulse', rawName: 'AvaniBot' }
  if (id === 'customer-discussions') {
    return {
      title: 'customer-discussions',
      sub: 'Relayed via WhatsApp Business · 2 open',
      rawName: 'customer-discussions',
      isCustomerDiscussions: true,
    }
  }
  return null
}

const CUSTOMER_THREADS = [
  {
    id: 'cd-mukunda',
    name: 'Mukunda',
    initials: 'MK',
    color: '#0f766e',
    badge: 'WA',
    badgeColor: '#10b981',
    text: 'Quote for Ortho GRID sent · awaiting reply',
    time: '2:40pm',
    unread: 1,
  },
  {
    id: 'cd-kavitha',
    name: 'Kavitha R.',
    initials: 'KR',
    color: '#d97706',
    badge: 'WA',
    badgeColor: '#10b981',
    text: 'When can I come see the hybrid mattress?',
    time: '11:15am',
    unread: 2,
  },
  {
    id: 'cd-ali',
    name: 'Ali',
    initials: 'AL',
    color: '#dc2626',
    badge: 'Missed',
    badgeColor: '#ef4444',
    isMissed: true,
    text: 'Called 9:40am · not returned yet',
    time: '',
    unread: 0,
    hasCallback: true,
  },
]

const KUDOS_LIST = [
  {
    id: 'k1',
    name: 'Sunita Rao (Manager)',
    initials: 'SR',
    avatarBg: '#fef3c7',
    avatarColor: '#78350f',
    time: '12:40pm · Today',
    icon: '🏆',
    borderColor: '#fef08a',
    cardBg: '#fffdf5',
    text: '"Great work with Mukunda — closed that warranty objection beautifully. Keep it up!"',
  },
  {
    id: 'k2',
    name: 'Raju Kumar',
    initials: 'RK',
    avatarBg: '#dcfce7',
    avatarColor: '#166534',
    time: 'Yesterday',
    icon: '🔥',
    borderColor: '#fecdd3',
    cardBg: '#fff5f5',
    text: '"Nice cross-sell on the Tranquo chair! Impressed by how you read the customer."',
  },
  {
    id: 'k3',
    name: 'Sunita Rao (Manager)',
    initials: 'SR',
    avatarBg: '#fef3c7',
    avatarColor: '#78350f',
    time: '2 days ago',
    icon: '💪',
    borderColor: '#bbf7d0',
    cardBg: '#f0fdf4',
    text: '"Top SOP score this week — 72/100 on Mukunda\'s conversation. Store leader!"',
  },
]

export function PulseChannel() {
  const { channelId = '' } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const { startCall } = useCall()
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

  const getDividerText = () => {
    if (channelId === 'all-stores') return 'Today · All Stores'
    if (channelId === 'avani-coaching') return 'Today · Avani AI Coaching'
    if (channelId === 'callcentre-team') return 'Today · Call Centre Team'
    if (channelId === 'avanibot' || channelId === 'callcentre-agent' || channelId === 'cross-sell-agent' || channelId === 'sop-agent') return 'Today'
    return `Today · ${info.rawName || info.title.replace(/^#\s?/, '')}`
  }

  // ===== Render Kudos View (Image 1) =====
  if (info.isKudos) {
    return (
      <div className="chan" style={{ backgroundColor: '#f8fafc', minHeight: '100%' }}>
        <header
          style={{
            background: '#d97706',
            padding: '12px 18px',
            display: 'flex',
            alignItems: 'center',
            color: '#ffffff',
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
                background: 'rgba(255, 255, 255, 0.2)',
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
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '15px', fontWeight: 700 }}>
                <span>🏆</span>
                <span>kudos</span>
              </div>
              <div style={{ fontSize: '12px', color: '#fef3c7' }}>
                Team recognition, sent by your leaders
              </div>
            </div>
          </div>
        </header>

        {/* Info Banner */}
        <div style={{ padding: '14px 16px 0' }}>
          <div
            style={{
              backgroundColor: '#fef9c3',
              border: '1px solid #fef08a',
              borderRadius: '12px',
              padding: '10px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#854d0e',
              fontSize: '13px',
              fontWeight: 500,
            }}
          >
            <Info size={16} style={{ flexShrink: 0, color: '#d97706' }} />
            <span>You receive kudos — leaders send them to celebrate your wins 🎉</span>
          </div>
        </div>

        {/* Incoming Kudos Section */}
        <div style={{ padding: '16px' }}>
          <div
            style={{
              fontSize: '11px',
              fontWeight: 800,
              color: '#6b7280',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>📬</span>
            <span>INCOMING KUDOS</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {KUDOS_LIST.map((kudo) => (
              <div
                key={kudo.id}
                style={{
                  backgroundColor: kudo.cardBg,
                  borderRadius: '16px',
                  padding: '14px 18px',
                  border: `1.5px solid ${kudo.borderColor}`,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: kudo.avatarBg,
                        color: kudo.avatarColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '13px',
                      }}
                    >
                      {kudo.initials}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '14px', color: '#111827' }}>
                        {kudo.name}
                      </div>
                      <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                        {kudo.time}
                      </div>
                    </div>
                  </div>
                  <span style={{ fontSize: '18px' }}>{kudo.icon}</span>
                </div>

                <div
                  style={{
                    fontSize: '13.5px',
                    lineHeight: '1.5',
                    color: '#1f2937',
                    marginTop: '10px',
                  }}
                >
                  {kudo.text}
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              textAlign: 'center',
              fontSize: '12.5px',
              color: '#9ca3af',
              marginTop: '28px',
            }}
          >
            Your all-time kudos: 12 🎉
          </div>
        </div>
      </div>
    )
  }

  // ===== Render Customer Discussions View (Image 5) =====
  if (info.isCustomerDiscussions) {
    return (
      <div className="chan" style={{ backgroundColor: '#f8fafc', minHeight: '100%' }}>
        {/* Green Top Header */}
        <header
          style={{
            background: '#0f6e56',
            padding: '12px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: '#ffffff',
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
                background: 'rgba(255, 255, 255, 0.2)',
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
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '15px', fontWeight: 700 }}>
                <MessageCircle size={16} />
                <span>customer-discussions</span>
              </div>
              <div style={{ fontSize: '12px', color: '#a7f3d0' }}>
                Relayed via WhatsApp Business · 2 open
              </div>
            </div>
          </div>
        </header>

        {/* Yellow Banner */}
        <div style={{ padding: '12px 16px 0' }}>
          <div
            style={{
              backgroundColor: '#fef9c3',
              border: '1px solid #fef08a',
              borderRadius: '12px',
              padding: '10px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: '#854d0e',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
            onClick={() => toast('Showing 1 unanswered call and 1 unreplied chat')}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <PhoneCall size={15} />
              <span>1 unanswered call & 1 unreplied chat need attention</span>
            </div>
            <ChevronRight size={16} />
          </div>
        </div>

        {/* Customer Conversations List */}
        <div style={{ padding: '16px' }}>
          <div
            style={{
              fontSize: '11px',
              fontWeight: 800,
              color: '#6b7280',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              marginBottom: '10px',
            }}
          >
            CUSTOMER CONVERSATIONS
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {CUSTOMER_THREADS.map((thread) => (
              <div
                key={thread.id}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '14px',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                  border: '1px solid #eef2f6',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: `${thread.color}18`,
                      color: thread.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '13.5px',
                    }}
                  >
                    {thread.initials}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontWeight: 700, fontSize: '14px', color: '#111827' }}>
                        {thread.name}
                      </span>
                      {thread.badge && (
                        <span
                          style={{
                            backgroundColor: thread.isMissed ? '#fee2e2' : '#dcfce7',
                            color: thread.isMissed ? '#dc2626' : '#16a34a',
                            fontSize: '10.5px',
                            fontWeight: 700,
                            padding: '1px 6px',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '3px',
                          }}
                        >
                          {thread.isMissed && <Phone size={10} />}
                          {thread.badge}
                        </span>
                      )}
                    </div>
                    <div
                      style={{
                        fontSize: '12.5px',
                        color: thread.isMissed ? '#dc2626' : '#6b7280',
                        marginTop: '2px',
                      }}
                    >
                      {thread.text}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {thread.hasCallback ? (
                    <button
                      onClick={() => {
                        toast('Calling Ali back...')
                        startCall({ name: 'Ali', initials: 'AL', detail: '+91 98450 11223' }, 'outgoing')
                      }}
                      style={{
                        backgroundColor: '#0f6e56',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '999px',
                        padding: '6px 14px',
                        fontSize: '12.5px',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                      }}
                    >
                      <Phone size={13} />
                      <span>Call back</span>
                    </button>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                      <span style={{ fontSize: '11px', color: '#9ca3af' }}>{thread.time}</span>
                      {thread.unread > 0 && (
                        <span
                          style={{
                            backgroundColor: '#22c55e',
                            color: '#ffffff',
                            borderRadius: '999px',
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '0 6px',
                            lineHeight: '18px',
                          }}
                        >
                          {thread.unread}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              textAlign: 'center',
              fontSize: '12px',
              color: '#9ca3af',
              marginTop: '24px',
            }}
          >
            Customer threads managed via WhatsApp Business + On-ground Calling
          </div>
        </div>
      </div>
    )
  }

  // ===== Standard Channel / Agent View =====
  const hasNeedsInput =
    channelId === 'callcentre-team' ||
    channelId === 'avanibot' ||
    channelId === 'callcentre-agent' ||
    channelId === 'cross-sell-agent' ||
    channelId === 'sop-agent'

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
              {info.isTaskAgent && (
                <span
                  style={{
                    backgroundColor: 'rgba(168, 85, 247, 0.25)',
                    color: '#d8b4fe',
                    fontSize: '11px',
                    fontWeight: 600,
                    padding: '2px 8px',
                    borderRadius: '999px',
                    border: '1px solid rgba(168, 85, 247, 0.4)',
                  }}
                >
                  Task agent
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {info.isRoleAgent || info.isTaskAgent ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {info.metricPill && (
                <div
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.18)',
                    color: '#ffffff',
                    padding: '4px 12px',
                    borderRadius: '999px',
                    fontSize: '12px',
                    fontWeight: 600,
                  }}
                >
                  {info.metricPill}
                </div>
              )}
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
                <span>{info.isTaskAgent ? '5' : '3'}</span>
              </div>
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
        </div>
      </header>

      {hasNeedsInput && <NeedsInputCard channelId={channelId} />}

      <div className="chan__messages" role="log" aria-label="Messages">
        <div className="chan__divider">
          <span>{getDividerText()}</span>
        </div>
        {messages.map((m) => {
          const isBot = m.author === 'AvaniBot' || m.author === 'callcentre-agent' || m.author === 'Manager Helper' || m.author === 'Avani'
          const avStyle = getAvatarStyle(m.initials, m.mine)
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
                  AR
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
