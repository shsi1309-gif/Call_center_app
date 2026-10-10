import { useState } from 'react'
import { ChevronUp, Pin } from 'lucide-react'
import { usePulse } from '../../context/PulseContext'
import { useToast } from '../../context/ToastContext'

const RESCHEDULE_OPTIONS = ['5:00pm', '6:00pm', 'Tomorrow 11:00am']

export function NeedsInputCard({ channelId }) {
  const { pinned, setPinned, sendMessage, postBotMessage } = usePulse()
  const toast = useToast()
  const [answer, setAnswer] = useState('')
  const [error, setError] = useState('')
  const [collapsed, setCollapsed] = useState(false)

  const resolve = (text, ack) => {
    sendMessage(channelId, text)
    postBotMessage(channelId, ack)
    setPinned({ state: 'answered', answer: text })
    toast('Answer sent')
  }

  const submitReply = (e) => {
    e.preventDefault()
    if (!answer.trim()) {
      setError('Type an answer first.')
      return
    }
    resolve(answer.trim(), 'Thanks, noted. I will update the callback plan.')
    setAnswer('')
    setError('')
  }

  if (pinned.state === 'answered') {
    return (
      <div
        className="needs needs--done"
        style={{
          background: '#ecfdf5',
          borderBottom: '1px solid #a7f3d0',
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: '#0f766e',
          fontSize: '13.5px',
        }}
        role="status"
      >
        <span style={{ fontWeight: 700 }}>✓ Answered:</span>
        <span>{pinned.answer}</span>
      </div>
    )
  }

  return (
    <section
      className="needs"
      aria-label="Needs your input"
      style={{
        background: '#fffdf5',
        borderBottom: '1px solid #fed7aa',
        padding: '12px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ color: '#c2410c', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 800, fontSize: '12.5px' }}>
            <Pin size={14} style={{ transform: 'rotate(45deg)' }} /> Needs your input
          </span>
          <span
            style={{
              background: '#ef4444',
              color: '#fff',
              borderRadius: '999px',
              padding: '0 6px',
              fontSize: '11px',
              fontWeight: 800,
              lineHeight: '16px',
            }}
          >
            1
          </span>
          <span style={{ color: '#9ca3af', fontSize: '12px' }}>· pinned</span>
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{ background: 'none', border: 'none', color: '#c2410c', cursor: 'pointer', padding: '2px' }}
          aria-label="Toggle collapse"
        >
          <ChevronUp size={16} style={{ transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
        </button>
      </div>

      {!collapsed && (
        <>
          <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#111827', margin: '2px 0 0 0' }}>
            Confirm the 4:30pm callback
          </h2>
          <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 4px 0' }}>
            Priya Iyer · likely billing dispute
          </p>

          {pinned.state === 'open' ? (
            <div style={{ display: 'flex', gap: '8px', margin: '4px 0' }}>
              <button
                onClick={() => resolve('Confirmed — I will call at 4:30pm.', 'Great, the 4:30pm callback is locked in.')}
                style={{
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '999px',
                  padding: '5px 16px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#1e293b',
                  cursor: 'pointer',
                }}
              >
                Confirmed
              </button>
              <button
                onClick={() => setPinned({ state: 'rescheduling' })}
                style={{
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '999px',
                  padding: '5px 16px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#1e293b',
                  cursor: 'pointer',
                }}
              >
                Reschedule
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', margin: '4px 0' }} role="group" aria-label="Pick a new time">
              {RESCHEDULE_OPTIONS.map((t) => (
                <button
                  key={t}
                  onClick={() =>
                    resolve(`Please reschedule the callback to ${t}.`, `Rescheduled to ${t}. I will remind you 10 minutes before.`)
                  }
                  style={{
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '999px',
                    padding: '5px 14px',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#1e293b',
                    cursor: 'pointer',
                  }}
                >
                  {t}
                </button>
              ))}
              <button
                onClick={() => setPinned({ state: 'open' })}
                style={{
                  background: '#f1f5f9',
                  border: '1px solid #cbd5e1',
                  borderRadius: '999px',
                  padding: '5px 14px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#64748b',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
          )}

          <form onSubmit={submitReply} style={{ display: 'flex', gap: '8px', marginTop: '4px' }} noValidate>
            <input
              value={answer}
              onChange={(e) => {
                setAnswer(e.target.value)
                if (error) setError('')
              }}
              placeholder="Or type your answer"
              aria-label="Type your answer"
              style={{
                flex: 1,
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                padding: '7px 12px',
                fontSize: '13px',
                background: '#ffffff',
                outline: 'none',
              }}
            />
            <button
              type="submit"
              aria-label="Send answer"
              style={{
                background: '#854d0e',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '7px 18px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Send
            </button>
          </form>
          {error && (
            <p style={{ color: '#ef4444', fontSize: '12px', margin: '2px 0 0 0' }} role="alert">
              {error}
            </p>
          )}
        </>
      )}
    </section>
  )
}
