import { formatItDateLong } from '../lib/dates.js'
import { dayNumber } from '../lib/journey.js'

/**
 * Editorial masthead: tiny wordmark + date + day-counter + phase.
 * Mounted at the top of every tab. Newspaper-masthead feel.
 *
 * Layout:
 *   BODYLOG · Vol. I              martedì, 22 maggio 2026
 *   ─────────────────────────────────────────────────────
 *   Section title (overridden by parent)        Day 047
 */
export default function Masthead({ section, phase = 'Lean Bulk', state }) {
  const today = new Date()
  const dateLong = today.toLocaleDateString('it-IT', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  })
  const day = dayNumber(state)

  return (
    <header className="mb-7">
      {/* Top row: wordmark + date */}
      <div className="flex items-baseline justify-between mb-3">
        <div className="flex items-baseline gap-2">
          <span className="font-editorial text-[19px] font-medium text-cream tracking-tight">
            BodyLog
          </span>
          <span className="label-editorial !text-[8px]">Vol. I</span>
        </div>
        <span className="text-[10px] text-faint tracking-wider lowercase">{dateLong}</span>
      </div>

      {/* Hairline */}
      <div className="h-px hairline mb-3" />

      {/* Bottom row: section + day counter + phase */}
      <div className="flex items-baseline justify-between">
        <div>
          <div className="label-editorial !text-[9px] mb-0.5">{phase}</div>
          <h1 className="font-editorial text-[28px] leading-none text-cream font-medium tracking-tight">
            {section}
          </h1>
        </div>
        {day != null && (
          <div className="text-right">
            <div className="label-editorial !text-[8px]">Day</div>
            <div className="font-editorial text-[20px] text-accent leading-none tabular-nums mt-1">
              {String(day).padStart(3, '0')}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
