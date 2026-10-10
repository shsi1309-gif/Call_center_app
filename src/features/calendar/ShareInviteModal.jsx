import { useState } from 'react'
import { X, User, Users, GraduationCap, Check } from 'lucide-react'

const SHARE_CONTACTS = [
  {
    id: 'c1',
    name: 'Sunita Rao',
    role: 'Manager',
    icon: User,
  },
  {
    id: 'c2',
    name: 'Call Centre Team',
    role: 'All members · #callcentre-team',
    icon: Users,
  },
  {
    id: 'c3',
    name: 'Fahmy',
    role: 'L&D',
    icon: GraduationCap,
  },
]

export function ShareInviteModal({ isOpen, onClose, event, onShareSuccess }) {
  const [selectedIds, setSelectedIds] = useState(['c1'])

  if (!isOpen || !event) return null

  const toggleContact = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    )
  }

  const handleDone = () => {
    if (onShareSuccess) {
      onShareSuccess(event, selectedIds)
    }
    onClose()
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(3px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.15s ease-out',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '440px',
          padding: '20px 24px 24px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.18)',
          position: 'relative',
          animation: 'scaleUp 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle pill */}
        <div
          style={{
            width: '36px',
            height: '4px',
            backgroundColor: '#d1d5db',
            borderRadius: '999px',
            margin: '0 auto 14px',
          }}
        />

        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: '#f3f4f6',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#4b5563',
            cursor: 'pointer',
          }}
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div style={{ marginBottom: '18px' }}>
          <h2
            style={{
              fontSize: '18px',
              fontWeight: 700,
              color: '#111827',
              margin: 0,
              lineHeight: 1.3,
            }}
          >
            Share invite
          </h2>
          <p
            style={{
              fontSize: '14px',
              color: '#6b7280',
              margin: '3px 0 0',
            }}
          >
            {event.title}
          </p>
        </div>

        {/* Contacts List */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            marginBottom: '20px',
          }}
        >
          {SHARE_CONTACTS.map((contact) => {
            const isChecked = selectedIds.includes(contact.id)
            const Icon = contact.icon
            return (
              <div
                key={contact.id}
                onClick={() => toggleContact(contact.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  borderRadius: '14px',
                  border: isChecked ? '1.5px solid #6366f1' : '1.5px solid #e5e7eb',
                  backgroundColor: isChecked ? '#f8f9ff' : '#ffffff',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '10px',
                      backgroundColor: '#eff6ff',
                      color: '#3b82f6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon size={20} />
                  </div>
                  <div>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: '14px',
                        color: '#111827',
                      }}
                    >
                      {contact.name}
                    </div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: '#6b7280',
                        marginTop: '1px',
                      }}
                    >
                      {contact.role}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '6px',
                    border: isChecked ? '2px solid #5b36f5' : '2px solid #d1d5db',
                    backgroundColor: isChecked ? '#5b36f5' : '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {isChecked && <Check size={14} strokeWidth={3} />}
                </div>
              </div>
            )
          })}
        </div>

        {/* Done Button */}
        <button
          onClick={handleDone}
          style={{
            width: '100%',
            padding: '13px',
            borderRadius: '14px',
            backgroundColor: '#5b36f5',
            color: '#ffffff',
            fontWeight: 600,
            fontSize: '15px',
            border: 'none',
            cursor: 'pointer',
            transition: 'background 0.15s ease',
            boxShadow: '0 4px 12px rgba(91, 54, 245, 0.25)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#4c2ce0')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#5b36f5')}
        >
          Done
        </button>
      </div>
    </div>
  )
}
