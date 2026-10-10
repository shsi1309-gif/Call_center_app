import { useEffect, useId, useRef } from 'react'
import { X } from 'lucide-react'

/** Accessible dialog: Escape + backdrop close, focus moved in on open and restored on close. */
export function Modal({ title, subtitle, icon, onClose, children, headerBackground }) {
  const titleId = useId()
  const dialogRef = useRef(null)
  useEffect(() => {
    const previous = document.activeElement
    dialogRef.current?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      previous?.focus()
    }
  }, [onClose])

  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="dialog" role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1} ref={dialogRef}>
        <div className="dialog__head" style={headerBackground ? { background: headerBackground } : undefined}>
          {icon}
          <div>
            <h2 className="dialog__title" id={titleId}>
              {title}
            </h2>
            {subtitle && <div className="dialog__sub">{subtitle}</div>}
          </div>
          <button className="dialog__close" onClick={onClose} aria-label="Close dialog">
            <X size={16} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
