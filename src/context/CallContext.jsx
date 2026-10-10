import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useToast } from './ToastContext'
import { formatTimer } from '../utils/format'

const CallContext = createContext(null)

const PRACTICE_CONTACT = { name: 'Priya Iyer', initials: 'PI', detail: 'Practice call · billing dispute scenario' }

export function CallProvider({ children }) {
  const toast = useToast()
  const [call, setCall] = useState(null)
  const [seconds, setSeconds] = useState(0)
  const [muted, setMuted] = useState(false)
  const active = call?.phase === 'active'
  useEffect(() => {
    if (!active) return
    const id = window.setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => window.clearInterval(id)
  }, [active])
  const begin = useCallback((contact, kind, phase) => {
    setSeconds(0)
    setMuted(false)
    setCall({ contact, kind, phase })
  }, [])
  const startCall = useCallback(
    (contact, kind) => {
      if (call) {
        toast('Finish your current call first')
        return
      }
      begin(contact, kind, 'active')
    },
    [begin, call, toast],
  )
  const startPractice = useCallback(() => {
    if (call) {
      toast('Finish your current call first')
      return
    }
    begin(PRACTICE_CONTACT, 'practice', 'ringing')
  }, [begin, call, toast])
  const accept = useCallback(() => {
    setCall((c) => (c ? { ...c, phase: 'active' } : c))
    setSeconds(0)
  }, [])
  const hangUp = useCallback(() => {
    if (!call) return
    if (call.phase === 'ringing') toast('Practice call declined')
    else toast(`${call.kind === 'practice' ? 'Practice call' : 'Call'} with ${call.contact.name} ended · ${formatTimer(seconds)}`)
    setCall(null)
  }, [call, seconds, toast])
  const toggleMute = useCallback(() => setMuted((m) => !m), [])
  const value = useMemo(
    () => ({ call, seconds, muted, startCall, startPractice, accept, hangUp, toggleMute }),
    [call, seconds, muted, startCall, startPractice, accept, hangUp, toggleMute],
  )
  return <CallContext.Provider value={value}>{children}</CallContext.Provider>
}

export function useCall() {
  const ctx = useContext(CallContext)
  if (!ctx) throw new Error('useCall must be used within CallProvider')
  return ctx
}
