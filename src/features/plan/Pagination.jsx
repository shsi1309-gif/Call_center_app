import { ChevronLeft, ChevronRight } from 'lucide-react'

export function Pagination({ page, pages, onChange }) {
  return (
    <nav className="pager" aria-label="Pagination">
      <button className="pager__btn" onClick={() => onChange(page - 1)} disabled={page <= 1} aria-label="Previous page">
        <ChevronLeft size={16} />
      </button>
      <span className="pager__label" aria-live="polite">
        Page {page} of {pages}
      </span>
      <button className="pager__btn" onClick={() => onChange(page + 1)} disabled={page >= pages} aria-label="Next page">
        <ChevronRight size={16} />
      </button>
    </nav>
  )
}
