import { Bot, Phone, Settings, ShieldCheck, Smartphone, Users } from 'lucide-react'
import { useCall } from '../../context/CallContext'

export function DemoBar({ onOpenConsent, onOpenDpdpSafe, onOpenCustomerPhone, onOpenTelephony }) {
  const { startCall } = useCall()

  const launchAiCall = () => {
    startCall(
      {
        name: 'Shivam Singh',
        initials: 'SS',
        phone: '93805 41855',
        detail: '+91 93805 41855 · Tranquo Massager Chair',
        callType: 'Call centre',
        callMode: 'ai-to-human',
      },
      'outgoing',
      { mode: 'ai-to-human', openConsent: false },
    )
  }

  const launchHumanCall = () => {
    startCall(
      {
        name: 'Shivam Singh (Customer)',
        initials: 'SS',
        phone: '93805 41855',
        detail: '+91 93805 41855 · WebRTC Softphone',
        callType: 'Phone call',
        callMode: 'human-to-human',
      },
      'outgoing',
      { mode: 'human-to-human', openConsent: false },
    )
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '12px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: '#ffffff',
        borderRadius: '99px',
        padding: '5px 12px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
        border: '1px solid #e5e5ea',
        zIndex: 350,
        maxWidth: '96vw',
        overflowX: 'auto',
      }}
      role="toolbar"
      aria-label="Demo tools"
    >
      <span
        style={{
          background: 'linear-gradient(135deg, #059669, #047857)',
          color: '#fff',
          fontSize: '10.5px',
          fontWeight: 800,
          padding: '3px 8px',
          borderRadius: '99px',
          letterSpacing: '0.04em',
          whiteSpace: 'nowrap',
        }}
      >
        TELEPHONY ACTIVE
      </span>

      {/* Primary Action: Call Shivam Singh */}
      <button
        onClick={launchHumanCall}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 14px',
          borderRadius: '99px',
          background: 'linear-gradient(135deg, #16a34a, #15803d)',
          border: 'none',
          fontSize: '12.5px',
          fontWeight: 800,
          color: '#ffffff',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          boxShadow: '0 2px 8px rgba(22, 163, 74, 0.35)',
        }}
        title="Dial Shivam Singh (+91 93805 41855) on his phone now"
      >
        <Phone size={14} color="#ffffff" /> 📞 Call Shivam (+91 93805 41855)
      </button>

      {/* 1-Click AI-to-Human Calling */}
      <button
        onClick={launchAiCall}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '5px 12px',
          borderRadius: '99px',
          background: '#ecfdf5',
          border: '1px solid #a7f3d0',
          fontSize: '12px',
          fontWeight: 700,
          color: '#065f46',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
        }}
        title="Live AI Voice Call with Vapi WebRTC Assistant"
      >
        <Bot size={14} color="#059669" /> 🤖 AI Voice Call (Vapi)
      </button>

      {/* Handset Simulator (for single-screen testing without physical phone) */}
      <button
        onClick={() => onOpenCustomerPhone?.()}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          padding: '5px 10px',
          borderRadius: '99px',
          background: '#f8fafc',
          border: '1px solid #cbd5e1',
          fontSize: '11.5px',
          fontWeight: 600,
          color: '#64748b',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
        }}
        title="Open Handset Simulator on this computer"
      >
        <Smartphone size={13} color="#64748b" /> 📱 Handset Simulator
      </button>

      {/* Telephony Settings */}
      <button
        onClick={() => onOpenTelephony?.()}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          padding: '4px 10px',
          borderRadius: '99px',
          background: '#faf5ff',
          border: '1px solid #e9d5ff',
          fontSize: '11.5px',
          fontWeight: 600,
          color: '#7e22ce',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
        }}
        title="View or update Vapi credentials and Telephony Gateway"
      >
        <Settings size={13} /> Vapi Config
      </button>

      {/* Consent Modal Trigger */}
      <button
        onClick={() => onOpenConsent?.({ name: 'Shivam Singh', phone: '93805 41855', callType: 'Call centre', initialMode: 'wa' })}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          padding: '4px 10px',
          borderRadius: '99px',
          background: '#f1f5f9',
          border: 'none',
          fontSize: '11.5px',
          fontWeight: 600,
          color: '#475569',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
        }}
      >
        <Phone size={12} /> DPDP Consent
      </button>

      {/* DPDP Safety */}
      <button
        onClick={() => onOpenDpdpSafe?.()}
        style={{
          width: '26px',
          height: '26px',
          borderRadius: '50%',
          background: '#e1f5ee',
          color: '#0f6e56',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          flexShrink: 0,
        }}
        aria-label="DPDP safety rules"
        title="How this app keeps you DPDP-safe"
      >
        <ShieldCheck size={14} />
      </button>
    </div>
  )
}
