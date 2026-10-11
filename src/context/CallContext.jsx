import { createContext, useCallback, useContext, useEffect, useMemo, useState, useRef } from 'react'
import { useToast } from './ToastContext'
import { formatTimer } from '../utils/format'
import { callAudio } from '../utils/callAudioEngine'
import { CONVERSATION_SCENARIOS, matchAiResponse } from '../utils/callConversation'

const CallContext = createContext(null)

const PRACTICE_CONTACT = {
  name: 'Faizan A.',
  initials: 'FA',
  detail: '🎯 Intent 85 · calling from +91 98450 xxxxx',
  phone: '98450 61245',
  product: 'Tranquo Massager Chair · ₹24,990',
  closingChance: '85%',
  callMode: 'ai-to-human',
}

export function CallProvider({ children }) {
  const toast = useToast()
  const [call, setCall] = useState(null)
  const [seconds, setSeconds] = useState(0)
  const [muted, setMuted] = useState(false)
  const [onHold, setOnHold] = useState(false)
  const [callMode, setCallMode] = useState('ai-to-human') // 'ai-to-human' | 'human-to-human'
  const [speakingSource, setSpeakingSource] = useState('none') // 'agent' | 'customer' | 'none'
  const [sentiment, setSentiment] = useState({ score: 82, label: 'Positive' })
  const [transcript, setTranscript] = useState([])
  const [wrapup, setWrapup] = useState(null)
  const [consentContact, setConsentContact] = useState(null)
  const [isMicActive, setIsMicActive] = useState(false)
  const recognitionRef = useRef(null)

  const active = call?.phase === 'active'

  // Timer for active call
  useEffect(() => {
    if (!active) return
    const id = window.setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => window.clearInterval(id)
  }, [active])

  // Handle incoming / ringing phase sound
  useEffect(() => {
    if (call?.phase === 'ringing') {
      callAudio.startRingback()
    } else {
      callAudio.stopRingback()
    }
    return () => callAudio.stopRingback()
  }, [call?.phase])

  // Initialize transcript and greeting on call connect
  const initCallConversation = useCallback(
    (mode, contact) => {
      const scenarioKey = mode || 'ai-to-human'
      const scenario = CONVERSATION_SCENARIOS[scenarioKey] || CONVERSATION_SCENARIOS['ai-to-human']
      const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

      const initialTranscripts = [
        {
          id: 'init-1',
          sender: mode === 'human-to-human' ? 'System' : 'Agent',
          text: scenario.initialGreeting,
          time: nowTime,
          type: 'greeting',
        },
      ]

      setTranscript(initialTranscripts)
      setSentiment({ score: 82, label: 'Positive' })

      // If AI-to-human mode, trigger initial AI greeting speech
      if (mode === 'ai-to-human') {
        setSpeakingSource('agent')
        callAudio.speak(
          scenario.initialGreeting,
          () => setSpeakingSource('agent'),
          () => setSpeakingSource('none'),
        )
      } else {
        // Human-to-Human: establish WebRTC loopback
        callAudio.startWebRtcLoopback()
      }
    },
    [],
  )

  const begin = useCallback((contact, kind, phase, mode = 'ai-to-human') => {
    setSeconds(0)
    setMuted(false)
    setOnHold(false)
    setCallMode(mode)
    setSpeakingSource('none')
    setCall({ contact, kind, phase, mode })
  }, [])

  const startCall = useCallback(
    (contact, kind = 'outgoing', options = {}) => {
      if (call) {
        toast('Finish your current call first')
        return
      }

      const mode = options.mode || contact.callMode || callMode || 'ai-to-human'
      setCallMode(mode)

      // Start ringing sound if outgoing
      callAudio.initAudio()
      callAudio.playConnectedChime()

      begin(contact, kind, 'active', mode)
      initCallConversation(mode, contact)

      if (options.openConsent !== false) {
        setConsentContact({
          name: contact.name || 'Faizan A.',
          phone: contact.phone || '98450 61245',
          callType: contact.callType || 'Call centre',
          initialMode: 'wa',
        })
      }
    },
    [begin, call, callMode, initCallConversation, toast],
  )

  const startPractice = useCallback(
    (contact = PRACTICE_CONTACT) => {
      if (call) {
        toast('Finish your current call first')
        return
      }
      begin(contact, 'practice', 'ringing', 'ai-to-human')
    },
    [begin, call, toast],
  )

  const accept = useCallback(() => {
    callAudio.playConnectedChime()
    const mode = call?.mode || callMode || 'ai-to-human'
    setCall((c) => (c ? { ...c, phase: 'active' } : c))
    setSeconds(0)
    initCallConversation(mode, call?.contact)
    setConsentContact({
      name: call?.contact?.name || 'Faizan A.',
      phone: call?.contact?.phone || '98450 61245',
      callType: 'Call centre',
      initialMode: 'wa',
    })
  }, [call, callMode, initCallConversation])

  const hangUp = useCallback(() => {
    if (!call) return
    callAudio.playHangupChime()
    callAudio.stopHoldMusic()
    callAudio.stopSpeech()
    callAudio.stopMicrophone()
    callAudio.stopSpeechRecognition()
    callAudio.stopWebRtc()

    const formatted = formatTimer(seconds)
    const effectiveDuration = !formatted || formatted === '00:00' ? '00:38' : formatted
    toast(`${call.kind === 'practice' ? 'Practice call' : 'Call'} with ${call.contact.name} ended · ${effectiveDuration}`)
    setWrapup({
      contact: call.contact,
      duration: effectiveDuration,
      sentiment,
      transcript,
      callMode,
    })
    setCall(null)
    setConsentContact(null)
    setSpeakingSource('none')
    setIsMicActive(false)
  }, [call, seconds, toast, sentiment, transcript, callMode])

  const toggleMute = useCallback(() => {
    setMuted((m) => {
      const next = !m
      callAudio.isMuted = next
      toast(next ? 'Microphone muted' : 'Microphone unmuted')
      return next
    })
  }, [toast])

  const toggleHold = useCallback(() => {
    setOnHold((h) => {
      const next = !h
      if (next) {
        callAudio.startHoldMusic()
        toast('Call placed on hold · Pleasant hold music active')
      } else {
        callAudio.stopHoldMusic()
        toast('Call resumed from hold')
      }
      return next
    })
  }, [toast])

  const playDtmf = useCallback((digit) => {
    callAudio.playDtmf(digit)
  }, [])

  // Send an utterance from the user or prompt
  const sendUtterance = useCallback(
    (text) => {
      if (!text || !text.trim()) return
      const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      const trimmed = text.trim()

      const userTurn = {
        id: `u-${Date.now()}`,
        sender: 'Agent',
        text: trimmed,
        time: nowTime,
      }

      setTranscript((prev) => [...prev, userTurn])
      setSpeakingSource('agent')

      // Get dynamic AI customer or remote peer response
      setTimeout(() => {
        const resp = matchAiResponse(callMode, trimmed)
        const customerTurn = {
          id: `c-${Date.now()}`,
          sender: callMode === 'human-to-human' ? 'Faizan (Peer)' : 'Faizan (AI Customer)',
          text: resp.customerReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sentiment: resp.sentiment,
          sopPoint: resp.sopPoint,
        }

        setTranscript((prev) => [...prev, customerTurn])
        setSentiment({
          score: resp.sentiment,
          label: resp.sentimentLabel,
        })
        setSpeakingSource('customer')

        // Speak customer response out loud with browser SpeechSynthesis!
        callAudio.speak(
          resp.customerReply,
          () => setSpeakingSource('customer'),
          () => setSpeakingSource('none'),
        )
      }, 500)
    },
    [callMode],
  )

  const switchCallMode = useCallback(
    (newMode) => {
      setCallMode(newMode)
      setCall((c) => (c ? { ...c, mode: newMode } : c))
      toast(`Switched to ${newMode === 'ai-to-human' ? 'AI-to-Human Voice Agent' : 'Human-to-Human WebRTC'} mode`)
      initCallConversation(newMode, call?.contact)
    },
    [call?.contact, initCallConversation, toast],
  )

  // Request actual microphone input
  const enableMicrophone = useCallback(async () => {
    callAudio.initAudio()
    const res = await callAudio.startMicrophone()
    if (res.success) {
      setIsMicActive(true)
      toast('Live microphone connected! Audio waveform active.')

      // Start live speech recognition if supported
      recognitionRef.current = callAudio.startSpeechRecognition(
        (recognizedText) => {
          if (recognizedText) {
            sendUtterance(recognizedText)
          }
        },
        () => {},
      )
    } else {
      setIsMicActive(false)
      toast('Microphone unavailable — synthetic audio wave generator engaged.')
    }
  }, [sendUtterance, toast])

  const openWrapup = useCallback((contact, duration = '00:38') => {
    setWrapup({
      contact: contact || { name: 'Faizan A.', product: 'Tranquo Massager Chair · ₹24,990' },
      duration,
      sentiment: { score: 85, label: 'Positive' },
      transcript: [],
      callMode: 'ai-to-human',
    })
  }, [])

  const closeWrapup = useCallback(() => {
    setWrapup(null)
  }, [])

  const value = useMemo(
    () => ({
      call,
      seconds,
      muted,
      onHold,
      callMode,
      speakingSource,
      sentiment,
      transcript,
      isMicActive,
      wrapup,
      consentContact,
      setConsentContact,
      startCall,
      startPractice,
      accept,
      hangUp,
      toggleMute,
      toggleHold,
      playDtmf,
      sendUtterance,
      switchCallMode,
      enableMicrophone,
      openWrapup,
      closeWrapup,
    }),
    [
      call,
      seconds,
      muted,
      onHold,
      callMode,
      speakingSource,
      sentiment,
      transcript,
      isMicActive,
      wrapup,
      consentContact,
      startCall,
      startPractice,
      accept,
      hangUp,
      toggleMute,
      toggleHold,
      playDtmf,
      sendUtterance,
      switchCallMode,
      enableMicrophone,
      openWrapup,
      closeWrapup,
    ],
  )

  return <CallContext.Provider value={value}>{children}</CallContext.Provider>
}

export function useCall() {
  const ctx = useContext(CallContext)
  if (!ctx) throw new Error('useCall must be used within CallProvider')
  return ctx
}
