import { Bot, Phone, Settings, ShieldCheck, Smartphone, Users } from 'lucide-react'
import { useCall } from '../../context/CallContext'

export function DemoBar({ onOpenConsent, onOpenDpdpSafe, onOpenCustomerPhone, onOpenTelephony }) {
  const { startCall } = useCall()

  const launchAiCall = () => {
    startCall(
      {
        name: 'Shivam Singh',
        initials: 'SS',
        phone: '63611 67314',
        detail: '+91 63611 67314 · Tranquo Massager Chair',
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
        phone: '63611 67314',
        detail: '+91 63611 67314 · WebRTC Softphone',
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

      {/* Customer Phone Receiver */}
      <button
        onClick={() => onOpenCustomerPhone?.()}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '5px 12px',
          borderRadius: '99px',
          background: '#f0fdf4',
          border: '1.5px solid #86efac',
          fontSize: '12px',
          fontWeight: 700,
          color: '#15803d',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          boxShadow: '0 2px 6px rgba(34, 197, 94, 0.15)',
        }}
        title="Open Shivam's Mobile Handset (+91 63611 67314) to call Helpline +91 80 9578 1284 or receive calls"
      >
        <Smartphone size={14} color="#16a34a" /> 📱 Shivam (+91 63611 67314)
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
        title="Live AI-to-Human Voice Call with Vapi WebRTC & Live Waveform"
      >
        <Bot size={14} color="#059669" /> 🤖 AI Call Shivam
      </button>

      {/* 1-Click Human-to-Human WebRTC Calling */}
      <button
        onClick={launchHumanCall}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '5px 12px',
          borderRadius: '99px',
          background: '#eff6ff',
          border: '1px solid #bfdbfe',
          fontSize: '12px',
          fontWeight: 700,
          color: '#1e40af',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
        }}
        title="Dial Shivam via WebRTC Softphone"
      >
        <Users size={14} color="#2563eb" /> 👥 Agent Call Shivam
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
        onClick={() => onOpenConsent?.({ name: 'Shivam Singh', phone: '63611 67314', callType: 'Call centre', initialMode: 'wa' })}
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
