import { lastNDays, formatItDateLong, todayKey } from './dates.js'
import { totalsForDay } from './storage.js'
import { weeklyStats } from './aggregate.js'
import { PROFILE, TARGETS, MEAL_SLOTS } from './profile.js'

function fmt(n, digits = 1) {
  if (n == null || Number.isNaN(n)) return '—'
  return Number(n).toFixed(digits)
}

export function buildWeeklyMarkdown(state, anchorKey = todayKey()) {
  const days = lastNDays(7, anchorKey)
  const stats = weeklyStats(state, anchorKey)
  const last = days[days.length - 1]
  const first = days[0]

  const lines = []
  lines.push('# BodyLog — Report Settimanale')
  lines.push('')
  lines.push(`**Periodo:** ${formatItDateLong(first)} → ${formatItDateLong(last)}`)
  lines.push('')
  lines.push('## Profilo utente')
  lines.push(`- Nome: ${PROFILE.name}, ${PROFILE.age} anni, ${PROFILE.height_cm} cm`)
  lines.push(`- Obiettivo: ${PROFILE.goal}`)
  lines.push(`- TDEE stimato: ${PROFILE.tdee_kcal} kcal`)
  lines.push(`- Target: ${TARGETS.kcal_min}-${TARGETS.kcal_max} kcal/giorno, ${TARGETS.protein_min}-${TARGETS.protein_max}g proteine`)
  lines.push(`- Allenamento target: ${PROFILE.training}`)
  lines.push(`- Vincoli: ${PROFILE.constraints}`)
  lines.push('')
  lines.push('## Riassunto settimana')
  lines.push(`- Peso medio: **${fmt(stats.weight_avg, 2)} kg** (settimana scorsa ${fmt(stats.weight_avg_prev, 2)} kg, delta ${stats.weight_delta != null ? (stats.weight_delta >= 0 ? '+' : '') + fmt(stats.weight_delta, 2) : '—'} kg)`)
  lines.push(`- Kcal medie: **${fmt(stats.kcal_avg, 0)}** (target ${TARGETS.kcal_mid})`)
  lines.push(`- Proteine medie: **${fmt(stats.protein_avg, 0)}g** (target ${TARGETS.protein_mid}g)`)
  lines.push(`- Allenamenti completati: **${stats.workouts}** / 7 giorni`)
  lines.push(`- Giorni loggati: ${stats.days_logged} / 7`)
  lines.push('')
  lines.push('## Dettaglio giornaliero')
  for (const key of days) {
    const d = state.days[key]
    lines.push('')
    lines.push(`### ${formatItDateLong(key)}`)
    if (!d) {
      lines.push('_(nessun dato)_')
      continue
    }
    if (d.weight_kg != null) lines.push(`- Peso: ${fmt(d.weight_kg, 2)} kg${d.weighed_morning ? ' (mattino, a digiuno)' : ''}`)
    const t = totalsForDay(d)
    lines.push(`- Totali: ${t.kcal} kcal · ${t.protein}g prot · ${t.carb}g carb`)
    if (d.sleep_h != null) lines.push(`- Sonno: ${d.sleep_h}h`)
    if (d.workout.done) {
      lines.push(`- Allenamento: ${d.workout.type || 'sì'}${d.workout.notes ? ` — ${d.workout.notes}` : ''}`)
    } else {
      lines.push('- Allenamento: rest')
    }
    const mealLines = []
    for (const slot of MEAL_SLOTS) {
      const m = d.meals[slot.key]
      if (!m || (!m.text && !m.kcal && !m.protein_g)) continue
      mealLines.push(`  - **${slot.label}:** ${m.text || '—'} · ${m.kcal || 0} kcal · ${m.protein_g || 0}g prot · ${m.carb_g || 0}g carb`)
    }
    if (mealLines.length) {
      lines.push('- Pasti:')
      lines.push(...mealLines)
    }
    if (d.notes) lines.push(`- Note: ${d.notes}`)
  }
  lines.push('')
  lines.push('## Richiesta')
  lines.push('Sulla base dei dati sopra, dammi:')
  lines.push('1. Valutazione del progresso settimanale rispetto al target di lean bulk (gain 0.25-0.40 kg/sett)')
  lines.push('2. Aggiustamenti specifici a kcal e macro per la prossima settimana')
  lines.push('3. Pattern problematici (giorni sotto target, pasti mancanti, sonno scarso)')
  lines.push('4. Suggerimenti su distribuzione pasti / timing proteine')
  lines.push('')
  return lines.join('\n')
}

export function downloadJsonBackup(state) {
  const blob = new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), state }, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `bodylog-backup-${todayKey()}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
