import { useId, useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'

export function CollapsibleSection({ title, tone, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen)
  const bodyId = useId()

  return (
    <section className={`fold fold--${tone}`}>
      <button className="fold__head" aria-expanded={open} aria-controls={bodyId} onClick={() => setOpen((o) => !o)}>
        <span>{title}</span>
        {open ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
      </button>
      {open && (
        <div className="fold__body" id={bodyId}>
          {children}
        </div>
      )}
    </section>
  )
}
