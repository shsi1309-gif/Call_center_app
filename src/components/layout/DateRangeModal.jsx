import { useState } from 'react'

const PRESETS = ['Today', 'This Week', 'This Month', 'Last 30 Days', 'Custom']

export function DateRangeModal({ onClose, onApply, currentRange = 'This Week' }) {
  const [selectedPreset, setSelectedPreset] = useState(currentRange)
  const [from, setFrom] = useState('2026-06-01')
  const [to, setTo] = useState('2026-06-12')

  const handleApply = () => {
    onApply?.(selectedPreset)
    onClose()
  }

  return (
    <div
      className="overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{ zIndex: 600, alignItems: 'flex-end', padding: 0 }}
      role="dialog"
      aria-modal="true"
      aria-label="Select Date Range"
    >
      <div
        style={{
          background: '#fff',
          borderRadius: '20px 20px 0 0',
          width: '100%',
          padding: '20px 24px 28px',
          position: 'relative',
          boxShadow: '0 -10px 25px rgba(0,0,0,0.1)',
          animation: 'slideUp 0.2s ease-out',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#1a1a1a' }}>Select Date Range</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              background: '#f0f0f3',
              border: 'none',
              borderRadius: '50%',
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#8e8e93',
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            ✕
          </button>
        </div>

        {/* Preset buttons */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '18px' }}>
          {PRESETS.map((preset) => {
            const isSelected = preset === selectedPreset
            return (
              <button
                key={preset}
                onClick={() => setSelectedPreset(preset)}
                style={{
                  padding: '7px 14px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  background: isSelected ? '#1d9e75' : '#f0f0f3',
                  color: isSelected ? '#fff' : '#45454d',
                  transition: 'all 0.15s ease',
                }}
              >
                {preset}
              </button>
            )
          })}
        </div>

        {/* Date Inputs */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
          <div>
            <label style={{ fontSize: '10.5px', fontWeight: 800, color: '#8e8e93', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
              FROM
            </label>
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1.5px solid #e5e5ea',
                background: '#f9f9f9',
                fontSize: '14px',
                fontWeight: 600,
                outline: 'none',
              }}
            />
          </div>
          <div>
            <label style={{ fontSize: '10.5px', fontWeight: 800, color: '#8e8e93', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
              TO
            </label>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1.5px solid #e5e5ea',
                background: '#f9f9f9',
                fontSize: '14px',
                fontWeight: 600,
                outline: 'none',
              }}
            />
          </div>
        </div>

        {/* Apply Button */}
        <button
          onClick={handleApply}
          style={{
            width: '100%',
            padding: '13px',
            borderRadius: '10px',
            background: '#1d9e75',
            color: '#fff',
            fontSize: '14.5px',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Apply
        </button>
      </div>
    </div>
  )
}
