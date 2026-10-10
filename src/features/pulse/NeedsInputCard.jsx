import { useState } from 'react'
import { ChevronUp, Pin } from 'lucide-react'
import { usePulse } from '../../context/PulseContext'
import { useToast } from '../../context/ToastContext'

const RESCHEDULE_OPTIONS = ['5:00pm', '6:00pm', 'Tomorrow 11:00am']

export function NeedsInputCard({ channelId }) {
  const { pinned, setPinned, sendMessage, postBotMessage } = usePulse()
  const toast = useToast()
  const [collapsed, setCollapsed] = useState(false)
  const [answers, setAnswers] = useState({ item1: '', item2: '', single: '' })
  const [errors, setErrors] = useState({})
  const [resolvedItems, setResolvedItems] = useState(new Set())

  const isAvani = channelId === 'avanibot'

  const handleResolve = (itemId, text, ack) => {
    sendMessage(channelId, text)
    if (ack) postBotMessage(channelId, ack)
    setResolvedItems((prev) => new Set(prev).add(itemId))
    toast('Answer sent')
  }

  const handleTextSubmit = (e, itemId, ack) => {
    e.preventDefault()
    const text = (answers[itemId] || '').trim()
    if (!text) {
      setErrors((prev) => ({ ...prev, [itemId]: 'Type an answer first.' }))
      return
    }
    handleResolve(itemId, text, ack)
    setAnswers((prev) => ({ ...prev, [itemId]: '' }))
    setErrors((prev) => ({ ...prev, [itemId]: '' }))
  }

  const badgeCount = isAvani ? Math.max(0, 2 - resolvedItems.size) : (resolvedItems.has('single') ? 0 : 1)

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
        gap: '12px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ color: '#c2410c', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 800, fontSize: '12.5px' }}>
            <Pin size={14} style={{ transform: 'rotate(45deg)' }} /> Needs your input
          </span>
          {badgeCount > 0 && (
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
              {badgeCount}
            </span>
          )}
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

      {!collapsed && isAvani && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Avani Item 1: Call now or reassign the 2 hot leads */}
          {!resolvedItems.has('item1') ? (
            <div style={{ borderBottom: '1px solid #fef3c7', paddingBottom: '12px' }}>
              <h2 style={{ fontSize: '14.5px', fontWeight: 700, color: '#111827', margin: '0 0 2px 0' }}>
                Call now or reassign the 2 hot leads
              </h2>
              <p style={{ fontSize: '12.5px', color: '#6b7280', margin: '0 0 6px 0' }}>
                Untouched for 24h
              </p>
              <div style={{ display: 'flex', gap: '8px', margin: '4px 0 8px 0' }}>
                <button
                  onClick={() => handleResolve('item1', 'Calling now — prioritizing Mukunda and Kavitha.', 'Got it, moving hot leads to top priority.')}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '999px',
                    padding: '4px 14px',
                    fontSize: '12.5px',
                    fontWeight: 600,
                    color: '#1e293b',
                    cursor: 'pointer',
                  }}
                >
                  Calling now
                </button>
                <button
                  onClick={() => handleResolve('item1', 'Please reassign the 2 hot leads to another rep.', 'Reassigning leads to active teammates.')}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '999px',
                    padding: '4px 14px',
                    fontSize: '12.5px',
                    fontWeight: 600,
                    color: '#1e293b',
                    cursor: 'pointer',
                  }}
                >
                  Reassign
                </button>
              </div>
              <form onSubmit={(e) => handleTextSubmit(e, 'item1', 'Noted your update for hot leads.')} style={{ display: 'flex', gap: '8px' }} noValidate>
                <input
                  value={answers.item1 || ''}
                  onChange={(e) => {
                    setAnswers((prev) => ({ ...prev, item1: e.target.value }))
                    if (errors.item1) setErrors((prev) => ({ ...prev, item1: '' }))
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
              {errors.item1 && <p style={{ color: '#ef4444', fontSize: '12px', margin: '2px 0 0 0' }}>{errors.item1}</p>}
            </div>
          ) : (
            <div style={{ fontSize: '13px', color: '#0f766e', fontWeight: 600 }}>✓ Resolved hot leads assignment</div>
          )}

          {/* Avani Item 2: Log this morning's call outcome */}
          {!resolvedItems.has('item2') ? (
            <div>
              <h2 style={{ fontSize: '14.5px', fontWeight: 700, color: '#111827', margin: '0 0 2px 0' }}>
                Log this morning's call outcome
              </h2>
              <p style={{ fontSize: '12.5px', color: '#6b7280', margin: '0 0 6px 0' }}>
                Suresh Nair · plan upgrade enquiry
              </p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', margin: '4px 0 8px 0' }}>
                <button
                  onClick={() => handleResolve('item2', 'Converted — agreed to Pro plan upgrade.', 'Great job! Outcome logged in CRM.')}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '999px',
                    padding: '4px 14px',
                    fontSize: '12.5px',
                    fontWeight: 600,
                    color: '#1e293b',
                    cursor: 'pointer',
                  }}
                >
                  Converted
                </button>
                <button
                  onClick={() => handleResolve('item2', 'Callback requested for tomorrow morning.', 'Callback noted and reminder scheduled.')}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '999px',
                    padding: '4px 14px',
                    fontSize: '12.5px',
                    fontWeight: 600,
                    color: '#1e293b',
                    cursor: 'pointer',
                  }}
                >
                  Callback
                </button>
                <button
                  onClick={() => handleResolve('item2', 'Not interested at this time.', 'Logged as not interested.')}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '999px',
                    padding: '4px 14px',
                    fontSize: '12.5px',
                    fontWeight: 600,
                    color: '#1e293b',
                    cursor: 'pointer',
                  }}
                >
                  Not interested
                </button>
              </div>
              <form onSubmit={(e) => handleTextSubmit(e, 'item2', 'Outcome saved to CRM.')} style={{ display: 'flex', gap: '8px' }} noValidate>
                <input
                  value={answers.item2 || ''}
                  onChange={(e) => {
                    setAnswers((prev) => ({ ...prev, item2: e.target.value }))
                    if (errors.item2) setErrors((prev) => ({ ...prev, item2: '' }))
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
              {errors.item2 && <p style={{ color: '#ef4444', fontSize: '12px', margin: '2px 0 0 0' }}>{errors.item2}</p>}
            </div>
          ) : (
            <div style={{ fontSize: '13px', color: '#0f766e', fontWeight: 600 }}>✓ Call outcome logged</div>
          )}
        </div>
      )}

      {!collapsed && !isAvani && !resolvedItems.has('single') && (
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
                onClick={() => handleResolve('single', 'Confirmed — I will call at 4:30pm.', 'Great, the 4:30pm callback is locked in.')}
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
                    handleResolve('single', `Please reschedule the callback to ${t}.`, `Rescheduled to ${t}. I will remind you 10 minutes before.`)
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

          <form onSubmit={(e) => handleTextSubmit(e, 'single', 'Thanks, noted. I will update the callback plan.')} style={{ display: 'flex', gap: '8px', marginTop: '4px' }} noValidate>
            <input
              value={answers.single || ''}
              onChange={(e) => {
                setAnswers((prev) => ({ ...prev, single: e.target.value }))
                if (errors.single) setErrors((prev) => ({ ...prev, single: '' }))
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
          {errors.single && (
            <p style={{ color: '#ef4444', fontSize: '12px', margin: '2px 0 0 0' }} role="alert">
              {errors.single}
            </p>
          )}
        </>
      )}
    </section>
  )
}
