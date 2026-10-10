import { Phone, Shield } from 'lucide-react'
import { useCall } from '../../context/CallContext'

export function DemoBar({ onOpenConsent, onOpenDpdpSafe }) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: '12px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: '#fff',
        borderRadius: '99px',
        padding: '4px 10px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.12)',
        border: '1px solid #e5e5ea',
        zIndex: 350,
      }}
      role="toolbar"
      aria-label="Demo tools"
    >
      <span
        style={{
          background: '#f59e0b',
          color: '#fff',
          fontSize: '10.5px',
          fontWeight: 800,
          padding: '2px 8px',
          borderRadius: '99px',
          letterSpacing: '0.04em',
        }}
      >
        DEMO
      </span>
      <button
        onClick={() => onOpenConsent?.({ name: 'Faizan A.', phone: '98450 61245', callType: 'Call centre', initialMode: 'wa' })}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          padding: '4px 10px',
          borderRadius: '99px',
          background: '#f0f0f3',
          border: 'none',
          fontSize: '12px',
          fontWeight: 600,
          color: '#1a1a1a',
          cursor: 'pointer',
        }}
      >
        <Phone size={12} /> In-app call
      </button>
      <button
        onClick={() => onOpenConsent?.({ name: 'Faizan A.', phone: '98450 61245', callType: 'Phone call', initialMode: 'voice' })}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          padding: '4px 10px',
          borderRadius: '99px',
          background: '#f0f0f3',
          border: 'none',
          fontSize: '12px',
          fontWeight: 600,
          color: '#1a1a1a',
          cursor: 'pointer',
        }}
      >
        <Phone size={12} /> Phone call
      </button>
      <button
        onClick={() => onOpenDpdpSafe?.()}
        style={{
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          background: '#e1f5ee',
          color: '#0f6e56',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
        }}
        aria-label="DPDP safety rules"
        title="How this app keeps you DPDP-safe"
      >
        <Shield size={12} />
      </button>
    </div>
  )
}
