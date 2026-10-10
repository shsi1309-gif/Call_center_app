import { Modal } from '../../components/ui/Modal'

const FEED = [
  { id: 'k1', icon: '🌟', text: 'Sunita Rao: Great work with Mukunda — closed that objection beautifully!', time: '12:40pm' },
  { id: 'k2', icon: '🔥', text: 'Raju Kumar: Nice cross-sell on the Tranquo chair!', time: 'Yesterday' },
  { id: 'k3', icon: '👏', text: 'Priya Krishnan: Thanks for covering my slot last week', time: 'Mon' },
]

export function KudosModal({ onClose }) {
  return (
    <Modal
      title="Kudos"
      subtitle="12 all-time · 3 new"
      icon={<span>🏆</span>}
      headerBackground="linear-gradient(135deg,#c8860a,#e0a52f)"
      onClose={onClose}
    >
      <ul className="kudos-feed">
        {FEED.map((k) => (
          <li key={k.id}>
            <span>{k.icon}</span>
            <p>{k.text}</p>
            <small>{k.time}</small>
          </li>
        ))}
      </ul>
    </Modal>
  )
}
