import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useToast } from './ToastContext'
import { formatTimer } from '../utils/format'

const CallContext = createContext(null)

const PRACTICE_CONTACT = {
  name: 'Ritu S.',
  initials: 'RS',
  detail: '🎯 Intent 96 · calling from +91 98450 xxxxx',
  phone: '98450 61245',
  product: 'Smart Luxe Mattress · ₹13,390',
  crossSell: 'Mattress Protector · ₹1,999',
  emi: 'Not yet discussed — surface it early, she asked about total cost',
  closingChance: '88%',
}

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
  const [wrapup, setWrapup] = useState(null)

  const hangUp = useCallback(() => {
    if (!call) return
    const formatted = formatTimer(seconds)
    const effectiveDuration = !formatted || formatted === '00:00' ? '02:43' : formatted
    toast(`${call.kind === 'practice' ? 'Practice call' : 'Call'} with ${call.contact.name} ended · ${effectiveDuration}`)
    setWrapup({
      contact: call.contact,
      duration: effectiveDuration,
    })
    setCall(null)
  }, [call, seconds, toast])

  const openWrapup = useCallback((contact, duration = '01:52') => {
    setWrapup({
      contact: contact || { name: 'Mukunda', product: 'Ortho GRID · ₹8,490' },
      duration,
    })
  }, [])

  const closeWrapup = useCallback(() => {
    setWrapup(null)
  }, [])

  const toggleMute = useCallback(() => setMuted((m) => !m), [])
  const value = useMemo(
    () => ({
      call,
      seconds,
      muted,
      wrapup,
      startCall,
      startPractice,
      accept,
      hangUp,
      toggleMute,
      openWrapup,
      closeWrapup,
    }),
    [call, seconds, muted, wrapup, startCall, startPractice, accept, hangUp, toggleMute, openWrapup, closeWrapup],
  )
  return <CallContext.Provider value={value}>{children}</CallContext.Provider>
}

export function useCall() {
  const ctx = useContext(CallContext)
  if (!ctx) throw new Error('useCall must be used within CallProvider')
  return ctx
}
