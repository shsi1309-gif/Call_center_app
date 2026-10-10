import { useState } from 'react'
import { ChevronRight, Lock, Store } from 'lucide-react'

export function SettingsView({ onClose }) {
  const [name, setName] = useState('Aditi Sharma')
  const [empId] = useState('OG-EMP-07734')
  const [email, setEmail] = useState('aditi.s@ogretail.in')
  const [phone, setPhone] = useState('+91 98450 11223')

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
      aria-label="Settings"
    >
      {/* Top Header */}
      <div
        style={{
          background: 'rgba(18, 60, 48, 0.97)',
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          color: '#fff',
        }}
      >
        <button
          onClick={onClose}
          aria-label="Back"
          style={{
            background: 'none',
            border: 'none',
            color: '#fff',
            fontSize: '18px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          ←
        </button>
        <div style={{ fontSize: '16px', fontWeight: 700 }}>Settings</div>
      </div>

      <div style={{ padding: '20px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* EMPLOYEE PROFILE */}
        <section>
          <div style={{ fontSize: '11px', fontWeight: 800, color: '#8e8e93', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '10px' }}>
            EMPLOYEE PROFILE
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', background: '#fff', padding: '16px', borderRadius: '12px', border: '1px solid #e5e5ea' }}>
            <div>
              <label style={{ fontSize: '10.5px', fontWeight: 700, color: '#8e8e93', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                FULL NAME
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #e5e5ea', background: '#f9f9f9', fontSize: '13.5px', fontWeight: 600 }}
              />
            </div>
            <div>
              <label style={{ fontSize: '10.5px', fontWeight: 700, color: '#8e8e93', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                EMPLOYEE ID
              </label>
              <input
                value={empId}
                disabled
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #e5e5ea', background: '#f0f0f3', fontSize: '13.5px', fontWeight: 600, color: '#64748b' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '10.5px', fontWeight: 700, color: '#8e8e93', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                EMAIL
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #e5e5ea', background: '#f9f9f9', fontSize: '13.5px', fontWeight: 600 }}
              />
            </div>
            <div>
              <label style={{ fontSize: '10.5px', fontWeight: 700, color: '#8e8e93', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                PHONE NUMBER
              </label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #e5e5ea', background: '#f9f9f9', fontSize: '13.5px', fontWeight: 600 }}
              />
            </div>
          </div>
        </section>

        {/* SECURITY */}
        <section>
          <div style={{ fontSize: '11px', fontWeight: 800, color: '#8e8e93', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '10px' }}>
            SECURITY
          </div>
          <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e5ea', padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#e1f5ee', color: '#0f6e56', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Lock size={16} />
              </div>
              <div>
                <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#1a1a1a' }}>Change App Password</div>
                <div style={{ fontSize: '12px', color: '#8e8e93' }}>Update your 4-digit login PIN</div>
              </div>
            </div>
            <ChevronRight size={16} color="#8e8e93" />
          </div>
        </section>

        {/* STORE */}
        <section>
          <div style={{ fontSize: '11px', fontWeight: 800, color: '#8e8e93', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '10px' }}>
            STORE
          </div>
          <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e5ea', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#e1f5ee', color: '#0f6e56', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Store size={16} />
                </div>
                <div>
                  <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#1a1a1a' }}>Base Store</div>
                  <div style={{ fontSize: '12px', color: '#8e8e93' }}>Koramangala — The Sleep Company</div>
                </div>
              </div>
              <ChevronRight size={16} color="#8e8e93" />
            </div>
            <div style={{ background: '#ecfdf5', color: '#065f46', fontSize: '12px', fontWeight: 600, padding: '6px 10px', borderRadius: '6px' }}>
              Allocated: Koramangala · HSR Layout · Indiranagar
            </div>
          </div>
        </section>

        {/* ROLE & DESIGNATION */}
        <section>
          <div style={{ fontSize: '11px', fontWeight: 800, color: '#8e8e93', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '10px' }}>
            ROLE & DESIGNATION
          </div>
          <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e5ea', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#eff6ff', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 800 }}>
              MO
            </div>
            <div>
              <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#1a1a1a' }}>MO · Call Centre Staff</div>
              <div style={{ fontSize: '12px', color: '#8e8e93' }}>Staff tier — sits below Manager designations (M1 Store Manager, M2 Ops Manager) shown in Settings on the Manager app. Your exact sub-role is set below.</div>
            </div>
          </div>
        </section>

        {/* YOUR CUSTOMER CHANNEL */}
        <section>
          <div style={{ fontSize: '11px', fontWeight: 800, color: '#8e8e93', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '8px' }}>
            YOUR CUSTOMER CHANNEL
          </div>
          <div style={{ fontSize: '12.5px', color: '#64748b', lineHeight: 1.5 }}>
            This app is for Call Centre staff — your customer channel is fixed accordingly.
          </div>
        </section>
      </div>
    </div>
  )
}
