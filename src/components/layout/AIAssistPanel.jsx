import { useState } from 'react'
import { Building2, MessageSquare, Phone, Store, User } from 'lucide-react'
import { useToast } from '../../context/ToastContext'

const QUICK_ACTIONS = [
  { label: 'Send price on WhatsApp' },
  { label: 'Offer callback slot' },
  { label: 'Explain warranty terms' },
  { label: 'Escalate to manager' },
]

export function AIAssistPanel({ contact = { name: 'Faizan A.' } }) {
  const toast = useToast()

  const handleAction = (label) => {
    toast(`Triggered: ${label}`)
  }

  const isFaizan = contact.name === 'Faizan A.' || !contact.name || contact.name.includes('Faizan')

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
        maxHeight: '640px',
        overflowY: 'auto',
        boxSizing: 'border-box',
      }}
      aria-label="Call details and AI assistance"
    >
      {/* Quick Action Pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {QUICK_ACTIONS.map((action) => (
          <button
            key={action.label}
            onClick={() => handleAction(action.label)}
            style={{
              backgroundColor: '#f5f3ff',
              color: '#6d28d9',
              border: '1px solid #ddd6fe',
              borderRadius: '999px',
              padding: '6px 14px',
              fontSize: '12px',
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

      {/* SUMMARY, DRAFTING AS YOU TALK */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
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
          <span>📝</span>
          <span>SUMMARY, DRAFTING AS YOU TALK</span>
        </div>
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1.5px dashed #e2e8f0',
            borderRadius: '12px',
            padding: '14px',
            minHeight: '28px',
            display: 'flex',
            alignItems: 'center',
          }}
        />
      </div>

      {/* CASE HISTORY */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
          <span>CASE HISTORY</span>
        </div>

        {/* Intent Score Card */}
        <div
          style={{
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '14px',
            padding: '14px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          {/* Top Score Row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                border: '2.5px solid #10b981',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '14px',
                backgroundColor: '#ffffff',
                flexShrink: 0,
              }}
            >
              82
            </div>
            <div>
              <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#0f172a' }}>
                Intent Score 85/100
              </div>
              <div style={{ fontSize: '11.5px', color: '#64748b' }}>
                ICP fit 82%
              </div>
            </div>
          </div>

          {/* Metric Bars */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {/* Budget Fit */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
              <span style={{ color: '#64748b', width: '90px' }}>Budget Fit</span>
              <div style={{ flex: 1, height: '6px', backgroundColor: '#e2e8f0', borderRadius: '999px', margin: '0 10px', overflow: 'hidden' }}>
                <div style={{ width: '82%', height: '100%', backgroundColor: '#0d9488', borderRadius: '999px' }} />
              </div>
              <span style={{ color: '#0d9488', fontWeight: 700, width: '32px', textAlign: 'right' }}>82%</span>
            </div>

            {/* Need Match */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
              <span style={{ color: '#64748b', width: '90px' }}>Need Match</span>
              <div style={{ flex: 1, height: '6px', backgroundColor: '#e2e8f0', borderRadius: '999px', margin: '0 10px', overflow: 'hidden' }}>
                <div style={{ width: '78%', height: '100%', backgroundColor: '#0d9488', borderRadius: '999px' }} />
              </div>
              <span style={{ color: '#0d9488', fontWeight: 700, width: '32px', textAlign: 'right' }}>78%</span>
            </div>

            {/* Decision Stage */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
              <span style={{ color: '#64748b', width: '90px' }}>Decision Stage</span>
              <div style={{ flex: 1, height: '6px', backgroundColor: '#e2e8f0', borderRadius: '999px', margin: '0 10px', overflow: 'hidden' }}>
                <div style={{ width: '70%', height: '100%', backgroundColor: '#b45309', borderRadius: '999px' }} />
              </div>
              <span style={{ color: '#b45309', fontWeight: 700, width: '32px', textAlign: 'right' }}>70%</span>
            </div>
          </div>
        </div>

        {/* HOW THEY'VE INTERACTED WITH US */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            HOW THEY'VE INTERACTED WITH US
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
            {/* Store Visit */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <div style={{ width: '26px', height: '26px', borderRadius: '6px', backgroundColor: '#e2e8f0', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                <Store size={14} />
              </div>
              <div>
                <div><strong style={{ color: '#0f172a' }}>Store Visit</strong> <span style={{ color: '#94a3b8' }}>2 Jun</span></div>
                <div style={{ color: '#64748b', lineHeight: 1.35 }}>Tried the chair in-store, asked detailed questions on massage programs</div>
              </div>
            </div>

            {/* Call */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <div style={{ width: '26px', height: '26px', borderRadius: '50%', backgroundColor: '#f1f5f9', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                <Phone size={13} />
              </div>
              <div>
                <div><strong style={{ color: '#0f172a' }}>Call</strong> <span style={{ color: '#94a3b8' }}>4 Jun</span></div>
                <div style={{ color: '#64748b', lineHeight: 1.35 }}>6m 40s call — confirmed budget and asked about EMI</div>
              </div>
            </div>
          </div>
        </div>

        {/* WHAT THEY LIKED / ARE CONCERNED ABOUT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            WHAT THEY LIKED / ARE CONCERNED ABOUT
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {/* Financing Card */}
            <div
              style={{
                backgroundColor: '#f5f3ff',
                border: '1px solid #e9d5ff',
                borderRadius: '10px',
                padding: '10px 12px',
                fontSize: '12px',
                lineHeight: 1.4,
              }}
            >
              <div style={{ fontWeight: 800, color: '#6b21a8', fontSize: '11px', textTransform: 'uppercase', marginBottom: '3px' }}>
                FINANCING RELATED
              </div>
              <div style={{ color: '#334155' }}>
                Explicitly asked for the no-cost EMI plan — ready to commit if financing is confirmed
              </div>
            </div>

            {/* Warranty Card */}
            <div
              style={{
                backgroundColor: '#f5f3ff',
                border: '1px solid #e9d5ff',
                borderRadius: '10px',
                padding: '10px 12px',
                fontSize: '12px',
                lineHeight: 1.4,
              }}
            >
              <div style={{ fontWeight: 800, color: '#6b21a8', fontSize: '11px', textTransform: 'uppercase', marginBottom: '3px' }}>
                WARRANTY RELATED
              </div>
              <div style={{ color: '#334155' }}>
                Compared warranty terms with a competitor and preferred ours — reinforce this on the call
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
