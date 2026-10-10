import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { INITIAL_MESSAGES, INITIAL_UNREAD, KUDOS, welcomeMessages } from '../data/pulse'
import { nowTime } from '../utils/format'

const PulseContext = createContext(null)

let seq = 0

const nextId = () => `msg-${Date.now()}-${seq++}`

export function PulseProvider({ children }) {
  const [store, setStore] = useState(INITIAL_MESSAGES)
  const [unread, setUnread] = useState(INITIAL_UNREAD)
  const [kudosNew, setKudosNew] = useState(KUDOS.newCount)
  const [pinned, setPinned] = useState({ state: 'open' })
  const append = useCallback((channelId, msg) => {
    setStore((s) => ({ ...s, [channelId]: [...(s[channelId] ?? welcomeMessages(channelId)), msg] }))
  }, [])
  const sendMessage = useCallback(
    (channelId, text) => {
      const trimmed = text.trim()
      if (!trimmed) return false
      append(channelId, { id: nextId(), author: 'You', initials: 'AR', time: nowTime(), text: trimmed, mine: true })
      return true
    },
    [append],
  )
  const postBotMessage = useCallback(
    (channelId, text, author = 'AvaniBot') => {
      const initials = author
        .split(/[\s-]+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0].toUpperCase())
        .join('')
      append(channelId, { id: nextId(), author, initials, time: nowTime(), text, mine: false })
    },
    [append],
  )
  const messagesFor = useCallback((id) => store[id] ?? welcomeMessages(id), [store])
  const unreadFor = useCallback((id) => unread[id] ?? 0, [unread])
  const markRead = useCallback((id) => setUnread((u) => (u[id] ? { ...u, [id]: 0 } : u)), [])
  const clearKudosNew = useCallback(() => setKudosNew(0), [])
  const value = useMemo(
    () => ({ messagesFor, sendMessage, postBotMessage, unreadFor, markRead, kudosNew, clearKudosNew, pinned, setPinned }),
    [messagesFor, sendMessage, postBotMessage, unreadFor, markRead, kudosNew, clearKudosNew, pinned],
  )
  return <PulseContext.Provider value={value}>{children}</PulseContext.Provider>
}

export function usePulse() {
  const ctx = useContext(PulseContext)
  if (!ctx) throw new Error('usePulse must be used within PulseProvider')
  return ctx
}
