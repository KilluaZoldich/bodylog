// Date helpers — all keys are YYYY-MM-DD strings, in local TZ.

export function todayKey() {
  return toKey(new Date())
}

export function toKey(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function fromKey(key) {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function addDays(key, n) {
  const d = fromKey(key)
  d.setDate(d.getDate() + n)
  return toKey(d)
}

export function lastNDays(n, anchorKey = todayKey()) {
  const out = []
  for (let i = n - 1; i >= 0; i--) out.push(addDays(anchorKey, -i))
  return out
}

export function formatItDate(key) {
  const d = fromKey(key)
  return d.toLocaleDateString('it-IT', { weekday: 'short', day: '2-digit', month: 'short' })
}

export function formatItDateLong(key) {
  const d = fromKey(key)
  return d.toLocaleDateString('it-IT', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })
}
