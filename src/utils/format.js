export const formatRupees = (n) => `₹${n.toLocaleString('en-IN')}`

export function formatTimer(totalSeconds) {
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function nowTime(date = new Date()) {
  const h = date.getHours()
  const m = String(date.getMinutes()).padStart(2, '0')
  return `${h % 12 || 12}:${m}${h >= 12 ? 'pm' : 'am'}`
}
