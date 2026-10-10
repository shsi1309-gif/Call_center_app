import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { NotificationsOverlay } from './NotificationsOverlay'
import { CallPanel } from '../ui/CallPanel'

export function AppShell() {
  const [navOpen, setNavOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [hasUnreadNotifs, setHasUnreadNotifs] = useState(true)
  const { pathname } = useLocation()

  useEffect(() => {
    document.querySelector('.page')?.scrollTo(0, 0)
    setNotifOpen(false)
  }, [pathname])

  const openNotifications = () => {
    setNotifOpen((prev) => !prev)
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
          hasUnreadNotifs={hasUnreadNotifs}
        />
        <main className="page" style={{ position: 'relative' }}>
          {notifOpen && <NotificationsOverlay onClose={() => setNotifOpen(false)} />}
          <Outlet />
        </main>
      </div>
      <CallPanel />
    </div>
  )
}
