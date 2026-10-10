import { Phone } from 'lucide-react'
import { Modal } from '../../components/ui/Modal'
import { useCall } from '../../context/CallContext'

const KIND_LABEL = { completed: 'Completed call', outgoing: 'Outgoing call', missed: 'Missed call' }

export function CallDetailModal({ call, onClose }) {
  const { startCall } = useCall()

  return (
    <Modal
      title={call.name}
      subtitle={`${KIND_LABEL[call.kind]} · ${call.when}`}
      headerBackground="linear-gradient(135deg,#123c30,#0f6e56)"
      onClose={onClose}
    >
      <div className="cd">
        <dl className="cd__meta">
          <div>
            <dt>Duration</dt>
            <dd>{call.duration ?? 'Not answered'}</dd>
          </div>
          <div>
            <dt>SOP score</dt>
            <dd>{call.sopScore !== null ? `${call.sopScore}%` : 'n/a'}</dd>
          </div>
        </dl>
        {call.sopScore !== null && (
          <div
            className="cd__bar"
            role="progressbar"
            aria-label="SOP adherence"
            aria-valuenow={call.sopScore}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div style={{ width: `${call.sopScore}%` }} />
          </div>
        )}
        <p className="cd__summary">{call.summary}</p>
        <div className="section-label">{call.kind === 'missed' ? 'Next step' : 'Review notes'}</div>
        <ul className="cd__notes">
          {call.notes.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
        <button
          className="btn btn--primary"
          onClick={() => {
            startCall({ name: call.name, initials: call.name.slice(0, 2).toUpperCase(), detail: 'Calling back…' }, 'callback')
            onClose()
          }}
        >
          <Phone size={14} /> Call back
        </button>
      </div>
    </Modal>
  )
}
