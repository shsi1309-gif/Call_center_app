import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { NOTIFICATIONS_FEED } from '../../data/notifications'

export function NotificationsOverlay({ onClose }) {
  const [filter, setFilter] = useState('all') // 'all' | 'action' | 'alert'
  const [loadedCount, setLoadedCount] = useState(6)
  const navigate = useNavigate()

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const filteredFeed = NOTIFICATIONS_FEED.filter((n) => {
    if (filter === 'action') return n.needsAction
    if (filter === 'alert') return !n.needsAction
    return true
  })

  const actionCount = NOTIFICATIONS_FEED.filter((n) => n.needsAction).length
  const alertCount = NOTIFICATIONS_FEED.length - actionCount

  const shown = []
  for (let i = 0; i < loadedCount && filteredFeed.length; i++) {
    const base = filteredFeed[i % filteredFeed.length]
    const cycle = Math.floor(i / filteredFeed.length)
    shown.push(cycle === 0 ? base : { ...base, time: `${cycle}w ago`, id: `${base.id}-${cycle}` })
  }

  const handleItemClick = (n) => {
    if (n.link) {
      onClose()
      navigate(n.link)
    }
  }

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: '#f7f7f9',
        zIndex: 320,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
      role="region"
      aria-label="Notifications"
    >
      {/* Header */}
      <div
        style={{
          background: '#fff',
          borderBottom: '1px solid #e5e5ea',
          padding: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          flexShrink: 0,
          boxShadow: '0 1px 3px rgba(0,0,0,.04)',
        }}
      >
        <button
          onClick={onClose}
          title="Back"
          aria-label="Back"
          style={{
            background: '#f0f0f3',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#45454d',
            fontSize: '16px',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          ←
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '16px', fontWeight: 800, color: '#1a1a1a' }}>Notifications</div>
          <div style={{ fontSize: '12px', color: '#8e8e93' }}>
            {actionCount} need action · {alertCount} alerts
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div
        style={{
          display: 'flex',
          background: '#f2f2f7',
          margin: '10px 12px 0',
          borderRadius: '9px',
          padding: '2px',
          flexShrink: 0,
        }}
      >
        <button
          onClick={() => setFilter('all')}
          style={{
            flex: 1,
            padding: '6px 11px',
            borderRadius: '7px',
            fontSize: '12.5px',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            background: filter === 'all' ? '#fff' : 'none',
            color: filter === 'all' ? '#1a1a1a' : '#8e8e93',
            boxShadow: filter === 'all' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
            transition: 'all 0.15s ease',
          }}
        >
          All
        </button>
        <button
          onClick={() => setFilter('action')}
          style={{
            flex: 1,
            padding: '6px 11px',
            borderRadius: '7px',
            fontSize: '12.5px',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            background: filter === 'action' ? '#fff' : 'none',
            color: filter === 'action' ? '#1a1a1a' : '#8e8e93',
            boxShadow: filter === 'action' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
            transition: 'all 0.15s ease',
          }}
        >
          Needs action
        </button>
        <button
          onClick={() => setFilter('alert')}
          style={{
            flex: 1,
            padding: '6px 11px',
            borderRadius: '7px',
            fontSize: '12.5px',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            background: filter === 'alert' ? '#fff' : 'none',
            color: filter === 'alert' ? '#1a1a1a' : '#8e8e93',
            boxShadow: filter === 'alert' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
            transition: 'all 0.15s ease',
          }}
        >
          Alerts
        </button>
      </div>

      {/* Notifications List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
        {shown.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#8e8e93', fontSize: '13.5px' }}>
            Nothing here right now.
          </div>
        ) : (
          <>
            {shown.map((n) => (
              <div
                key={n.id}
                onClick={() => handleItemClick(n)}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '11px',
                  background: '#fff',
                  borderLeft: `3px solid ${n.needsAction ? '#c8860a' : '#d5d5da'}`,
                  borderRadius: '10px',
                  padding: '11px 12px',
                  marginBottom: '8px',
                  cursor: n.link ? 'pointer' : 'default',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                  transition: 'background 0.15s',
                }}
              >
                {/* Icon square */}
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '9px',
                    background: `${n.color}22`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    fontSize: '16px',
                  }}
                >
                  {n.icon}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 800,
                        padding: '1px 7px',
                        borderRadius: '6px',
                        background: n.needsAction ? '#fff3d6' : '#f0f0f3',
                        color: n.needsAction ? '#7a4a00' : '#6b6b74',
                        letterSpacing: '0.02em',
                      }}
                    >
                      {n.needsAction ? 'ACTION NEEDED' : 'ALERT'}
                    </span>
                    <span style={{ fontSize: '11.5px', color: '#a8a8ad' }}>{n.time}</span>
                  </div>

                  <div style={{ fontSize: '13.5px', color: '#1a1a1a', lineHeight: 1.4 }}>{n.title}</div>

                  {n.cta && (
                    <div
                      style={{
                        fontSize: '12.5px',
                        fontWeight: 700,
                        color: '#185fa5',
                        marginTop: '4px',
                      }}
                    >
                      {n.cta} →
                    </div>
                  )}
                </div>
              </div>
            ))}

            <div
              onClick={() => setLoadedCount((c) => c + 6)}
              style={{
                textAlign: 'center',
                padding: '12px',
                color: '#185fa5',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              Load more ↓
            </div>
          </>
        )}
      </div>
    </div>
  )
}
