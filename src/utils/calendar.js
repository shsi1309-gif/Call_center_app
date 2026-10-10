const pad = (n) => String(n).padStart(2, '0')

export const toIso = (year, month, day) => `${year}-${pad(month + 1)}-${pad(day)}`
export const dateToIso = (d) => toIso(d.getFullYear(), d.getMonth(), d.getDate())

export function shiftMonth({ year, month }, delta) {
  const total = year * 12 + month + delta
  return { year: Math.floor(total / 12), month: ((total % 12) + 12) % 12 }
}

/** Grid for a month, Sunday-first. Leading blanks are `null`. */
export function buildMonthGrid({ year, month }) {
  const leading = new Date(year, month, 1).getDay()
  const days = new Date(year, month + 1, 0).getDate()
  const cells = Array.from({ length: leading }, () => null)
  for (let day = 1; day <= days; day += 1) cells.push({ iso: toIso(year, month, day), day })
  return cells
}

export const monthLabel = ({ year, month }) => new Date(year, month, 1).toLocaleString('en-US', { month: 'long', year: 'numeric' })
export const formatLongDate = (iso) => {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })
}
