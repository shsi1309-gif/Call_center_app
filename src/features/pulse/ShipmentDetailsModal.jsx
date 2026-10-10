import { CheckCircle2, MapPin, Package, Truck, X } from 'lucide-react'

export function ShipmentDetailsModal({ isOpen, onClose, shipment }) {
  if (!isOpen || !shipment) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
        backdropFilter: 'blur(3px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.15s ease-out',
      }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Shipment details"
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '460px',
          padding: '22px 24px 24px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.22)',
          position: 'relative',
          color: '#1e293b',
          animation: 'modalSlideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag pill handle */}
        <div
          style={{
            width: '36px',
            height: '4px',
            backgroundColor: '#d1d5db',
            borderRadius: '999px',
            margin: '0 auto 16px',
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              backgroundColor: '#ecfdf5',
              color: '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Package size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '17px', fontWeight: 700, color: '#111827', margin: 0 }}>
              Shipment Details
            </h2>
            <p style={{ fontSize: '13px', color: '#6b7280', margin: '2px 0 0' }}>
              Tracking: <strong style={{ color: '#111827' }}>{shipment.tracking || '4RS4DDF6549B4'}</strong>
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div style={{ marginBottom: '18px' }}>
          <span
            style={{
              backgroundColor: '#dcfce7',
              color: '#166534',
              fontSize: '12px',
              fontWeight: 700,
              padding: '4px 10px',
              borderRadius: '999px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <CheckCircle2 size={14} />
            {shipment.status || 'Ready for delivery'}
          </span>
        </div>

        {/* Info Grid */}
        <div
          style={{
            backgroundColor: '#f8fafc',
            borderRadius: '16px',
            padding: '14px 16px',
            border: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            marginBottom: '18px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
            <span style={{ color: '#64748b' }}>Model</span>
            <strong style={{ color: '#0f172a' }}>{shipment.model || 'Ortho Grid Pro, King'}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
            <span style={{ color: '#64748b' }}>Destination</span>
            <strong style={{ color: '#0f172a', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <MapPin size={13} style={{ color: '#059669' }} />
              {shipment.destination || 'RT Nagar, Bengaluru'}
            </strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
            <span style={{ color: '#64748b' }}>Dispatch Vehicle</span>
            <strong style={{ color: '#0f172a', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Truck size={13} style={{ color: '#2563eb' }} />
              Van #KA-04-E-8821
            </strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
            <span style={{ color: '#64748b' }}>Estimated Arrival</span>
            <strong style={{ color: '#059669' }}>Today by 4:00 PM</strong>
          </div>
        </div>

        {/* Timeline */}
        <div style={{ marginBottom: '20px' }}>
          <div
            style={{
              fontSize: '11px',
              fontWeight: 800,
              color: '#64748b',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              marginBottom: '10px',
            }}
          >
            DISPATCH TIMELINE
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12.5px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0f172a' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }} />
              <span><strong>10:05 AM:</strong> Out for delivery to RT Nagar</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#cbd5e1' }} />
              <span><strong>9:15 AM:</strong> Loaded on dispatch van #KA-04-E-8821</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#cbd5e1' }} />
              <span><strong>8:00 AM:</strong> Quality check passed at Koramangala Hub</span>
            </div>
          </div>
        </div>

        {/* Done Button */}
        <button
          onClick={onClose}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '12px',
            backgroundColor: '#0f6e56',
            color: '#ffffff',
            fontWeight: 600,
            fontSize: '14.5px',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(15, 110, 86, 0.3)',
          }}
        >
          Done
        </button>
      </div>
    </div>
  )
}
