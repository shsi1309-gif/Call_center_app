import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useCall } from '../../context/CallContext'
import { CallPanel } from '../../components/ui/CallPanel'
import './Plan.css'

export function PlanLayout() {
  const { call } = useCall()
  const [today] = useState(() => {
    const d = new Date()
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]}`
  })

  return (
    <div>
      <div className="plan-banner">
        <div>
          <span>Today's calling plan</span>
          <h1>Planner</h1>
        </div>
        <span className="plan-banner__date">{today}</span>
      </div>
      {call ? <CallPanel /> : <Outlet />}
    </div>
  )
}
