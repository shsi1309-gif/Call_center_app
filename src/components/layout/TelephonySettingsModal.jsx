import { useState } from 'react'
import { Check, ExternalLink, Phone, PhoneCall, Radio, Save, ShieldCheck, Sparkles, X } from 'lucide-react'
import { getTelephonyConfig, saveTelephonyConfig } from '../../utils/telephonyConfig'
import { exotelService } from '../../utils/exotelService'
import { useToast } from '../../context/ToastContext'

export function TelephonySettingsModal({ isOpen, onClose }) {
  const toast = useToast()
  const [activeTab, setActiveTab] = useState('exotel') // 'exotel' | 'vapi'
  const [config, setConfig] = useState(getTelephonyConfig())
  const [saved, setSaved] = useState(false)
  const [testingExotel, setTestingExotel] = useState(false)

  if (!isOpen) return null

  const handleSave = (e) => {
    if (e) e.preventDefault()
    saveTelephonyConfig(config)
    setSaved(true)
    toast('Telephony configuration saved successfully!')
    setTimeout(() => {
      setSaved(false)
    }, 1200)
  }

  const handleTestExotelCall = async () => {
    saveTelephonyConfig(config)
    if (!config.exotelAccountSid || !config.exotelApiKey || !config.exotelApiToken || !config.exotelCallerId) {
      toast('Please enter your Exotel Account SID, API Key, API Token, and ExoPhone first.')
      return
    }

    setTestingExotel(true)
    toast('Triggering test call to +91 93805 41855 via Exotel...')

    try {
      const res = await exotelService.callRealMobilePhone('9380541855')
      if (res.success) {
        toast('Success! Outbound call queued on Exotel. Your phone should ring shortly!')
      } else {
        toast(res.error || 'Exotel call failed. Please check credentials.')
      }
    } catch (err) {
      toast('Error contacting Exotel service: ' + err.message)
    } finally {
      setTestingExotel(false)
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.55)',
        backdropFilter: 'blur(5px)',
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
          maxWidth: '520px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '24px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.3)',
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

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
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
              Telephony & Gateway Settings
            </h2>
            <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0 0' }}>
              Configure Indian carrier calling (Exotel) and AI voice synthesis (Vapi)
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div
          style={{
            display: 'flex',
            background: '#f1f5f9',
            padding: '4px',
            borderRadius: '12px',
            marginBottom: '20px',
            gap: '4px',
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab('exotel')}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'exotel' ? '#ffffff' : 'transparent',
              color: activeTab === 'exotel' ? '#0f172a' : '#64748b',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              boxShadow: activeTab === 'exotel' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <Radio size={14} color={activeTab === 'exotel' ? '#059669' : '#64748b'} />
            Exotel (India Calling)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('vapi')}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'vapi' ? '#ffffff' : 'transparent',
              color: activeTab === 'vapi' ? '#0f172a' : '#64748b',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              boxShadow: activeTab === 'vapi' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <Sparkles size={14} color={activeTab === 'vapi' ? '#3b82f6' : '#64748b'} />
            Vapi (AI Voice Engine)
          </button>
        </div>

        {/* EXOTEL TAB */}
        {activeTab === 'exotel' && (
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div
              style={{
                padding: '12px 14px',
                borderRadius: '12px',
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
              }}
            >
              <div style={{ color: '#16a34a', marginTop: '2px' }}>
                <Sparkles size={18} />
              </div>
              <div style={{ fontSize: '12px', color: '#166534', lineHeight: 1.4 }}>
                <strong>Exotel Free Trial:</strong> Provides <strong>₹1,000 free calling credits</strong> valid for 15 days across Indian cellular networks. No credit card required.
                <div style={{ marginTop: '4px' }}>
                  <a
                    href="https://my.exotel.com/"
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: '#047857', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                  >
                    Create Free Account at my.exotel.com <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            </div>

            {/* Account SID */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                Exotel Account SID
              </label>
              <input
                type="text"
                value={config.exotelAccountSid || ''}
                onChange={(e) => setConfig({ ...config, exotelAccountSid: e.target.value })}
                placeholder="e.g. your_company_sid"
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

            {/* API Key */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                Exotel API Key
              </label>
              <input
                type="text"
                value={config.exotelApiKey || ''}
                onChange={(e) => setConfig({ ...config, exotelApiKey: e.target.value })}
                placeholder="Find in Exotel Dashboard > Settings > API Settings"
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

            {/* API Token */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                Exotel API Token
              </label>
              <input
                type="password"
                value={config.exotelApiToken || ''}
                onChange={(e) => setConfig({ ...config, exotelApiToken: e.target.value })}
                placeholder="Find in Exotel Dashboard > Settings > API Settings"
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

            {/* ExoPhone Caller ID */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                Virtual ExoPhone (Caller ID Number)
              </label>
              <input
                type="text"
                value={config.exotelCallerId || ''}
                onChange={(e) => setConfig({ ...config, exotelCallerId: e.target.value })}
                placeholder="e.g. 0804719xxxx (Found under ExoPhones in dashboard)"
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

            {/* IVR Flow / App ID */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                Exotel Applet / Call Flow ID (Optional)
              </label>
              <input
                type="text"
                value={config.exotelAppId || ''}
                onChange={(e) => setConfig({ ...config, exotelAppId: e.target.value })}
                placeholder="e.g. 12345 (From App Bazaar > My Apps for custom IVR)"
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

            {/* Cluster Region */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                Exotel API Cluster
              </label>
              <select
                value={config.exotelCluster || 'api.exotel.com'}
                onChange={(e) => setConfig({ ...config, exotelCluster: e.target.value })}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '13px',
                  boxSizing: 'border-box',
                  background: '#fff',
                }}
              >
                <option value="api.exotel.com">Singapore Cluster (api.exotel.com - Standard)</option>
                <option value="api.in.exotel.com">Mumbai Cluster (api.in.exotel.com - India Low-Latency)</option>
              </select>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '10px',
                marginTop: '10px',
                flexWrap: 'wrap',
              }}
            >
              <button
                type="button"
                onClick={handleTestExotelCall}
                disabled={testingExotel}
                style={{
                  padding: '10px 16px',
                  borderRadius: '10px',
                  border: '1px solid #10b981',
                  background: '#f0fdf4',
                  fontSize: '13px',
                  fontWeight: 700,
                  color: '#059669',
                  cursor: testingExotel ? 'wait' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <PhoneCall size={16} />
                <span>{testingExotel ? 'Ringing...' : 'Test Call +91 93805 41855'}</span>
              </button>

              <div style={{ display: 'flex', gap: '8px' }}>
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
                  <span>{saved ? 'Saved!' : 'Save Exotel'}</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* VAPI TAB */}
        {activeTab === 'vapi' && (
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
                Vapi Private API Key
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
                placeholder="+91 80 9578 1284"
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
              <span>Credentials are saved locally in your browser session.</span>
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
                <span>{saved ? 'Saved!' : 'Save Vapi'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
