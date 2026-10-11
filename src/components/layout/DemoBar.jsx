import { Bot, Phone, Radio, Shield, Users } from 'lucide-react'
import { useCall } from '../../context/CallContext'

export function DemoBar({ onOpenConsent, onOpenDpdpSafe, onOpenRoomCall }) {
  const { startCall } = useCall()

  const launchAiCall = () => {
    startCall(
      {
        name: 'Faizan A.',
        initials: 'FA',
        phone: '98450 61245',
        detail: '+91 98450 61245 · Tranquo Massager Chair',
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
        name: 'Faizan A. (Customer)',
        initials: 'FA',
        phone: '98450 61245',
        detail: '+91 98450 61245 · WebRTC Peer Audio',
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
          background: 'linear-gradient(135deg, #f59e0b, #d97706)',
          color: '#fff',
          fontSize: '10.5px',
          fontWeight: 800,
          padding: '3px 8px',
          borderRadius: '99px',
          letterSpacing: '0.04em',
          whiteSpace: 'nowrap',
        }}
      >
        CALL ENGINE
      </span>

      {/* Real Multi-Device Two-Way Calling Room */}
      <button
        onClick={() => onOpenRoomCall?.()}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '5px 12px',
          borderRadius: '99px',
          background: '#faf5ff',
          border: '1.5px solid #d8b4fe',
          fontSize: '12px',
          fontWeight: 700,
          color: '#6b21a8',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          boxShadow: '0 2px 6px rgba(147, 51, 234, 0.15)',
        }}
        title="Live audio call between 2 real devices (phones, tabs, or laptops)"
      >
        <Radio size={14} color="#9333ea" /> 📱 Multi-Device Call
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
        title="Live AI-to-Human Voice Call with Speech Synthesis & Live Waveform"
      >
        <Bot size={14} color="#059669" /> AI Call
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
        title="Live Human-to-Human WebRTC VoIP with Mic Audio Visualizer"
      >
        <Users size={14} color="#2563eb" /> Single-Device VoIP
      </button>

      {/* Consent Modal Trigger */}
      <button
        onClick={() => onOpenConsent?.({ name: 'Faizan A.', phone: '98450 61245', callType: 'Call centre', initialMode: 'wa' })}
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
        <Shield size={13} />
      </button>
    </div>
  )
}
