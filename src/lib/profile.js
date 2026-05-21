// Default user profile + targets. Hardcoded since this is a single-user local app.
export const PROFILE = {
  name: 'Metin',
  age: 25,
  height_cm: 175,
  start_weight_kg: 65,
  goal: 'lean bulk, ipertrofia V-shape',
  tdee_kcal: 2500,
  constraints: 'no pesce/frutti di mare',
  training: '3-4 sessioni/settimana',
}

export const TARGETS = {
  kcal_min: 2700,
  kcal_max: 2800,
  kcal_mid: 2750,
  protein_min: 140,
  protein_max: 165,
  protein_mid: 150,
  // expected weekly weight gain band, kg
  weekly_gain_min: 0.25,
  weekly_gain_max: 0.40,
}

export const WORKOUT_TYPES = ['Push', 'Pull', 'Legs', 'Upper', 'Lower', 'Full Body']

export const MEAL_SLOTS = [
  { key: 'breakfast', label: 'Colazione' },
  { key: 'lunch', label: 'Pranzo' },
  { key: 'snack', label: 'Spuntino' },
  { key: 'dinner', label: 'Cena' },
]
