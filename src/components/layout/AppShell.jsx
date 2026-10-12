import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { NotificationsOverlay } from './NotificationsOverlay'
import { RankModal } from './RankModal'
import { ScoreModal } from './ScoreModal'
import { AvatarView } from './AvatarView'
import { SettingsView } from './SettingsView'
import { PhoneCallConsentModal } from './PhoneCallConsentModal'
import { CallWrapupModal } from './CallWrapupModal'
import { DpdpSafeModal } from './DpdpSafeModal'
import { DemoBar } from './DemoBar'
import { CustomerPhoneModal } from './CustomerPhoneModal'
import { TelephonySettingsModal } from './TelephonySettingsModal'
import { CallPanel } from '../ui/CallPanel'
import { PhoneIncoming } from 'lucide-react'
import { phoneCallService } from '../../utils/phoneCallService'
import { callAudio } from '../../utils/callAudioEngine'
import { useCall } from '../../context/CallContext'

export function AppShell() {
  const { startCall, wrapup, closeWrapup, consentContact, setConsentContact } = useCall()
  const [navOpen, setNavOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [scoreOpen, setScoreOpen] = useState(false)
  const [rankOpen, setRankOpen] = useState(false)
  const [avatarOpen, setAvatarOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [dpdpSafeOpen, setDpdpSafeOpen] = useState(false)
  const [telephonyOpen, setTelephonyOpen] = useState(false)
  const [avatarEmoji, setAvatarEmoji] = useState('🦸‍♂️')
  const [hasUnreadNotifs, setHasUnreadNotifs] = useState(true)

  // Customer Phone receiver line (auto-opens if URL has customerPhone param)
  const [customerPhoneOpen, setCustomerPhoneOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      return Boolean(params.get('customerPhone') || params.get('phone') || params.get('join') || params.get('room'))
    }
    return false
  })
  const [initialCustomerPhone] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const p = params.get('customerPhone') || params.get('phone')
      if (p) return p.startsWith('+') ? p : `+91 ${p}`
    }
    return '+91 93805 41855'
  })

  const { pathname } = useLocation()

  useEffect(() => {
    document.querySelector('.page')?.scrollTo(0, 0)
    setNotifOpen(false)
    setAvatarOpen(false)
    setSettingsOpen(false)
  }, [pathname])

  const [incomingTransfer, setIncomingTransfer] = useState(null)
  const [incomingCustomerCall, setIncomingCustomerCall] = useState(null)

  // Connect agent desk to the helpline channel on mount so customer transfers & calls are heard
  useEffect(() => {
    phoneCallService.initAgentDeskChannel()

    if (customerPhoneOpen) {
      phoneCallService.registerCustomerPhone(initialCustomerPhone)
    }

    const handleTransfer = (data) => {
      setIncomingTransfer(data)
      callAudio.startRingback()
    }

    phoneCallService.on('incomingIvrTransfer', handleTransfer)

    return () => {
      phoneCallService.off('incomingIvrTransfer', handleTransfer)
    }
  }, [customerPhoneOpen, initialCustomerPhone])

  const handleAcceptTransfer = () => {
    if (!incomingTransfer) return
    callAudio.stopRingback()
    phoneCallService.acceptIvrTransfer(incomingTransfer.customerPhone)
    startCall(
      {
        name: incomingTransfer.customerName || 'Shivam Singh',
        initials: 'SS',
        phone: incomingTransfer.customerPhone || '93805 41855',
        detail: `${incomingTransfer.customerPhone || '+91 93805 41855'} · Transferred from IVR`,
        callType: 'Phone call',
        callMode: 'human-to-human',
      },
      'incoming',
      { mode: 'human-to-human', openConsent: false },
    )
    setIncomingTransfer(null)
  }

  const handleDeclineTransfer = () => {
    callAudio.stopRingback()
    setIncomingTransfer(null)
  }

  const openNotifications = () => {
    setNotifOpen((prev) => !prev)
    setAvatarOpen(false)
    setSettingsOpen(false)
    setHasUnreadNotifs(false)
  }

  return (
    <div className="shell">
      <Sidebar open={navOpen} onNavigate={() => setNavOpen(false)} />
      {navOpen && <div className="overlay" style={{ zIndex: 600 }} onClick={() => setNavOpen(false)} aria-hidden="true" />}
      <div className="main">
        <TopBar
          onToggleSidebar={() => setNavOpen((o) => !o)}
          onOpenNotifications={openNotifications}
          onOpenScore={() => setScoreOpen(true)}
          onOpenRank={() => setRankOpen(true)}
          onOpenAvatar={() => {
            setAvatarOpen(true)
            setNotifOpen(false)
            setSettingsOpen(false)
          }}
          onOpenSettings={() => {
            setSettingsOpen(true)
            setNotifOpen(false)
            setAvatarOpen(false)
          }}
          hasUnreadNotifs={hasUnreadNotifs}
          avatarEmoji={avatarEmoji}
        />
        <main className="page" style={{ position: 'relative' }}>
          {notifOpen && <NotificationsOverlay onClose={() => setNotifOpen(false)} />}
          {avatarOpen && (
            <AvatarView
              onClose={() => setAvatarOpen(false)}
              onSelectPersona={(_, emoji) => setAvatarEmoji(emoji)}
            />
          )}
          {settingsOpen && <SettingsView onClose={() => setSettingsOpen(false)} />}
          {!pathname.startsWith('/plan') && <CallPanel />}
          <Outlet />
        </main>
      </div>
      {scoreOpen && <ScoreModal onClose={() => setScoreOpen(false)} />}
      {rankOpen && <RankModal onClose={() => setRankOpen(false)} />}
      {consentContact && (
        <PhoneCallConsentModal
          contact={consentContact}
          callType={consentContact.callType}
          initialMode={consentContact.initialMode}
          onClose={() => setConsentContact(null)}
        />
      )}
      {wrapup && (
        <CallWrapupModal
          contact={wrapup.contact}
          duration={wrapup.duration}
          onClose={closeWrapup}
        />
      )}
      {dpdpSafeOpen && <DpdpSafeModal onClose={() => setDpdpSafeOpen(false)} />}
      {customerPhoneOpen && (
        <CustomerPhoneModal
          isOpen={customerPhoneOpen}
          onClose={() => {
            setCustomerPhoneOpen(false)
            setIncomingCustomerCall(null)
          }}
          initialPhone={initialCustomerPhone}
          initialCallData={incomingCustomerCall}
        />
      )}
      {telephonyOpen && (
        <TelephonySettingsModal
          isOpen={telephonyOpen}
          onClose={() => setTelephonyOpen(false)}
        />
      )}
      {/* Inbound Call from IVR Transfer Banner */}
      {incomingTransfer && (
        <aside
          style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 2000,
            background: 'linear-gradient(135deg, #064e3b, #0f172a)',
            color: '#fff',
            padding: '14px 22px',
            borderRadius: '24px',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), 0 0 0 2px #22c55e',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            animation: 'pulse 1.5s infinite',
            maxWidth: '92vw',
          }}
          role="alert"
          aria-live="assertive"
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: '#22c55e',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(34, 197, 94, 0.6)',
              flexShrink: 0,
            }}
          >
            <PhoneIncoming size={22} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#4ade80', letterSpacing: '0.05em' }}>
              📞 INCOMING CALL · +91 80 9578 1284
            </div>
            <div style={{ fontSize: '16px', fontWeight: 800 }}>
              {incomingTransfer.customerName || 'Shivam Singh'} ({incomingTransfer.customerPhone || '+91 93805 41855'})
            </div>
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>
              Direct Caller · Tap Accept Call to connect live two-way audio
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', marginLeft: '12px', flexShrink: 0 }}>
            <button
              onClick={handleAcceptTransfer}
              style={{
                padding: '9px 18px',
                background: '#22c55e',
                color: '#fff',
                borderRadius: '99px',
                fontWeight: 800,
                fontSize: '13px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(34, 197, 94, 0.4)',
              }}
            >
              Accept Call
            </button>
            <button
              onClick={handleDeclineTransfer}
              style={{
                padding: '9px 14px',
                background: 'rgba(255, 255, 255, 0.12)',
                color: '#cbd5e1',
                borderRadius: '99px',
                fontSize: '13px',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Decline
            </button>
          </div>
        </aside>
      )}

      <DemoBar onOpenTelephony={() => setTelephonyOpen(true)} />
    </div>
  )
}
