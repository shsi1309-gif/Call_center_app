import { useEffect, useRef, useState } from 'react'
import { Bell, Menu, Settings, UserCircle, LogOut, PanelLeft } from 'lucide-react'
import { NOTIFICATIONS } from '../../data/notifications'
import { useToast } from '../../context/ToastContext'
import './TopBar.css'

export function TopBar({ onToggleSidebar }) {
  const [open, setOpen] = useState('none')
  const ref = useRef(null)
  const toast = useToast()
  useEffect(() => {
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen('none')
    }
    const onKey = (e) => e.key === 'Escape' && setOpen('none')
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [])
  const toggle = (p) => setOpen((cur) => (cur === p ? 'none' : p))
  const menuAction = (label) => {
    setOpen('none')
    toast(`${label} is not part of this demo`)
  }

  return (
    <header className="topbar">
      <div className="topbar__brand">
        <button className="topbar__sidebar-btn" onClick={onToggleSidebar} aria-label="Toggle navigation">
          <PanelLeft size={18} />
        </button>
        <span className="topbar__logo">OG</span>
        <span className="topbar__name">On-Ground.ai</span>
      </div>
      <div className="topbar__right" ref={ref}>
        <button className="bell" onClick={() => toggle('bell')} aria-label="Notifications" aria-expanded={open === 'bell'}>
          <Bell size={17} />
          <span className="bell__dot" />
        </button>
        <div className="rank-pill" title="Your rank within RT Nagar: #3">
          <span className="rank-pill__ring">76</span>
          <span>⭐#3</span>
        </div>
        <button className="ar-badge" onClick={() => toggle('menu')} aria-label="Open profile menu">
          <span>🦸‍♂️</span>
          <small>AR</small>
        </button>
        <button className="hamburger" onClick={() => toggle('menu')} aria-label="Menu" aria-expanded={open === 'menu'}>
          <Menu size={16} />
        </button>

        {open === 'bell' && (
          <div className="popover popover--bell" role="menu" aria-label="Notifications">
            <div className="popover__title">Notifications</div>
            {NOTIFICATIONS.map((n) => (
              <div className="popover__row" key={n.id} role="menuitem">
                <span>{n.text}</span>
                <small>{n.time}</small>
              </div>
            ))}
          </div>
        )}
        {open === 'menu' && (
          <div className="popover" role="menu" aria-label="Profile menu">
            <div className="popover__head">
              <span className="popover__av">🦸‍♂️</span>
              <div>
                <strong>Arvind Rajan</strong>
                <small>Koramangala · The Sleep Company</small>
              </div>
            </div>
            <button className="popover__item" role="menuitem" onClick={() => menuAction('Avatar')}>
              <UserCircle size={16} />
              Avatar
            </button>
            <button className="popover__item" role="menuitem" onClick={() => menuAction('Settings')}>
              <Settings size={16} />
              Settings
            </button>
            <button className="popover__item popover__item--danger" role="menuitem" onClick={() => menuAction('Logout')}>
              <LogOut size={16} />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
