import { useState } from 'react'
import { Calendar, Check, CheckCircle2, MessageSquare, Mic, Send, ShieldCheck, ThumbsUp, X } from 'lucide-react'
import { useToast } from '../../context/ToastContext'
import { useCall } from '../../context/CallContext'

const SCRIPTS = {
  English: 'Can we record this? Only for your service and follow-up. You can say no, or ask us to delete it any time.',
  हिंदी: 'क्या हम इसे रिकॉर्ड कर सकते हैं? केवल आपकी सेवा और फॉलो-अप के लिए। आप मना कर सकते हैं या कभी भी हटाने को कह सकते हैं।',
  ಕನ್ನಡ: 'ಇದನ್ನು ರೆಕಾರ್ಡ್ ಮಾಡಬಹುದೇ? ನಿಮ್ಮ ಸೇವೆ ಮತ್ತು ಫಾಲೋ-ಅಪ್‌ಗಾಗಿ ಮಾತ್ರ. ನೀವು ಬೇಡವೆನ್ನಬಹುದು ಅಥವಾ ಯಾವುದೇ ಸಮಯದಲ್ಲಿ ಅಳಿಸಲು ಕೇಳಬಹುದು.',
}

export function PhoneCallConsentModal({ contact = { name: 'Faizan A.', phone: '98450 61245' }, onClose, onCallStarted }) {
  const [lang, setLang] = useState('English')
  const [mode, setMode] = useState('voice') // 'wa' | 'voice'
  const [phone, setPhone] = useState(contact.phone?.replace('+91', '').trim() || '98450 61245')
  const [under18, setUnder18] = useState(false)
  const [offers, setOffers] = useState(false)
  const [sent, setSent] = useState(false)
  const toast = useToast()
  const { startCall } = useCall()

  const handleSendWa = () => {
    setSent(true)
    toast(`Consent request sent on WhatsApp${under18 ? ' to parent' : ''}. Waiting for tap.`)
  }

  const handleAgree = (method) => {
    toast(`Consent CNS-2026-10492: recording on · ${method === 'wa' ? 'WhatsApp' : 'said out loud'}`)
    onClose()
    startCall({ name: contact.name, initials: contact.name.slice(0, 2).toUpperCase(), detail: contact.phone }, 'outgoing')
    onCallStarted?.()
  }

  const handleRefuse = () => {
    toast('Not recording. Carry on.')
    onClose()
    startCall({ name: contact.name, initials: contact.name.slice(0, 2).toUpperCase(), detail: contact.phone }, 'outgoing')
    onCallStarted?.()
  }

  return (
    <div
      className="overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{ zIndex: 600, padding: '16px' }}
      role="dialog"
      aria-modal="true"
      aria-label="Ask before you record"
    >
      <div
        style={{
          background: '#fff',
          borderRadius: '20px',
          width: '100%',
          maxWidth: '520px',
          padding: '20px 22px 24px',
          position: 'relative',
          boxShadow: '0 20px 30px rgba(0,0,0,0.15)',
          animation: 'scaleIn 0.2s ease-out',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: '#e1f5ee',
                color: '#0f6e56',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ShieldCheck size={20} />
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>Ask before you record</div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>Phone call · {contact.name}</div>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              background: '#f0f0f3',
              border: 'none',
              borderRadius: '50%',
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#8e8e93',
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Step 1: Say this */}
        <div style={{ marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>
            <span
              style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                background: '#0f172a',
                color: '#fff',
                fontSize: '10.5px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              1
            </span>
            Say this · right after hello
          </div>

          <div
            style={{
              marginTop: '8px',
              background: '#f1f8f5',
              borderLeft: '3px solid #0f6e56',
              borderRadius: '4px',
              padding: '12px 14px',
            }}
          >
            {/* Language Selection */}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
              {['ಕನ್ನಡ', 'हिंदी', 'English'].map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  style={{
                    padding: '3px 10px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer',
                    background: lang === l ? '#0f6e56' : '#fff',
                    color: lang === l ? '#fff' : '#0f172a',
                    boxShadow: lang === l ? 'none' : '0 1px 2px rgba(0,0,0,0.05)',
                  }}
                >
                  {l}
                </button>
              ))}
              <span style={{ fontSize: '11.5px', color: '#64748b', alignSelf: 'center', marginLeft: '4px' }}>+20</span>
            </div>

            <div style={{ fontSize: '13.5px', lineHeight: 1.5, color: '#0f172a' }}>
              {SCRIPTS[lang] || SCRIPTS.English}
            </div>
          </div>
        </div>

        {/* Step 2: Get their yes */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 800, color: '#0f172a', marginBottom: '10px' }}>
            <span
              style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                background: '#0f172a',
                color: '#fff',
                fontSize: '10.5px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              2
            </span>
            Get their yes
          </div>

          {/* Mode Switch */}
          <div style={{ display: 'flex', background: '#f2f2f7', borderRadius: '8px', padding: '2px', marginBottom: '12px' }}>
            <button
              onClick={() => setMode('wa')}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '6px',
                borderRadius: '6px',
                fontSize: '12.5px',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                background: mode === 'wa' ? '#fff' : 'none',
                color: mode === 'wa' ? '#1a1a1a' : '#8e8e93',
                boxShadow: mode === 'wa' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              }}
            >
              <MessageSquare size={13} /> On WhatsApp
            </button>
            <button
              onClick={() => setMode('voice')}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '6px',
                borderRadius: '6px',
                fontSize: '12.5px',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                background: mode === 'voice' ? '#fff' : 'none',
                color: mode === 'voice' ? '#1a1a1a' : '#8e8e93',
                boxShadow: mode === 'voice' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              }}
            >
              <Mic size={13} /> Said out loud
            </button>
          </div>

          {mode === 'voice' ? (
            <div>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '6px' }}>
                <button
                  onClick={() => handleAgree('voice')}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '12px 8px',
                    borderRadius: '12px',
                    background: '#0f6e56',
                    color: '#fff',
                    border: 'none',
                    fontSize: '13.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  <Check size={16} /> {under18 ? 'Parent said yes' : 'They said yes'}
                </button>
                <button
                  onClick={handleRefuse}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '12px 8px',
                    borderRadius: '12px',
                    background: '#fff',
                    color: '#0f172a',
                    border: '1px solid #cfd6e4',
                    fontSize: '13.5px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  <X size={16} /> They said no
                </button>
              </div>
              <div style={{ fontSize: '11.5px', color: '#64748b', marginBottom: '10px' }}>
                Their spoken yes is saved as a short clip, as proof.
              </div>

              {/* Offers on WhatsApp toggle */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '9px 12px',
                  marginBottom: '6px',
                }}
              >
                <div>
                  <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#1a1a1a' }}>Offers on WhatsApp too?</div>
                  <div style={{ fontSize: '11.5px', color: '#64748b' }}>Ask separately. Off unless they say yes.</div>
                </div>
                <label style={{ position: 'relative', display: 'inline-block', width: '36px', height: '20px' }}>
                  <input
                    type="checkbox"
                    checked={offers}
                    onChange={(e) => setOffers(e.target.checked)}
                    style={{ opacity: 0, width: 0, height: 0 }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      cursor: 'pointer',
                      inset: 0,
                      background: offers ? '#0f6e56' : '#cbd5e1',
                      borderRadius: '20px',
                      transition: '.2s',
                    }}
                  >
                    <span
                      style={{
                        position: 'absolute',
                        height: '14px',
                        width: '14px',
                        left: offers ? '19px' : '3px',
                        bottom: '3px',
                        background: '#fff',
                        borderRadius: '50%',
                        transition: '.2s',
                      }}
                    />
                  </span>
                </label>
              </div>

              {/* Under 18 toggle */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '9px 12px',
                }}
              >
                <div>
                  <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#1a1a1a' }}>Under 18?</div>
                  <div style={{ fontSize: '11.5px', color: '#64748b' }}>A parent must say yes.</div>
                </div>
                <label style={{ position: 'relative', display: 'inline-block', width: '36px', height: '20px' }}>
                  <input
                    type="checkbox"
                    checked={under18}
                    onChange={(e) => setUnder18(e.target.checked)}
                    style={{ opacity: 0, width: 0, height: 0 }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      cursor: 'pointer',
                      inset: 0,
                      background: under18 ? '#0f6e56' : '#cbd5e1',
                      borderRadius: '20px',
                      transition: '.2s',
                    }}
                  >
                    <span
                      style={{
                        position: 'absolute',
                        height: '14px',
                        width: '14px',
                        left: under18 ? '19px' : '3px',
                        bottom: '3px',
                        background: '#fff',
                        borderRadius: '50%',
                        transition: '.2s',
                      }}
                    />
                  </span>
                </label>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <span
                  style={{
                    background: '#f8fafc',
                    border: '1.5px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '9px 12px',
                    fontSize: '13.5px',
                    fontWeight: 700,
                    color: '#64748b',
                  }}
                >
                  +91
                </span>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{
                    flex: 1,
                    background: '#fff',
                    border: '1.5px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '9px 12px',
                    fontSize: '13.5px',
                    fontWeight: 600,
                    outline: 'none',
                  }}
                />
                <button
                  onClick={handleSendWa}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: '#0f6e56',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '9px 16px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  <Send size={13} /> {sent ? 'Sent ✓' : 'Send'}
                </button>
              </div>
              <div style={{ fontSize: '11.5px', color: '#64748b', marginBottom: '12px' }}>
                They get the same words, and tap Yes or No. Offers are asked separately in the message.
              </div>

              {/* Under 18 toggle */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '9px 12px',
                }}
              >
                <div>
                  <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#1a1a1a' }}>Under 18?</div>
                  <div style={{ fontSize: '11.5px', color: '#64748b' }}>Send it to a parent's number instead.</div>
                </div>
                <label style={{ position: 'relative', display: 'inline-block', width: '36px', height: '20px' }}>
                  <input
                    type="checkbox"
                    checked={under18}
                    onChange={(e) => setUnder18(e.target.checked)}
                    style={{ opacity: 0, width: 0, height: 0 }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      cursor: 'pointer',
                      inset: 0,
                      background: under18 ? '#0f6e56' : '#cbd5e1',
                      borderRadius: '20px',
                      transition: '.2s',
                    }}
                  >
                    <span
                      style={{
                        position: 'absolute',
                        height: '14px',
                        width: '14px',
                        left: under18 ? '19px' : '3px',
                        bottom: '3px',
                        background: '#fff',
                        borderRadius: '50%',
                        transition: '.2s',
                      }}
                    />
                  </span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ fontSize: '11.5px', color: '#64748b', borderTop: '1px solid #f1f3f8', paddingTop: '10px' }}>
          A yes gives a Consent ID tied to this call. A no is logged too, and you carry on without recording.
        </div>
      </div>
    </div>
  )
}
