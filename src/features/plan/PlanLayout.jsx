import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import './Plan.css'

export function PlanLayout() {
  const [today] = useState(() => new Date().toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' }))

  return (
    <div>
      <div className="plan-banner">
        <div>
          <span>Today's calling plan</span>
          <h1>Planner</h1>
        </div>
        <span className="plan-banner__date">{today}</span>
      </div>
      <Outlet />
    </div>
  )
}
