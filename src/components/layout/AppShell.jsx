import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { CallPanel } from '../ui/CallPanel'

export function AppShell() {
  const [navOpen, setNavOpen] = useState(false)
  const { pathname } = useLocation()
  useEffect(() => {
    document.querySelector('.page')?.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="shell">
      <Sidebar open={navOpen} onNavigate={() => setNavOpen(false)} />
      {navOpen && <div className="overlay" style={{ zIndex: 600 }} onClick={() => setNavOpen(false)} aria-hidden="true" />}
      <div className="main">
        <TopBar onToggleSidebar={() => setNavOpen((o) => !o)} />
        <main className="page">
          <Outlet />
        </main>
      </div>
      <CallPanel />
    </div>
  )
}
