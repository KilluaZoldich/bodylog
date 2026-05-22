// Days since the user first logged anything — like an editorial "Day 47" stamp.
import { fromKey, toKey } from './dates.js'

export function dayNumber(state) {
  const keys = Object.keys(state.days || {})
  if (keys.length === 0) return null
  const sorted = keys.sort()
  const first = fromKey(sorted[0])
  const today = new Date()
  const diff = Math.floor((toMidnight(today) - toMidnight(first)) / 86400000)
  return diff + 1
}

function toMidnight(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
}
