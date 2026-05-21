// Local persistence layer. Single root key in localStorage; no sync, no backend.

const ROOT_KEY = 'bodylog.v1'

const EMPTY_STATE = {
  version: 1,
  // map of YYYY-MM-DD -> day record
  days: {},
  // array of monthly measurement records
  measurements: [],
  // array of progress photos: { id, dateKey, dataUrl, sizeBytes, note }
  photos: [],
}

export function loadState() {
  try {
    const raw = localStorage.getItem(ROOT_KEY)
    if (!raw) return structuredClone(EMPTY_STATE)
    const parsed = JSON.parse(raw)
    return { ...EMPTY_STATE, ...parsed }
  } catch {
    return structuredClone(EMPTY_STATE)
  }
}

export function saveState(state) {
  localStorage.setItem(ROOT_KEY, JSON.stringify(state))
}

export function emptyDay(dateKey) {
  return {
    date: dateKey,
    weight_kg: null,
    weighed_morning: false,
    meals: {
      breakfast: emptyMeal(),
      lunch: emptyMeal(),
      snack: emptyMeal(),
      dinner: emptyMeal(),
    },
    workout: {
      done: false,
      type: '',
      notes: '',
    },
    sleep_h: null,
    notes: '',
    updatedAt: null,
  }
}

function emptyMeal() {
  return { text: '', kcal: null, protein_g: null, carb_g: null, done: false }
}

export function getDay(state, dateKey) {
  return state.days[dateKey] ?? emptyDay(dateKey)
}

export function setDay(state, dateKey, day) {
  return {
    ...state,
    days: { ...state.days, [dateKey]: { ...day, date: dateKey, updatedAt: Date.now() } },
  }
}

export function totalsForDay(day) {
  let kcal = 0
  let protein = 0
  let carb = 0
  for (const slot of Object.keys(day.meals)) {
    const m = day.meals[slot]
    if (m.kcal != null) kcal += Number(m.kcal) || 0
    if (m.protein_g != null) protein += Number(m.protein_g) || 0
    if (m.carb_g != null) carb += Number(m.carb_g) || 0
  }
  return { kcal, protein, carb }
}
