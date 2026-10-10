import { NavLink, useLocation } from 'react-router-dom'
import { Calendar, History, LayoutDashboard, MessagesSquare, Phone, PhoneCall, PhoneIncoming, PhoneOutgoing } from 'lucide-react'
import { useCall } from '../../context/CallContext'
import './Sidebar.css'

const PLAN_LINKS = [
  { to: '/plan/calls', label: 'Calls to make', icon: PhoneOutgoing },
  { to: '/plan/incoming', label: 'Incoming', icon: PhoneIncoming },
  { to: '/plan/recent', label: 'Recent', icon: History },
]

export function Sidebar({ open, onNavigate }) {
  const { pathname } = useLocation()
  const { startPractice } = useCall()
  const inPlan = pathname.startsWith('/plan')

  return (
    <nav className={`sidebar ${open ? 'is-open' : ''}`} aria-label="Primary">
      <div className="sidebar__brand">On-Ground.ai</div>

      <NavLink to="/" end onClick={onNavigate} className={({ isActive }) => `nav-item nav-item--dash ${isActive ? 'is-active' : ''}`}>
        <span className="nav-item__icon">
          <LayoutDashboard size={16} />
        </span>
        <span>Dashboard</span>
      </NavLink>

      <NavLink
        to="/plan/calls"
        onClick={onNavigate}
        className={`nav-item nav-item--plan ${inPlan ? 'is-active' : ''}`}
        aria-current={inPlan ? 'page' : undefined}
      >
        <span className="nav-item__icon">
          <Phone size={16} />
        </span>
        <span>Plan</span>
      </NavLink>
      <div className="subnav">
        {PLAN_LINKS.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} onClick={onNavigate} className={({ isActive }) => `subnav__item ${isActive ? 'is-active' : ''}`}>
            <Icon size={15} />
            <span>{label}</span>
          </NavLink>
        ))}
        <button
          className="subnav__item"
          onClick={() => {
            startPractice()
            onNavigate()
          }}
        >
          <PhoneCall size={15} />
          <span>Practise a call</span>
        </button>
      </div>

      <NavLink to="/calendar" onClick={onNavigate} className={({ isActive }) => `nav-item nav-item--cal ${isActive ? 'is-active' : ''}`}>
        <span className="nav-item__icon">
          <Calendar size={16} />
        </span>
        <span>Calendar</span>
      </NavLink>
      <NavLink
        to="/pulse"
        onClick={onNavigate}
        className={() => `nav-item nav-item--pulse ${pathname.startsWith('/pulse') ? 'is-active' : ''}`}
      >
        <span className="nav-item__icon">
          <MessagesSquare size={16} />
        </span>
        <span>Pulse</span>
      </NavLink>
    </nav>
  )
}
