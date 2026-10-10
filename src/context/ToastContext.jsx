import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { CheckCircle2 } from 'lucide-react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const nextId = useRef(1)
  const show = useCallback((payload) => {
    const id = nextId.current++
    setToasts((t) => [...t, { id, payload }])
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000)
  }, [])
  const value = useMemo(() => show, [show])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toasts" role="status" aria-live="polite" style={{ bottom: '62px', zIndex: 900 }}>
        {toasts.map((t) => {
          if (typeof t.payload === 'object' && t.payload !== null && t.payload.title) {
            return (
              <div
                className="toast toast--rich"
                key={t.id}
                style={{
                  background: '#0f172a',
                  color: '#ffffff',
                  borderRadius: '14px',
                  padding: '10px 18px',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  minWidth: '280px',
                  maxWidth: '90vw',
                  border: '1px solid #334155',
                }}
              >
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#34d399',
                    flexShrink: 0,
                  }}
                >
                  <CheckCircle2 size={18} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '13.5px', color: '#ffffff' }}>
                    {t.payload.title}
                  </div>
                  {t.payload.subtitle && (
                    <div style={{ fontSize: '12px', color: '#34d399', fontWeight: 600, marginTop: '2px' }}>
                      {t.payload.subtitle}
                    </div>
                  )}
                </div>
              </div>
            )
          }

          return (
            <div className="toast" key={t.id}>
              {t.payload}
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
