import { useState } from 'react'
import { Bot, MessageSquare, Mic, User } from 'lucide-react'
import { useToast } from '../../context/ToastContext'

const QUICK_ACTIONS = [
  { label: '(Not interested)', variant: 'neutral' },
  { label: 'Send price on WhatsApp', variant: 'purple' },
  { label: 'Offer callback slot', variant: 'purple' },
  { label: 'Explain warranty terms', variant: 'purple' },
  { label: 'Escalate to manager', variant: 'purple' },
]

export function AIAssistPanel({ contact = { name: 'Mukunda' } }) {
  const toast = useToast()

  const handleAction = (label) => {
    toast(`Triggered: ${label}`)
  }

  return (
    <aside
      style={{
        background: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
        border: '1px solid #eef0f5',
        padding: '16px',
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
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {QUICK_ACTIONS.map((action) => {
          const isNeutral = action.variant === 'neutral'
          return (
            <button
              key={action.label}
              onClick={() => handleAction(action.label)}
              style={{
                backgroundColor: isNeutral ? '#f8fafc' : '#f5f3ff',
                color: isNeutral ? '#64748b' : '#6d28d9',
                border: isNeutral ? '1px solid #e2e8f0' : '1px solid #ddd6fe',
                borderRadius: '999px',
                padding: '6px 14px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = isNeutral ? '#f1f5f9' : '#ede9fe'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = isNeutral ? '#f8fafc' : '#f5f3ff'
              }}
            >
              {action.label}
            </button>
          )
        })}
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
            gap: '5px',
          }}
        >
          <span>📝</span>
          <span>SUMMARY, DRAFTING AS YOU TALK</span>
        </div>
        <div
          style={{
            backgroundColor: '#fafafa',
            border: '1.5px dashed #e2e8f0',
            borderRadius: '12px',
            padding: '12px 14px',
            minHeight: '38px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: '12px', color: '#94a3b8', fontStyle: 'italic' }}>
            Listening to call… key conversation notes and customer intent will appear here.
          </span>
        </div>
      </div>

      {/* CASE HISTORY */}
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
            gap: '5px',
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
              87
            </div>
            <div>
              <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#0f172a' }}>
                Intent Score 91/100
              </div>
              <div style={{ fontSize: '11.5px', color: '#64748b' }}>
                ICP fit 87%
              </div>
            </div>
          </div>

          {/* Metric Bars */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {/* Budget Fit */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
              <span style={{ color: '#64748b', width: '90px' }}>Budget Fit</span>
              <div style={{ flex: 1, height: '6px', backgroundColor: '#e2e8f0', borderRadius: '999px', margin: '0 10px', overflow: 'hidden' }}>
                <div style={{ width: '87%', height: '100%', backgroundColor: '#10b981', borderRadius: '999px' }} />
              </div>
              <span style={{ color: '#059669', fontWeight: 700, width: '32px', textAlign: 'right' }}>87%</span>
            </div>

            {/* Need Match */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
              <span style={{ color: '#64748b', width: '90px' }}>Need Match</span>
              <div style={{ flex: 1, height: '6px', backgroundColor: '#e2e8f0', borderRadius: '999px', margin: '0 10px', overflow: 'hidden' }}>
                <div style={{ width: '72%', height: '100%', backgroundColor: '#d97706', borderRadius: '999px' }} />
              </div>
              <span style={{ color: '#d97706', fontWeight: 700, width: '32px', textAlign: 'right' }}>72%</span>
            </div>

            {/* Decision Stage */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
              <span style={{ color: '#64748b', width: '90px' }}>Decision Stage</span>
              <div style={{ flex: 1, height: '6px', backgroundColor: '#e2e8f0', borderRadius: '999px', margin: '0 10px', overflow: 'hidden' }}>
                <div style={{ width: '60%', height: '100%', backgroundColor: '#8b5cf6', borderRadius: '999px' }} />
              </div>
              <span style={{ color: '#8b5cf6', fontWeight: 700, width: '32px', textAlign: 'right' }}>60%</span>
            </div>
          </div>
        </div>

        {/* HOW THEY'VE INTERACTED WITH US */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
          <div style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            HOW THEY'VE INTERACTED WITH US
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
            {/* Meta Ad */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                <User size={13} />
              </div>
              <div>
                <div><strong style={{ color: '#0f172a' }}>Meta Ad</strong> <span style={{ color: '#94a3b8' }}>18 May</span></div>
                <div style={{ color: '#64748b', lineHeight: 1.35 }}>Clicked our &quot;0% EMI on Ortho GRID&quot; retargeting ad — first touch</div>
              </div>
            </div>

            {/* AI Agent */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#f3e8ff', color: '#9333ea', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                <Bot size={13} />
              </div>
              <div>
                <div><strong style={{ color: '#0f172a' }}>AI Agent</strong> <span style={{ color: '#94a3b8' }}>20 May</span></div>
                <div style={{ color: '#64748b', lineHeight: 1.35 }}>WhatsApp opt-in — shared preferred size</div>
              </div>
            </div>

            {/* Voice AI */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#f1f5f9', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                <Mic size={13} />
              </div>
              <div>
                <div><strong style={{ color: '#0f172a' }}>Voice AI</strong> <span style={{ color: '#94a3b8' }}>22 May</span></div>
                <div style={{ color: '#64748b', lineHeight: 1.35 }}>4m 12s qualifying call — asked if pillows come bundled</div>
              </div>
            </div>

            {/* WhatsApp */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#dcfce7', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                <MessageSquare size={13} />
              </div>
              <div>
                <div><strong style={{ color: '#0f172a' }}>WhatsApp</strong> <span style={{ color: '#94a3b8' }}>24 May</span></div>
                <div style={{ color: '#64748b', lineHeight: 1.35 }}>Asked for a quote with pillows bundled in</div>
              </div>
            </div>
          </div>
        </div>

        {/* WHAT THEY LIKED / ARE CONCERNED ABOUT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' }}>
          <div style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            WHAT THEY LIKED / ARE CONCERNED ABOUT
          </div>
          <div style={{ fontSize: '12px', color: '#475569', lineHeight: 1.4 }}>
            <div>👍 <strong>Liked:</strong> 100-night trial, zero motion transfer</div>
            <div style={{ marginTop: '2px' }}>⚠️ <strong>Concerned:</strong> Price vs standard foam</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
