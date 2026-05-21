import { addDays, todayKey, toKey, fromKey, lastNDays } from './dates.js'
import { totalsForDay } from './storage.js'

// Average over array, treating null/0-no-data as missing.
function avg(values) {
  const filtered = values.filter((v) => v != null && !Number.isNaN(v))
  if (!filtered.length) return null
  return filtered.reduce((a, b) => a + b, 0) / filtered.length
}

export function weightSeries(state, n = 30) {
  return lastNDays(n).map((key) => ({
    date: key,
    weight: state.days[key]?.weight_kg ?? null,
  }))
}

export function weeklyStats(state, anchorKey = todayKey()) {
  const thisWeek = lastNDays(7, anchorKey)
  const lastWeek = thisWeek.map((k) => addDays(k, -7))

  const collectWeights = (keys) => keys.map((k) => state.days[k]?.weight_kg).filter((v) => v != null)
  const collectKcal = (keys) => keys.map((k) => {
    const d = state.days[k]
    if (!d) return null
    const t = totalsForDay(d)
    return t.kcal > 0 ? t.kcal : null
  })
  const collectProtein = (keys) => keys.map((k) => {
    const d = state.days[k]
    if (!d) return null
    const t = totalsForDay(d)
    return t.protein > 0 ? t.protein : null
  })
  const countWorkouts = (keys) => keys.reduce((acc, k) => acc + (state.days[k]?.workout?.done ? 1 : 0), 0)

  const w1 = avg(collectWeights(thisWeek))
  const w0 = avg(collectWeights(lastWeek))
  const delta = (w1 != null && w0 != null) ? (w1 - w0) : null

  return {
    weight_avg: w1,
    weight_avg_prev: w0,
    weight_delta: delta,
    kcal_avg: avg(collectKcal(thisWeek)),
    protein_avg: avg(collectProtein(thisWeek)),
    workouts: countWorkouts(thisWeek),
    days_logged: thisWeek.filter((k) => state.days[k]).length,
  }
}

export function deltaBand(delta) {
  if (delta == null) return 'unknown'
  if (delta >= 0.25 && delta <= 0.40) return 'good'
  if (delta > 0 && delta < 0.25) return 'warn'
  if (delta > 0.40) return 'warn' // troppo veloce, anche warn
  return 'bad'
}

export function currentWeight(state) {
  // Most recent weight in the last 14 days
  for (let i = 0; i < 14; i++) {
    const key = addDays(todayKey(), -i)
    const w = state.days[key]?.weight_kg
    if (w != null) return { weight: w, date: key }
  }
  return { weight: null, date: null }
}

export function lastNDaysWithData(state, n) {
  return lastNDays(n).filter((k) => state.days[k])
}
