import { useState } from 'react'
import { ChevronUp, Pin, Mail, User, Building2 } from 'lucide-react'
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
  const [acknowledged, setAcknowledged] = useState(false)
  const [showClearedToast, setShowClearedToast] = useState(false)

  const isAvani = channelId === 'avanibot'
  const isAgent = channelId === 'callcentre-agent'
  const isCrossSell = channelId === 'cross-sell-agent'
  const isSop = channelId === 'sop-agent'
  const isTaskAgent = isCrossSell || isSop

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

  const handleGotIt = () => {
    setAcknowledged(true)
    postBotMessage(channelId, "Your day is in. Your manager has today's report.", 'AvaniBot')
    sendMessage(channelId, 'Got it\n✓ Task done · removed from your tasks')
    
    setShowClearedToast(true)
    setTimeout(() => {
      setShowClearedToast(false)
    }, 4000)
  }

  // ===== Render for Task Agents (#cross-sell-agent and #sop-agent) =====
  if (isTaskAgent) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {/* KPI Performance Bar */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderBottom: '1px solid #e5e7eb',
            padding: '10px 16px',
            fontSize: '12px',
          }}
        >
          <div style={{ color: '#6b7280', fontSize: '11px', fontWeight: 600, marginBottom: '6px' }}>
            📅 Period: MTD · 1-4 Oct 2026 · conversations = count
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: '#111827', minWidth: '160px' }}>
              <Building2 size={14} style={{ color: '#059669' }} />
              <span>Koramangala · your store</span>
            </div>

            {/* Metrics */}
            <div style={{ display: 'flex', gap: '10px', flex: 1, minWidth: '300px' }}>
              {/* REVENUE */}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '9.5px', fontWeight: 800, color: '#6b7280', marginBottom: '2px' }}>REVENUE</div>
                <div
                  style={{
                    position: 'relative',
                    height: '22px',
                    backgroundColor: '#fee2e2',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 8px',
                    fontSize: '11px',
                    fontWeight: 700,
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: '72%',
                      backgroundColor: '#fca5a5',
                      zIndex: 0,
                    }}
                  />
                  <span style={{ position: 'relative', zIndex: 1, color: '#991b1b' }}>1.15M <span style={{ fontWeight: 500, color: '#7f1d1d' }}>/1.6M</span></span>
                  <span style={{ position: 'relative', zIndex: 1, marginLeft: 'auto', color: '#991b1b', fontWeight: 800 }}>72%</span>
                </div>
              </div>

              {/* ATV */}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '9.5px', fontWeight: 800, color: '#6b7280', marginBottom: '2px' }}>ATV</div>
                <div
                  style={{
                    position: 'relative',
                    height: '22px',
                    backgroundColor: '#fef3c7',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 8px',
                    fontSize: '11px',
                    fontWeight: 700,
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: '81%',
                      backgroundColor: '#fde68a',
                      zIndex: 0,
                    }}
                  />
                  <span style={{ position: 'relative', zIndex: 1, color: '#92400e' }}>42.1K <span style={{ fontWeight: 500, color: '#78350f' }}>/52K</span></span>
                  <span style={{ position: 'relative', zIndex: 1, marginLeft: 'auto', color: '#92400e', fontWeight: 800 }}>81%</span>
                </div>
              </div>

              {/* CONVERSATIONS */}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '9.5px', fontWeight: 800, color: '#6b7280', marginBottom: '2px' }}>CONVERSATIONS</div>
                <div
                  style={{
                    position: 'relative',
                    height: '22px',
                    backgroundColor: '#fef3c7',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 8px',
                    fontSize: '11px',
                    fontWeight: 700,
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: '86%',
                      backgroundColor: '#fde68a',
                      zIndex: 0,
                    }}
                  />
                  <span style={{ position: 'relative', zIndex: 1, color: '#92400e' }}>412 <span style={{ fontWeight: 500, color: '#78350f' }}>/480</span></span>
                  <span style={{ position: 'relative', zIndex: 1, marginLeft: 'auto', color: '#92400e', fontWeight: 800 }}>86%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Green Context & Tasks Section */}
        <section
          style={{
            backgroundColor: '#f0fdf4',
            borderBottom: '1px solid #bbf7d0',
            padding: '12px 16px',
          }}
        >
          {/* Header Row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: collapsed ? 0 : '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <Mail size={15} style={{ color: '#059669' }} />
              <strong style={{ fontSize: '13.5px', color: '#065f46' }}>My Context & Tasks</strong>
              <span
                style={{
                  backgroundColor: '#047857',
                  color: '#ffffff',
                  fontSize: '10px',
                  fontWeight: 800,
                  padding: '2px 6px',
                  borderRadius: '999px',
                }}
              >
                FOR YOU
              </span>
              <span
                style={{
                  backgroundColor: '#ef4444',
                  color: '#ffffff',
                  fontSize: '11px',
                  fontWeight: 800,
                  padding: '0 6px',
                  borderRadius: '999px',
                  lineHeight: '16px',
                }}
              >
                {acknowledged ? '1' : '2'}
              </span>
              <span style={{ fontSize: '12px', color: '#4b5563' }}>
                From your manager · 2 tasks · {acknowledged ? '1 to action' : '2 to action'}
              </span>
            </div>

            <button
              onClick={() => setCollapsed(!collapsed)}
              style={{ background: 'none', border: 'none', color: '#059669', cursor: 'pointer', padding: '2px' }}
              aria-label="Toggle collapse"
            >
              <ChevronUp size={16} style={{ transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
            </button>
          </div>

          {!collapsed && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* Incoming Context */}
              <div>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#047857', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '2px' }}>
                  INCOMING CONTEXT
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '6px' }}>
                  Sent 9:00am by AvaniBot for your manager
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '22px', fontWeight: 800, color: '#dc2626' }}>
                    {isCrossSell ? '24%' : '81%'}
                  </span>
                  <span style={{ fontSize: '13px', color: '#4b5563' }}>
                    {isCrossSell ? 'your attach rate yesterday · target 25%' : 'your sop adherence yesterday · target 85%'}
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                  {isCrossSell ? 'Attach rate: 24% (target 25%)' : 'SOP adherence: 81% (target 85%)'}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '12.5px' }}>
                  <div style={{ color: '#047857', fontWeight: 600 }}>
                    {isCrossSell ? '✓ Did well: Added a protector in 4 of 12 sales' : '✓ Did well: Asked for feedback on every closed sale'}
                  </div>
                  <div style={{ color: '#c2410c', fontWeight: 600 }}>
                    {isCrossSell ? '↗ Improve: Offer the pillow bundle before billing' : '↗ Improve: Greet within 10 seconds'}
                  </div>
                </div>
              </div>

              {/* My Tasks Today */}
              <div>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#047857', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '6px' }}>
                  MY TASKS TODAY
                </div>

                {/* Acknowledge box */}
                {!acknowledged && (
                  <div
                    style={{
                      backgroundColor: '#fefce8',
                      border: '1px solid #fef08a',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '8px',
                    }}
                  >
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#854d0e' }}>
                      Acknowledge today's tasks
                    </span>
                    <button
                      onClick={handleGotIt}
                      style={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        padding: '4px 12px',
                        fontSize: '12px',
                        fontWeight: 600,
                        color: '#111827',
                        cursor: 'pointer',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                      }}
                    >
                      Got it
                    </button>
                  </div>
                )}

                {/* Tasks Container */}
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '10px',
                    padding: '10px 12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        backgroundColor: '#eff6ff',
                        color: '#2563eb',
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '999px',
                      }}
                    >
                      {isCrossSell ? 'Type 1 · Customers to upsell' : 'Type 1 · Conversations to review'}
                    </span>
                  </div>

                  <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#111827' }}>
                    {isCrossSell ? (
                      <>Meera S. <span style={{ fontWeight: 400, color: '#6b7280' }}>· Bought mattress, no protector · call today</span></>
                    ) : (
                      <>Talk at 11:40am <span style={{ fontWeight: 400, color: '#6b7280' }}>· Greeting after 35s</span></>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>Update:</span>
                    <button
                      onClick={() => handleResolve('t1', 'Update: Done with update.', 'Logged as Done.')}
                      style={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #cbd5e1',
                        borderRadius: '999px',
                        padding: '3px 12px',
                        fontSize: '12px',
                        fontWeight: 600,
                        color: '#1e293b',
                        cursor: 'pointer',
                      }}
                    >
                      Done
                    </button>
                    <button
                      onClick={() => handleResolve('t1', 'Update: Not yet done.', 'Reminder kept active.')}
                      style={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #cbd5e1',
                        borderRadius: '999px',
                        padding: '3px 12px',
                        fontSize: '12px',
                        fontWeight: 600,
                        color: '#1e293b',
                        cursor: 'pointer',
                      }}
                    >
                      Not yet
                    </button>
                    <button
                      onClick={() => handleResolve('t1', 'Update: Need help with task.', 'Help request routed to manager.')}
                      style={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #cbd5e1',
                        borderRadius: '999px',
                        padding: '3px 12px',
                        fontSize: '12px',
                        fontWeight: 600,
                        color: '#1e293b',
                        cursor: 'pointer',
                      }}
                    >
                      Need help
                    </button>
                  </div>

                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#111827', marginTop: '4px', paddingTop: '6px', borderTop: '1px solid #f3f4f6' }}>
                    {isCrossSell ? (
                      <>Karan P. <span style={{ fontWeight: 400, color: '#6b7280' }}>· Queen to king upgrade · send quote</span></>
                    ) : (
                      <>Talk at 3:05pm <span style={{ fontWeight: 400, color: '#6b7280' }}>· No feedback ask</span></>
                    )}
                  </div>

                  <div style={{ marginTop: '4px', paddingTop: '6px', borderTop: '1px solid #f3f4f6', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span
                      style={{
                        alignSelf: 'flex-start',
                        backgroundColor: '#fff7ed',
                        color: '#c2410c',
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '999px',
                      }}
                    >
                      Type 2 · Soft tasks
                    </span>
                    <div style={{ fontSize: '12.5px', color: '#047857', fontWeight: 600 }}>
                      {isCrossSell ? 'Good at: Protector pitch' : 'Good at: Feedback ask'}
                    </div>
                    <div style={{ fontSize: '12.5px', color: '#c2410c', fontWeight: 600 }}>
                      {isCrossSell ? 'Practise today: Pillow bundle' : 'Practise today: Fast greeting'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {showClearedToast && (
          <div
            style={{
              position: 'fixed',
              bottom: '76px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: '#0f172a',
              color: '#ffffff',
              padding: '8px 18px',
              borderRadius: '999px',
              fontSize: '13px',
              fontWeight: 600,
              boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              animation: 'fadeIn 0.2s ease-out',
            }}
          >
            <span>Task done · cleared from this channel</span>
          </div>
        )}
      </div>
    )
  }

  // ===== Render for # callcentre-agent =====
  if (isAgent) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {/* KPI Performance Bar */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderBottom: '1px solid #e5e7eb',
            padding: '10px 16px',
            fontSize: '12px',
          }}
        >
          <div style={{ color: '#6b7280', fontSize: '11px', fontWeight: 600, marginBottom: '6px' }}>
            📅 Period: MTD · 1-4 Oct 2026 · conversations = count
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: '#111827', minWidth: '130px' }}>
              <User size={14} style={{ color: '#059669' }} />
              <span>Arvind Rajan · you</span>
            </div>

            {/* Metrics */}
            <div style={{ display: 'flex', gap: '10px', flex: 1, minWidth: '300px' }}>
              {/* REVENUE */}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '9.5px', fontWeight: 800, color: '#6b7280', marginBottom: '2px' }}>REVENUE</div>
                <div
                  style={{
                    position: 'relative',
                    height: '22px',
                    backgroundColor: '#fef3c7',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 8px',
                    fontSize: '11px',
                    fontWeight: 700,
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: '84%',
                      backgroundColor: '#fde68a',
                      zIndex: 0,
                    }}
                  />
                  <span style={{ position: 'relative', zIndex: 1, color: '#92400e' }}>420K <span style={{ fontWeight: 500, color: '#78350f' }}>/500K</span></span>
                  <span style={{ position: 'relative', zIndex: 1, marginLeft: 'auto', color: '#92400e', fontWeight: 800 }}>84%</span>
                </div>
              </div>

              {/* ATV */}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '9.5px', fontWeight: 800, color: '#6b7280', marginBottom: '2px' }}>ATV</div>
                <div
                  style={{
                    position: 'relative',
                    height: '22px',
                    backgroundColor: '#fef3c7',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 8px',
                    fontSize: '11px',
                    fontWeight: 700,
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: '85%',
                      backgroundColor: '#fde68a',
                      zIndex: 0,
                    }}
                  />
                  <span style={{ position: 'relative', zIndex: 1, color: '#92400e' }}>38.2K <span style={{ fontWeight: 500, color: '#78350f' }}>/45K</span></span>
                  <span style={{ position: 'relative', zIndex: 1, marginLeft: 'auto', color: '#92400e', fontWeight: 800 }}>85%</span>
                </div>
              </div>

              {/* CONVERSATIONS */}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '9.5px', fontWeight: 800, color: '#6b7280', marginBottom: '2px' }}>CONVERSATIONS</div>
                <div
                  style={{
                    position: 'relative',
                    height: '22px',
                    backgroundColor: '#fef3c7',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 8px',
                    fontSize: '11px',
                    fontWeight: 700,
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: '84%',
                      backgroundColor: '#fde68a',
                      zIndex: 0,
                    }}
                  />
                  <span style={{ position: 'relative', zIndex: 1, color: '#92400e' }}>168 <span style={{ fontWeight: 500, color: '#78350f' }}>/200</span></span>
                  <span style={{ position: 'relative', zIndex: 1, marginLeft: 'auto', color: '#92400e', fontWeight: 800 }}>84%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Green Context & Tasks Section */}
        <section
          style={{
            backgroundColor: '#f0fdf4',
            borderBottom: '1px solid #bbf7d0',
            padding: '12px 16px',
          }}
        >
          {/* Header Row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: collapsed ? 0 : '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <Mail size={15} style={{ color: '#059669' }} />
              <strong style={{ fontSize: '13.5px', color: '#065f46' }}>My Context & Tasks</strong>
              <span
                style={{
                  backgroundColor: '#047857',
                  color: '#ffffff',
                  fontSize: '10px',
                  fontWeight: 800,
                  padding: '2px 6px',
                  borderRadius: '999px',
                }}
              >
                FOR YOU
              </span>
              <span
                style={{
                  backgroundColor: '#ef4444',
                  color: '#ffffff',
                  fontSize: '11px',
                  fontWeight: 800,
                  padding: '0 6px',
                  borderRadius: '999px',
                  lineHeight: '16px',
                }}
              >
                {acknowledged ? '1' : '2'}
              </span>
              <span style={{ fontSize: '12px', color: '#4b5563' }}>
                From your manager · 2 tasks · {acknowledged ? '1 to action' : '2 to action'}
              </span>
            </div>

            <button
              onClick={() => setCollapsed(!collapsed)}
              style={{ background: 'none', border: 'none', color: '#059669', cursor: 'pointer', padding: '2px' }}
              aria-label="Toggle collapse"
            >
              <ChevronUp size={16} style={{ transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
            </button>
          </div>

          {!collapsed && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* Incoming Context */}
              <div>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#047857', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '2px' }}>
                  INCOMING CONTEXT
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                  Sent 9:00am by AvaniBot for your manager
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '12.5px' }}>
                  <div style={{ color: '#047857', fontWeight: 600 }}>
                    ✓ Did well: Booked 6 store visits from callbacks
                  </div>
                  <div style={{ color: '#c2410c', fontWeight: 600 }}>
                    ↗ Improve: Greeting in the first 10 seconds on 71% of calls
                  </div>
                </div>
              </div>

              {/* My Tasks Today */}
              <div>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#047857', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '6px' }}>
                  MY TASKS TODAY
                </div>

                {/* Acknowledge box */}
                {!acknowledged && (
                  <div
                    style={{
                      backgroundColor: '#fefce8',
                      border: '1px solid #fef08a',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '8px',
                    }}
                  >
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#854d0e' }}>
                      Acknowledge today's tasks
                    </span>
                    <button
                      onClick={handleGotIt}
                      style={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        padding: '4px 12px',
                        fontSize: '12px',
                        fontWeight: 600,
                        color: '#111827',
                        cursor: 'pointer',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                      }}
                    >
                      Got it
                    </button>
                  </div>
                )}

                {/* Lead to follow up */}
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '10px',
                    padding: '10px 12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        backgroundColor: '#eff6ff',
                        color: '#2563eb',
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '999px',
                      }}
                    >
                      Type 1 · Leads to follow up
                    </span>
                  </div>

                  <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#111827' }}>
                    Priya Iyer <span style={{ fontWeight: 400, color: '#6b7280' }}>· Billing dispute · call 4:30pm</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>Update:</span>
                    <button
                      onClick={() => handleResolve('priya', 'Update: Done with billing dispute.', 'Logged as Done for Priya Iyer.')}
                      style={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #cbd5e1',
                        borderRadius: '999px',
                        padding: '3px 12px',
                        fontSize: '12px',
                        fontWeight: 600,
                        color: '#1e293b',
                        cursor: 'pointer',
                      }}
                    >
                      Done
                    </button>
                    <button
                      onClick={() => handleResolve('priya', 'Update: Not yet reached Priya.', 'Reminder set for Priya Iyer.')}
                      style={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #cbd5e1',
                        borderRadius: '999px',
                        padding: '3px 12px',
                        fontSize: '12px',
                        fontWeight: 600,
                        color: '#1e293b',
                        cursor: 'pointer',
                      }}
                    >
                      Not yet
                    </button>
                    <button
                      onClick={() => handleResolve('priya', 'Update: Need help with Priya dispute.', 'Help request routed to manager.')}
                      style={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #cbd5e1',
                        borderRadius: '999px',
                        padding: '3px 12px',
                        fontSize: '12px',
                        fontWeight: 600,
                        color: '#1e293b',
                        cursor: 'pointer',
                      }}
                    >
                      Need help
                    </button>
                  </div>

                  {acknowledged && (
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#111827', marginTop: '6px', paddingTop: '8px', borderTop: '1px solid #f3f4f6' }}>
                      Suresh Nair <span style={{ fontWeight: 400, color: '#6b7280' }}>· Plan upgrade · log outcome</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </section>

        {showClearedToast && (
          <div
            style={{
              position: 'fixed',
              bottom: '76px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: '#0f172a',
              color: '#ffffff',
              padding: '8px 18px',
              borderRadius: '999px',
              fontSize: '13px',
              fontWeight: 600,
              boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              animation: 'fadeIn 0.2s ease-out',
            }}
          >
            <span>Task done · cleared from this channel</span>
          </div>
        )}
      </div>
    )
  }

  // ===== Render for avanibot & callcentre-team =====
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
