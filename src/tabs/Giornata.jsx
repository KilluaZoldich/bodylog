import { useMemo, useState } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { todayKey, formatItDateLong } from '../lib/dates.js'
import { getDay, setDay, totalsForDay } from '../lib/storage.js'
import { MEAL_SLOTS, WORKOUT_TYPES, TARGETS } from '../lib/profile.js'
import { Card, SectionTitle, NumberInput, TextArea, Stepper, Toggle, PrimaryButton, ProgressBar } from '../components/ui.jsx'
import { useToast } from '../components/Toast.jsx'
import Masthead from '../components/Masthead.jsx'
import SignatureMark from '../components/SignatureMark.jsx'
import { success as hapticSuccess, tap as hapticTap } from '../lib/haptics.js'

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
      meals: { ...current.meals, [slot]: { ...current.meals[slot], ...patch } },
    })
  }

  function updateWorkout(patch) {
    update({ workout: { ...day.workout, ...patch } })
  }

  const totals = totalsForDay(day)

  function save() {
    setState((prev) => setDay(prev, dateKey, getDay(prev, dateKey)))
    hapticSuccess()
    show('Giornata salvata', { kind: 'success' })
  }

  return (
    <div className="px-5 pt-5 pb-[210px] max-w-md mx-auto">
      <Masthead section="Giornata" phase={formatItDateLong(dateKey).split(',')[0]} state={state} />

      <Card>
        <label className="label-editorial block mb-2">Data</label>
        <input
          type="date"
          value={dateKey}
          onChange={(e) => setDateKey(e.target.value)}
          className="w-full min-h-[48px] rounded-glass-sm glass-clear px-4 text-base text-cream"
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
            onChange={(v) => { update({ weighed_morning: v }); hapticTap() }}
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
          onChange={(v) => { updateWorkout({ done: v }); hapticTap() }}
          label="Oggi palestra"
          sublabel={day.workout.done ? 'Sessione registrata' : 'Rest day'}
        />
        {day.workout.done && (
          <div className="mt-3 space-y-2">
            <select
              value={day.workout.type}
              onChange={(e) => updateWorkout({ type: e.target.value })}
              className="w-full min-h-[48px] rounded-glass-sm glass-clear px-4 text-base text-cream"
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
        <p className="text-[10px] text-faint tracking-wider text-center mt-3 uppercase">
          Auto-save attivo
        </p>
      </div>

      <SignatureMark />
      <DayFooter totals={totals} />
    </div>
  )
}

function MealCard({ slot, meal, onChange }) {
  const hasContent = meal.text || meal.kcal || meal.protein_g
  const [open, setOpen] = useState(false)

  return (
    <div className="glass-regular rounded-glass-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="press w-full flex items-center justify-between px-5 py-4 min-h-[64px]"
      >
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex h-7 w-7 items-center justify-center rounded-full border transition-all ${
              meal.done
                ? 'bg-good/20 border-good text-good'
                : 'border-white/15 text-transparent'
            }`}
          >
            <Check size={14} strokeWidth={3} />
          </span>
          <div className="text-left">
            <div className="font-editorial text-[17px] font-medium text-cream tracking-tight">
              {slot.label}
            </div>
            {hasContent && (
              <div className="text-[11px] text-muted tabular-nums tracking-wide mt-0.5">
                {meal.kcal || 0} kcal · {meal.protein_g || 0}g prot
              </div>
            )}
          </div>
        </div>
        <ChevronDown
          size={18}
          className={`text-muted transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="px-5 pb-5 space-y-3 border-t border-white/[0.06] pt-4">
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
            onClick={() => { onChange({ done: !meal.done }); hapticTap() }}
            className={`press w-full min-h-[44px] rounded-glass-sm text-[13px] font-medium tracking-wide transition-colors ${
              meal.done
                ? 'bg-good/15 border border-good/40 text-good'
                : 'glass-clear text-muted'
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
      className="fixed inset-x-0 z-30 flex justify-center pointer-events-none px-4"
      style={{ bottom: 'calc(env(safe-area-inset-bottom) + 90px)' }}
    >
      <div className="pointer-events-auto glass-prominent rounded-glass-lg px-5 py-4 w-full max-w-md space-y-3">
        <ProgressBar value={totals.kcal} max={TARGETS.kcal_mid} label="Kcal oggi" suffix="" kind={kcalKind} />
        <ProgressBar value={totals.protein} max={TARGETS.protein_mid} label="Proteine" suffix="g" kind={protKind} />
      </div>
    </div>
  )
}
