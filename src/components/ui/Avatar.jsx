export function Avatar({ initials, size = 'md', background = '#e1f5ee', color = '#0f6e56' }) {
  return (
    <span className={`avatar avatar--${size}`} style={{ background, color }} aria-hidden="true">
      {initials}
    </span>
  )
}
