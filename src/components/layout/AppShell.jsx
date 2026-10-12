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
    return '+91 63611 67314'
  })

  const { pathname } = useLocation()

  useEffect(() => {
    document.querySelector('.page')?.scrollTo(0, 0)
    setNotifOpen(false)
    setAvatarOpen(false)
    setSettingsOpen(false)
  }, [pathname])

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
          onClose={() => setCustomerPhoneOpen(false)}
          initialPhone={initialCustomerPhone}
        />
      )}
      {telephonyOpen && (
        <TelephonySettingsModal
          isOpen={telephonyOpen}
          onClose={() => setTelephonyOpen(false)}
        />
      )}
      <DemoBar
        onOpenConsent={(c) => {
          startCall(
            {
              name: c.name || 'Shivam Singh',
              initials: (c.name || 'SS').slice(0, 2).toUpperCase(),
              detail: c.phone || '+91 63611 67314',
              phone: c.phone || '63611 67314',
              callType: c.callType || 'Call centre',
            },
            'outgoing',
          )
          setConsentContact(c)
        }}
        onOpenDpdpSafe={() => setDpdpSafeOpen(true)}
        onOpenCustomerPhone={() => setCustomerPhoneOpen(true)}
        onOpenTelephony={() => setTelephonyOpen(true)}
      />
    </div>
  )
}
