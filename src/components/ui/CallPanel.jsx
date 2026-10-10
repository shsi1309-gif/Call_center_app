import { Mic, MicOff, Phone, PhoneOff } from 'lucide-react'
import { useCall } from '../../context/CallContext'
import { formatTimer } from '../../utils/format'
import { Avatar } from './Avatar'
import './CallPanel.css'

/** Floating in-app call card: ringing (practice) → active with timer, mute and hang up. */
export function CallPanel() {
  const { call, seconds, muted, accept, hangUp, toggleMute } = useCall()
  if (!call) return null
  const ringing = call.phase === 'ringing'

  return (
    <section className="call-panel" role="dialog" aria-label={ringing ? 'Incoming practice call' : 'Call in progress'}>
      <div className="call-panel__top">
        <Avatar initials={call.contact.initials} background="rgba(255,255,255,.15)" color="#fff" />
        <div className="call-panel__who">
          <strong>{call.contact.name}</strong>
          <span>{call.contact.detail ?? (call.kind === 'callback' ? 'Calling back…' : 'Outgoing call')}</span>
        </div>
        <span className={`call-panel__status ${ringing ? 'is-ringing' : ''}`}>
          {ringing ? 'Incoming…' : <span className="tabular">{formatTimer(seconds)}</span>}
        </span>
      </div>
      <div className="call-panel__actions">
        {ringing ? (
          <>
            <button className="call-panel__btn call-panel__btn--decline" onClick={hangUp}>
              <PhoneOff size={16} /> Decline
            </button>
            <button className="call-panel__btn call-panel__btn--accept" onClick={accept}>
              <Phone size={16} /> Accept
            </button>
          </>
        ) : (
          <>
            <button className="call-panel__btn" onClick={toggleMute} aria-pressed={muted}>
              {muted ? <MicOff size={16} /> : <Mic size={16} />} {muted ? 'Unmute' : 'Mute'}
            </button>
            <button className="call-panel__btn call-panel__btn--decline" onClick={hangUp}>
              <PhoneOff size={16} /> End call
            </button>
          </>
        )}
      </div>
    </section>
  )
}
