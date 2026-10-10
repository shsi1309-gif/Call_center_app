import { useState } from 'react'
import { usePulse } from '../../context/PulseContext'
import { useToast } from '../../context/ToastContext'

const RESCHEDULE_OPTIONS = ['5:00pm', '6:00pm', 'Tomorrow 11:00am']

export function NeedsInputCard({ channelId }) {
  const { pinned, setPinned, sendMessage, postBotMessage } = usePulse()
  const toast = useToast()
  const [answer, setAnswer] = useState('')
  const [error, setError] = useState('')
  const resolve = (text, ack) => {
    sendMessage(channelId, text)
    postBotMessage(channelId, ack)
    setPinned({ state: 'answered', answer: text })
    toast('Answer sent')
  }
  const submitReply = (e) => {
    e.preventDefault()
    if (!answer.trim()) {
      setError('Type an answer first.')
      return
    }
    resolve(answer.trim(), 'Thanks, noted. I will update the callback plan.')
    setAnswer('')
    setError('')
  }
  if (pinned.state === 'answered') {
    return (
      <div className="needs needs--done" role="status">
        <span>✓ Answered</span>
        <strong>{pinned.answer}</strong>
      </div>
    )
  }

  return (
    <section className="needs" aria-label="Needs your input">
      <div className="needs__top">
        <span className="needs__tag">
          Needs your input <b>1</b>
        </span>
        <small>pinned</small>
      </div>
      <h2>Confirm the 4:30pm callback</h2>
      <p>Priya Iyer · likely billing dispute</p>

      {pinned.state === 'open' ? (
        <div className="needs__btns">
          <button
            className="btn btn--ghost"
            onClick={() => resolve('Confirmed — I will call at 4:30pm.', 'Great, the 4:30pm callback is locked in.')}
          >
            Confirmed
          </button>
          <button className="btn btn--ghost" onClick={() => setPinned({ state: 'rescheduling' })}>
            Reschedule
          </button>
        </div>
      ) : (
        <div className="needs__btns" role="group" aria-label="Pick a new time">
          {RESCHEDULE_OPTIONS.map((t) => (
            <button
              key={t}
              className="btn btn--ghost"
              onClick={() =>
                resolve(`Please reschedule the callback to ${t}.`, `Rescheduled to ${t}. I will remind you 10 minutes before.`)
              }
            >
              {t}
            </button>
          ))}
          <button className="btn btn--ghost" onClick={() => setPinned({ state: 'open' })}>
            Cancel
          </button>
        </div>
      )}

      <form className="needs__reply" onSubmit={submitReply} noValidate>
        <input
          value={answer}
          onChange={(e) => {
            setAnswer(e.target.value)
            if (error) setError('')
          }}
          placeholder="Or type your answer"
          aria-label="Type your answer"
          aria-invalid={Boolean(error)}
        />
        <button type="submit" aria-label="Send answer">
          Send
        </button>
      </form>
      {error && (
        <p className="chan__error" role="alert">
          {error}
        </p>
      )}
    </section>
  )
}
