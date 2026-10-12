import { useState } from 'react'
import { Phone } from 'lucide-react'
import { DialerModal } from './DialerModal'

export function DemoBar({ onOpenTelephony }) {
  const [dialerOpen, setDialerOpen] = useState(false)

  return (
    <>
      {/* Floating Action Button (FAB) for Phone Dialer */}
      <button
        type="button"
        onClick={() => setDialerOpen(true)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '58px',
          height: '58px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #10b981, #059669)',
          color: '#ffffff',
          border: 'none',
          boxShadow: '0 8px 24px rgba(5, 150, 105, 0.45)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 400,
          transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.08)'
          e.currentTarget.style.boxShadow = '0 12px 30px rgba(5, 150, 105, 0.6)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)'
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(5, 150, 105, 0.45)'
        }}
        aria-label="Open Phone Dialer"
        title="Open Phone Dialer"
      >
        <Phone size={24} />
      </button>

      {/* Phone Dialer Modal */}
      <DialerModal
        isOpen={dialerOpen}
        onClose={() => setDialerOpen(false)}
        onOpenTelephony={onOpenTelephony}
      />
    </>
  )
}
