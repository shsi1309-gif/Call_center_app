import { useState, useMemo } from 'react'
import { Building2, CheckCircle2, Circle, MessageSquare, Phone, Store, User, Sparkles } from 'lucide-react'
import { useToast } from '../../context/ToastContext'
import { useCall } from '../../context/CallContext'

const QUICK_ACTIONS = [
  { label: 'Send price on WhatsApp', utterance: 'I will send the exact price and brochure right away on your WhatsApp.' },
  { label: 'Offer callback slot', utterance: 'Would tomorrow 11 AM or 4 PM work better for a quick follow-up?' },
  { label: 'Explain warranty terms', utterance: 'Our 3-year warranty covers all motor parts and free doorstep repair.' },
  { label: 'Escalate to manager', utterance: 'Let me conference in our store manager Rohit for an additional VIP perk.' },
]

export function AIAssistPanel({ contact = { name: 'Faizan A.' } }) {
  const toast = useToast()
  const { transcript, sentiment, callMode, sendUtterance } = useCall()
  const [activeTab, setActiveTab] = useState('summary') // 'summary' | 'transcript'

  const handleAction = (action) => {
    toast(`Triggered: ${action.label}`)
    if (action.utterance && sendUtterance) {
      sendUtterance(action.utterance)
    }
  }

  // Derive dynamic drafted summary and SOP items from real transcript
  const { draftNotes, sopChecks } = useMemo(() => {
    const notes = []
    const checks = {
      opening: false,
      product: false,
      emi: false,
      warranty: false,
      closing: false,
    }

    transcript.forEach((t) => {
      const lower = (t.text || '').toLowerCase()
      if (lower.includes('hello') || lower.includes('good time') || lower.includes('enquiry')) {
        checks.opening = true
        notes.push('Opened call and confirmed intent')
      }
      if (lower.includes('chair') || lower.includes('mattress') || lower.includes('roller') || lower.includes('massage')) {
        checks.product = true
        notes.push('Discussed product specifications & back pain relief')
      }
      if (lower.includes('emi') || lower.includes('per month') || lower.includes('finance') || lower.includes('2,082')) {
        checks.emi = true
        notes.push('Presented 0% no-cost EMI plan (₹2,082/mo)')
      }
      if (lower.includes('warranty') || lower.includes('guarantee') || lower.includes('service')) {
        checks.warranty = true
        notes.push('Shared 3-year comprehensive warranty & 24h doorstep service')
      }
      if (lower.includes('book') || lower.includes('order') || lower.includes('discount') || lower.includes('festive') || lower.includes('whatsapp')) {
        checks.closing = true
        notes.push('Offered festive rate & locked in delivery slot')
      }
    })

    return {
      draftNotes: notes.length > 0 ? notes : ['Listening to caller... notes draft in real time as key topics arise.'],
      sopChecks: checks,
    }
  }, [transcript])

  return (
    <aside
      style={{
        background: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
        border: '1px solid #eef0f5',
        padding: '16px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        fontFamily: 'inherit',
        color: '#1e293b',
        height: '100%',
        maxHeight: '620px',
        overflowY: 'auto',
        boxSizing: 'border-box',
      }}
      aria-label="Call details and AI assistance"
    >
      {/* Quick Action Pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {QUICK_ACTIONS.map((action) => (
          <button
            key={action.label}
            onClick={() => handleAction(action)}
            style={{
              backgroundColor: '#f5f3ff',
              color: '#6d28d9',
              border: '1px solid #ddd6fe',
              borderRadius: '999px',
              padding: '5px 12px',
              fontSize: '11.5px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#ede9fe'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#f5f3ff'
            }}
          >
            {action.label}
          </button>
        ))}
      </div>

      {/* Tabs: Live Summary vs Live Transcript */}
      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid #e2e8f0',
          gap: '16px',
          paddingBottom: '4px',
        }}
      >
        <button
          onClick={() => setActiveTab('summary')}
          style={{
            background: 'none',
            border: 'none',
            padding: '4px 0',
            fontSize: '12px',
            fontWeight: 800,
            cursor: 'pointer',
            color: activeTab === 'summary' ? '#6d28d9' : '#64748b',
            borderBottom: activeTab === 'summary' ? '2px solid #6d28d9' : '2px solid transparent',
          }}
        >
          📝 Live AI Summary & SOP
        </button>
        <button
          onClick={() => setActiveTab('transcript')}
          style={{
            background: 'none',
            border: 'none',
            padding: '4px 0',
            fontSize: '12px',
            fontWeight: 800,
            cursor: 'pointer',
            color: activeTab === 'transcript' ? '#6d28d9' : '#64748b',
            borderBottom: activeTab === 'transcript' ? '2px solid #6d28d9' : '2px solid transparent',
          }}
        >
          💬 Live Transcript ({transcript.length})
        </button>
      </div>

      {activeTab === 'transcript' ? (
        /* Real-time transcript feed */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '380px', overflowY: 'auto' }}>
          {transcript.map((item) => (
            <div
              key={item.id}
              style={{
                padding: '8px 12px',
                borderRadius: '10px',
                fontSize: '12px',
                background: item.sender.includes('Agent') ? '#ecfdf5' : '#f8fafc',
                border: item.sender.includes('Agent') ? '1px solid #a7f3d0' : '1px solid #e2e8f0',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                <strong style={{ color: item.sender.includes('Agent') ? '#065f46' : '#1e293b' }}>
                  {item.sender}
                </strong>
                <span style={{ fontSize: '10.5px', color: '#94a3b8' }}>{item.time}</span>
              </div>
              <p style={{ margin: 0, color: '#334155', lineHeight: 1.4 }}>{item.text}</p>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* SUMMARY, DRAFTING AS YOU TALK */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div
              style={{
                fontSize: '11px',
                fontWeight: 800,
                color: '#6d28d9',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Sparkles size={13} />
              <span>DRAFTING AS YOU TALK · AI AGENT NOTES</span>
            </div>
            <div
              style={{
                backgroundColor: '#faf5ff',
                border: '1.5px solid #e9d5ff',
                borderRadius: '12px',
                padding: '12px 14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
              }}
            >
              {draftNotes.map((note, idx) => (
                <div key={idx} style={{ fontSize: '12px', color: '#4c1d95', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                  <span style={{ color: '#a855f7' }}>•</span>
                  <span>{note}</span>
                </div>
              ))}
            </div>

            {/* SOP Live Checklist */}
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '10px 12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
              }}
            >
              <div style={{ fontSize: '10.5px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                Live SOP Checklist
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '11px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: sopChecks.opening ? '#059669' : '#94a3b8' }}>
                  {sopChecks.opening ? <CheckCircle2 size={13} /> : <Circle size={13} />}
                  <span>Opening Intent</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: sopChecks.product ? '#059669' : '#94a3b8' }}>
                  {sopChecks.product ? <CheckCircle2 size={13} /> : <Circle size={13} />}
                  <span>Product Pitch</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: sopChecks.emi ? '#059669' : '#94a3b8' }}>
                  {sopChecks.emi ? <CheckCircle2 size={13} /> : <Circle size={13} />}
                  <span>EMI / Financing</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: sopChecks.warranty ? '#059669' : '#94a3b8' }}>
                  {sopChecks.warranty ? <CheckCircle2 size={13} /> : <Circle size={13} />}
                  <span>Warranty Mention</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* CASE HISTORY & INTENT SCORE */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div
          style={{
            fontSize: '11px',
            fontWeight: 800,
            color: '#78350f',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <span>🗂️</span>
          <span>CRM LEAD CONTEXT</span>
        </div>

        <div
          style={{
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '12px 14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#0f172a' }}>Intent Score: 85/100</span>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#059669', background: '#d1fae5', padding: '2px 8px', borderRadius: '99px' }}>
              High Closing Chance
            </span>
          </div>
          <div style={{ fontSize: '11.5px', color: '#64748b', lineHeight: 1.4 }}>
            Faizan tried the Tranquo Chair in store (2 Jun). Explicitly asked about no-cost EMI and warranty terms.
          </div>
        </div>
      </div>
    </aside>
  )
}
