import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { NotificationsOverlay } from './NotificationsOverlay'
import { RankModal } from './RankModal'
import { AvatarView } from './AvatarView'
import { SettingsView } from './SettingsView'
import { PhoneCallConsentModal } from './PhoneCallConsentModal'
import { CallWrapupModal } from './CallWrapupModal'
import { DemoBar } from './DemoBar'
import { CallPanel } from '../ui/CallPanel'
import { useCall } from '../../context/CallContext'

export function AppShell() {
  const { wrapup, closeWrapup } = useCall()
  const [navOpen, setNavOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [rankOpen, setRankOpen] = useState(false)
  const [avatarOpen, setAvatarOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [consentContact, setConsentContact] = useState(null)
  const [avatarEmoji, setAvatarEmoji] = useState('🦸‍♂️')
  const [hasUnreadNotifs, setHasUnreadNotifs] = useState(true)
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
          <Outlet />
        </main>
      </div>
      {rankOpen && <RankModal onClose={() => setRankOpen(false)} />}
      {consentContact && (
        <PhoneCallConsentModal
          contact={consentContact}
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
      <CallPanel />
      <DemoBar onOpenConsent={(c) => setConsentContact(c)} />
    </div>
  )
}
