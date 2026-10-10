import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { DashboardPage } from './features/dashboard/DashboardPage'
import { PlanLayout } from './features/plan/PlanLayout'
import { CallsToMake } from './features/plan/CallsToMake'
import { Incoming } from './features/plan/Incoming'
import { Recent } from './features/plan/Recent'
import { CalendarPage } from './features/calendar/CalendarPage'
import { PulseHome } from './features/pulse/PulseHome'
import { PulseChannel } from './features/pulse/PulseChannel'

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<DashboardPage />} />
        <Route path="plan" element={<PlanLayout />}>
          <Route index element={<Navigate to="calls" replace />} />
          <Route path="calls" element={<CallsToMake />} />
          <Route path="incoming" element={<Incoming />} />
          <Route path="recent" element={<Recent />} />
        </Route>
        <Route path="calendar" element={<CalendarPage />} />
        <Route path="pulse" element={<PulseHome />} />
        <Route path="pulse/:channelId" element={<PulseChannel />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
