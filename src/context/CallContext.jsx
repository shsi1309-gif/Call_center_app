import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useToast } from './ToastContext'
import { formatTimer } from '../utils/format'

const CallContext = createContext(null)

const PRACTICE_CONTACT = {
  name: 'Faizan A.',
  initials: 'FA',
  detail: '🎯 Intent 85 · calling from +91 98450 xxxxx',
  phone: '98450 61245',
  product: 'Tranquo Massager Chair · ₹24,990',
  closingChance: '85%',
}

export function CallProvider({ children }) {
  const toast = useToast()
  const [call, setCall] = useState(null)
  const [seconds, setSeconds] = useState(0)
  const [muted, setMuted] = useState(false)
  const [wrapup, setWrapup] = useState(null)
  const [consentContact, setConsentContact] = useState(null)

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
    (contact, kind = 'outgoing', options = {}) => {
      if (call) {
        toast('Finish your current call first')
        return
      }
      begin(contact, kind, 'active')
      if (options.openConsent !== false) {
        setConsentContact({
          name: contact.name || 'Faizan A.',
          phone: contact.phone || '98450 61245',
          callType: contact.callType || 'Call centre',
          initialMode: 'wa',
        })
      }
    },
    [begin, call, toast],
  )

  const startPractice = useCallback((contact = PRACTICE_CONTACT) => {
    if (call) {
      toast('Finish your current call first')
      return
    }
    begin(contact, 'practice', 'ringing')
  }, [begin, call, toast])

  const accept = useCallback(() => {
    setCall((c) => (c ? { ...c, phase: 'active' } : c))
    setSeconds(0)
    setConsentContact({
      name: call?.contact?.name || 'Faizan A.',
      phone: call?.contact?.phone || '98450 61245',
      callType: 'Call centre',
      initialMode: 'wa',
    })
  }, [call])

  const hangUp = useCallback(() => {
    if (!call) return
    const formatted = formatTimer(seconds)
    const effectiveDuration = !formatted || formatted === '00:00' ? '00:38' : formatted
    toast(`${call.kind === 'practice' ? 'Practice call' : 'Call'} with ${call.contact.name} ended · ${effectiveDuration}`)
    setWrapup({
      contact: call.contact,
      duration: effectiveDuration,
    })
    setCall(null)
    setConsentContact(null)
  }, [call, seconds, toast])

  const openWrapup = useCallback((contact, duration = '00:38') => {
    setWrapup({
      contact: contact || { name: 'Faizan A.', product: 'Tranquo Massager Chair · ₹24,990' },
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
      consentContact,
      setConsentContact,
      startCall,
      startPractice,
      accept,
      hangUp,
      toggleMute,
      openWrapup,
      closeWrapup,
    }),
    [call, seconds, muted, wrapup, consentContact, startCall, startPractice, accept, hangUp, toggleMute, openWrapup, closeWrapup],
  )
  return <CallContext.Provider value={value}>{children}</CallContext.Provider>
}

export function useCall() {
  const ctx = useContext(CallContext)
  if (!ctx) throw new Error('useCall must be used within CallProvider')
  return ctx
}
