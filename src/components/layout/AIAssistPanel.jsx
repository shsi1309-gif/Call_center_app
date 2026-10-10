import { useState } from 'react'
import { Sparkles, Send, Lightbulb, Check, ChevronDown } from 'lucide-react'
import { useToast } from '../../context/ToastContext'

const SOP_CHECKPOINTS = [
  { id: 'opening', label: 'Opening & Intent Confirm', done: true },
  { id: 'discovery', label: 'Needs Discovery', done: true },
  { id: 'pitch', label: 'Product Pitch (Smart Luxe)', done: false },
  { id: 'emi', label: 'EMI / Financing Mention', done: false },
  { id: 'warranty', label: '10-Year Warranty Mention', done: false },
  { id: 'closing', label: 'Callback / Closing Booking', done: false },
]

export function AIAssistPanel({ contact = { name: 'Ritu S.' } }) {
  const toast = useToast()
  const [aiQuery, setAiQuery] = useState('')
  const [checklist, setChecklist] = useState(SOP_CHECKPOINTS)
  const [checklistOpen, setChecklistOpen] = useState(true)

  const handleAskAi = (e) => {
    e.preventDefault()
    if (!aiQuery.trim()) return
    toast(`AI: Recommended delivery timeline is 2-3 business days with free setup.`)
    setAiQuery('')
  }

  const handlePillClick = (action) => {
    toast(`Triggered: ${action}`)
  }

  const toggleCheck = (id) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    )
  }

  return (
    <aside
      style={{
        background: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        border: '1px solid #e2e8f0',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        fontFamily: 'inherit',
        color: '#1e293b',
        height: '100%',
        overflowY: 'auto',
        boxSizing: 'border-box',
      }}
      aria-label="AI Assist panel"
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #4c1d95, #7c3aed)',
          color: '#ffffff',
          padding: '10px 14px',
          borderRadius: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '14px' }}>
          <Sparkles size={16} />
          <span>AI Assist</span>
        </div>
        <span
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            color: '#4ade80',
            fontSize: '11px',
            fontWeight: 800,
            padding: '2px 8px',
            borderRadius: '999px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          ● LIVE
        </span>
      </div>

      {/* Unlock / Score Target Card */}
      <div
        style={{
          background: '#0f172a',
          color: '#ffffff',
          borderRadius: '12px',
          padding: '12px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '18px' }}>🏆</span>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 800 }}>₹13,390</div>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>unlock</div>
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '13px', fontWeight: 800, color: '#facc15' }}>+8 pts</div>
          <div style={{ fontSize: '10.5px', color: '#94a3b8' }}>OG Score™</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '13px', fontWeight: 800, color: '#38bdf8' }}>#1 rank</div>
          <div style={{ fontSize: '10.5px', color: '#94a3b8' }}>if closed</div>
        </div>
      </div>

      {/* MAIN OBJECTIVE — WHAT TO OFFER */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ fontSize: '11px', fontWeight: 800, color: '#854d0e', letterSpacing: '0.4px', textTransform: 'uppercase' }}>
          🎯 MAIN OBJECTIVE — WHAT TO OFFER
        </div>

        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '10px 12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '18px' }}>🛏️</span>
            <div>
              <strong style={{ fontSize: '13.5px', color: '#0f172a' }}>
                Smart Luxe Mattress · ₹13,390
              </strong>
              <div style={{ fontSize: '11.5px', color: '#64748b' }}>
                Interested: Smart Luxe Mattress · ₹13,390
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <div style={{ background: '#f0fdfa', border: '1px solid #ccfbf1', borderRadius: '10px', padding: '9px 10px' }}>
            <div style={{ fontSize: '10px', fontWeight: 800, color: '#0f766e', textTransform: 'uppercase' }}>
              🛏️ CROSS-SELL THIS
            </div>
            <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#134e4a', marginTop: '2px' }}>
              Mattress Protector · ₹1,999
            </div>
          </div>
          <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', borderRadius: '10px', padding: '9px 10px' }}>
            <div style={{ fontSize: '10px', fontWeight: 800, color: '#b45309', textTransform: 'uppercase' }}>
              💳 EMI TO OFFER
            </div>
            <div style={{ fontSize: '11.5px', color: '#78350f', marginTop: '2px', lineHeight: 1.35 }}>
              Not yet discussed — surface it early
            </div>
          </div>
        </div>

        <div style={{ display: 'inline-block' }}>
          <span
            style={{
              background: '#fef3c7',
              color: '#92400e',
              border: '1px solid #fde68a',
              fontSize: '11px',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: '6px',
            }}
          >
            Quotation Demanded
          </span>
        </div>
      </div>

      {/* SOP CHECKLIST — THIS CALL */}
      <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
        <button
          onClick={() => setChecklistOpen(!checklistOpen)}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            textAlign: 'left',
          }}
        >
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', letterSpacing: '0.4px', textTransform: 'uppercase' }}>
            📋 SOP CHECKLIST — THIS CALL
          </span>
          <ChevronDown size={14} style={{ transform: checklistOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s', color: '#64748b' }} />
        </button>

        {checklistOpen && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
            {checklist.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleCheck(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '12.5px',
                  cursor: 'pointer',
                  color: item.done ? '#0f766e' : '#64748b',
                }}
              >
                <div
                  style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '4px',
                    border: item.done ? '1.5px solid #0f766e' : '1.5px solid #cbd5e1',
                    background: item.done ? '#0f766e' : '#fff',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px',
                    flexShrink: 0,
                  }}
                >
                  {item.done && <Check size={12} strokeWidth={3} />}
                </div>
                <span style={{ textDecoration: item.done ? 'none' : 'none', fontWeight: item.done ? 600 : 400 }}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ASK AI ABOUT THIS CALL */}
      <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
        <div style={{ fontSize: '11px', fontWeight: 800, color: '#7c3aed', letterSpacing: '0.4px', textTransform: 'uppercase', marginBottom: '6px' }}>
          💬 ASK AI ABOUT THIS CALL
        </div>
        <form onSubmit={handleAskAi} style={{ display: 'flex', gap: '6px' }}>
          <input
            value={aiQuery}
            onChange={(e) => setAiQuery(e.target.value)}
            placeholder="e.g. what's our return policy? has he me"
            style={{
              flex: 1,
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              padding: '8px 10px',
              fontSize: '12.5px',
              outline: 'none',
              background: '#f8fafc',
            }}
          />
          <button
            type="submit"
            style={{
              background: '#7c3aed',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
            }}
            aria-label="Ask AI"
          >
            <Send size={14} />
          </button>
        </form>
      </div>

      {/* Tip Callout */}
      <div
        style={{
          background: '#fefce8',
          border: '1px solid #fef08a',
          borderRadius: '10px',
          padding: '10px 12px',
          fontSize: '12px',
          color: '#713f12',
          lineHeight: 1.45,
          display: 'flex',
          gap: '8px',
        }}
      >
        <Lightbulb size={16} style={{ color: '#ca8a04', flexShrink: 0, marginTop: '2px' }} />
        <div>
          <strong>Tip:</strong> Asked "how soon can this be delivered" — very high buying signal, close fast.
        </div>
      </div>

      {/* Quick Action Pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: 'auto', paddingTop: '8px' }}>
        {['Send price on WhatsApp', 'Offer callback slot', 'Explain warranty terms', 'Escalate to manager'].map((pill) => (
          <button
            key={pill}
            onClick={() => handlePillClick(pill)}
            style={{
              background: '#f1f5f9',
              border: '1px solid #e2e8f0',
              borderRadius: '999px',
              padding: '4px 10px',
              fontSize: '11.5px',
              fontWeight: 600,
              color: '#475569',
              cursor: 'pointer',
              transition: 'background 0.15s ease',
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = '#e2e8f0')}
            onMouseOut={(e) => (e.currentTarget.style.background = '#f1f5f9')}
          >
            {pill}
          </button>
        ))}
      </div>
    </aside>
  )
}
