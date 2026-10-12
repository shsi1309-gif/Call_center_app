import { useState } from 'react'
import { Check, Phone, Save, ShieldCheck, X } from 'lucide-react'
import { getTelephonyConfig, saveTelephonyConfig } from '../../utils/telephonyConfig'
import { useToast } from '../../context/ToastContext'

export function TelephonySettingsModal({ isOpen, onClose }) {
  const toast = useToast()
  const [config, setConfig] = useState(getTelephonyConfig())
  const [saved, setSaved] = useState(false)

  if (!isOpen) return null

  const handleSave = (e) => {
    e.preventDefault()
    saveTelephonyConfig(config)
    setSaved(true)
    toast('Telephony & Vapi configuration saved!')
    setTimeout(() => {
      setSaved(false)
      onClose()
    }, 1200)
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(4px)',
        zIndex: 1100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.15s ease-out',
      }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Telephony & Voice AI Settings"
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '480px',
          padding: '24px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.25)',
          position: 'relative',
          animation: 'modalSlideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: '#f1f5f9',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#64748b',
          }}
        >
          <X size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: '#ecfdf5',
              color: '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Phone size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: '#0f172a' }}>
              Telephony & AI Voice Settings
            </h2>
            <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0 0' }}>
              Vapi Voice Engine & Outbound Call Centre Gateway
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Vapi Public Key */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
              Vapi Public Key (Web SDK)
            </label>
            <input
              type="text"
              value={config.vapiPublicKey}
              onChange={(e) => setConfig({ ...config, vapiPublicKey: e.target.value })}
              placeholder="e.g. affb096d-8be5-4554-a320-f2920f64e166"
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '13px',
                boxSizing: 'border-box',
                fontFamily: 'monospace',
              }}
            />
          </div>

          {/* Vapi Assistant ID */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
              Vapi Assistant ID
            </label>
            <input
              type="text"
              value={config.vapiAssistantId}
              onChange={(e) => setConfig({ ...config, vapiAssistantId: e.target.value })}
              placeholder="e.g. 94354921-6e0a-4533-a7b0-68acfbadf50f"
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '13px',
                boxSizing: 'border-box',
                fontFamily: 'monospace',
              }}
            />
          </div>

          {/* Vapi Private Key */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
              Vapi Private API Key (Outbound PSTN Phone Calls)
            </label>
            <input
              type="password"
              value={config.vapiPrivateKey}
              onChange={(e) => setConfig({ ...config, vapiPrivateKey: e.target.value })}
              placeholder="e.g. 904b623d-6f8c-46ed-a416-03d6b7f6e849"
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '13px',
                boxSizing: 'border-box',
                fontFamily: 'monospace',
              }}
            />
          </div>

          {/* Call Centre Number */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
              Call Centre Caller ID Phone Number
            </label>
            <input
              type="text"
              value={config.callCentreNumber}
              onChange={(e) => setConfig({ ...config, callCentreNumber: e.target.value })}
              placeholder="+91 80 6900 1234"
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '13px',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div
            style={{
              padding: '10px 14px',
              borderRadius: '10px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              fontSize: '12px',
              color: '#64748b',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <ShieldCheck size={16} color="#059669" />
            <span>Credentials are securely stored locally and used for live calling.</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 16px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                background: '#fff',
                fontSize: '13px',
                fontWeight: 600,
                color: '#475569',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: '10px 20px',
                borderRadius: '10px',
                border: 'none',
                background: '#059669',
                fontSize: '13px',
                fontWeight: 700,
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              {saved ? <Check size={16} /> : <Save size={16} />}
              <span>{saved ? 'Saved!' : 'Save Configuration'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
