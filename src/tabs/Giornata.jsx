import { useMemo, useState } from 'react'
import { ChevronDown, ChevronRight, Check } from 'lucide-react'
import { todayKey, formatItDateLong } from '../lib/dates.js'
import { getDay, setDay, totalsForDay } from '../lib/storage.js'
import { MEAL_SLOTS, WORKOUT_TYPES, TARGETS } from '../lib/profile.js'
import { Card, SectionTitle, NumberInput, TextArea, Stepper, Toggle, PrimaryButton, ProgressBar } from '../components/ui.jsx'
import { useToast } from '../components/Toast.jsx'

export default function Giornata({ state, setState }) {
  const [dateKey, setDateKey] = useState(todayKey())
  const day = useMemo(() => getDay(state, dateKey), [state, dateKey])
  const { show } = useToast()

  function update(patch) {
    setState((prev) => setDay(prev, dateKey, { ...getDay(prev, dateKey), ...patch }))
  }

  function updateMeal(slot, patch) {
    const current = getDay(state, dateKey)
    update({
      meals: {
        ...current.meals,
        [slot]: { ...current.meals[slot], ...patch },
      },
    })
  }

  function updateWorkout(patch) {
    update({ workout: { ...day.workout, ...patch } })
  }

  const totals = totalsForDay(day)

  function save() {
    // setDay already runs on every change; this is just for UX feedback.
    setState((prev) => setDay(prev, dateKey, getDay(prev, dateKey)))
    show('Giornata salvata', { kind: 'success' })
  }

  return (
    <div className="px-4 pt-4 pb-44 max-w-md mx-auto">
      <header className="mb-4">
        <h1 className="text-2xl font-bold text-text">Giornata</h1>
        <p className="text-sm text-muted mt-0.5">{formatItDateLong(dateKey)}</p>
      </header>

      <Card>
        <label className="block text-xs uppercase tracking-wider text-muted mb-2">Data</label>
        <input
          type="date"
          value={dateKey}
          onChange={(e) => setDateKey(e.target.value)}
          className="w-full min-h-[44px] rounded-xl bg-surface2 border border-border px-3 text-base text-text"
        />
      </Card>

      <SectionTitle>Peso</SectionTitle>
      <Card>
        <Stepper
          value={day.weight_kg}
          onChange={(v) => update({ weight_kg: v })}
          step={0.1}
          min={0}
          max={250}
          suffix="kg"
          ariaLabel="Peso in kg"
        />
        <div className="mt-3">
          <Toggle
            checked={!!day.weighed_morning}
            onChange={(v) => update({ weighed_morning: v })}
            label="Pesato al mattino"
            sublabel="A digiuno, dopo bagno"
          />
        </div>
      </Card>

      <SectionTitle>Pasti</SectionTitle>
      <div className="space-y-2">
        {MEAL_SLOTS.map((slot) => (
          <MealCard
            key={slot.key}
            slot={slot}
            meal={day.meals[slot.key]}
            onChange={(patch) => updateMeal(slot.key, patch)}
          />
        ))}
      </div>

      <SectionTitle>Allenamento</SectionTitle>
      <Card>
        <Toggle
          checked={!!day.workout.done}
          onChange={(v) => updateWorkout({ done: v })}
          label="Oggi palestra"
          sublabel={day.workout.done ? 'Sessione registrata' : 'Rest day'}
        />
        {day.workout.done && (
          <div className="mt-3 space-y-2">
            <select
              value={day.workout.type}
              onChange={(e) => updateWorkout({ type: e.target.value })}
              className="w-full min-h-[44px] rounded-xl bg-surface2 border border-border px-3 text-base text-text"
              aria-label="Tipo allenamento"
            >
              <option value="">Tipo sessione…</option>
              {WORKOUT_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <TextArea
              value={day.workout.notes}
              onChange={(v) => updateWorkout({ notes: v })}
              placeholder="Note esercizi top (es: panca 80x6x4, +2kg vs settimana scorsa)"
              rows={3}
              ariaLabel="Note esercizi"
            />
          </div>
        )}
      </Card>

      <SectionTitle>Sonno</SectionTitle>
      <Card>
        <Stepper
          value={day.sleep_h}
          onChange={(v) => update({ sleep_h: v })}
          step={0.5}
          min={0}
          max={12}
          suffix="h"
          ariaLabel="Ore di sonno"
        />
      </Card>

      <SectionTitle>Note</SectionTitle>
      <Card>
        <TextArea
          value={day.notes}
          onChange={(v) => update({ notes: v })}
          placeholder="Energia, fame, stress, umore…"
          rows={3}
          ariaLabel="Note giornata"
        />
      </Card>

      <div className="mt-6">
        <PrimaryButton onClick={save}>Salva giornata</PrimaryButton>
        <p className="text-xs text-muted text-center mt-2">I dati vengono salvati automaticamente a ogni modifica.</p>
      </div>

      <DayFooter totals={totals} />
    </div>
  )
}

function MealCard({ slot, meal, onChange }) {
  const hasContent = meal.text || meal.kcal || meal.protein_g
  const [open, setOpen] = useState(false)

  return (
    <div className="rounded-2xl bg-surface border border-border overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 min-h-[56px]"
      >
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex h-6 w-6 items-center justify-center rounded-full border-2 ${
              meal.done ? 'bg-good border-good text-bg' : 'border-border text-transparent'
            }`}
          >
            <Check size={14} />
          </span>
          <span className="text-base font-medium text-text">{slot.label}</span>
          {hasContent && !open && (
            <span className="text-xs text-muted">
              {meal.kcal || 0} kcal · {meal.protein_g || 0}g
            </span>
          )}
        </div>
        {open ? <ChevronDown size={20} className="text-muted" /> : <ChevronRight size={20} className="text-muted" />}
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-2 border-t border-border pt-3">
          <TextArea
            value={meal.text}
            onChange={(v) => onChange({ text: v })}
            placeholder="Cosa ho mangiato"
            rows={2}
            ariaLabel={`${slot.label} cosa ho mangiato`}
          />
          <div className="grid grid-cols-3 gap-2">
            <NumberInput value={meal.kcal} onChange={(v) => onChange({ kcal: v })} placeholder="kcal" ariaLabel={`${slot.label} kcal`} suffix="kcal" />
            <NumberInput value={meal.protein_g} onChange={(v) => onChange({ protein_g: v })} placeholder="prot" ariaLabel={`${slot.label} proteine`} suffix="g" />
            <NumberInput value={meal.carb_g} onChange={(v) => onChange({ carb_g: v })} placeholder="carb" ariaLabel={`${slot.label} carboidrati`} suffix="g" />
          </div>
          <button
            type="button"
            onClick={() => onChange({ done: !meal.done })}
            className={`w-full min-h-[44px] rounded-xl border text-sm font-medium ${
              meal.done
                ? 'bg-good/15 border-good/40 text-good'
                : 'bg-surface2 border-border text-muted'
            }`}
          >
            {meal.done ? 'Fatto ✓' : 'Segna come fatto'}
          </button>
        </div>
      )}
    </div>
  )
}

function DayFooter({ totals }) {
  const kcalKind = totals.kcal === 0 ? 'accent' : totals.kcal < TARGETS.kcal_min ? 'warn' : totals.kcal > TARGETS.kcal_max + 200 ? 'warn' : 'good'
  const protKind = totals.protein === 0 ? 'accent' : totals.protein < TARGETS.protein_min ? 'warn' : 'good'

  return (
    <div
      className="fixed inset-x-0 z-30 bg-bg/95 backdrop-blur-md border-t border-border"
      style={{ bottom: 'calc(env(safe-area-inset-bottom) + 64px)' }}
    >
      <div className="max-w-md mx-auto px-4 py-3 space-y-2">
        <ProgressBar value={totals.kcal} max={TARGETS.kcal_mid} label="Kcal oggi" suffix="" kind={kcalKind} />
        <ProgressBar value={totals.protein} max={TARGETS.protein_mid} label="Proteine" suffix="g" kind={protKind} />
      </div>
    </div>
  )
}
