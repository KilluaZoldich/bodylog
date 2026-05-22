import { AreaChart, Area, ResponsiveContainer, YAxis, XAxis, Tooltip } from 'recharts'
import { TrendingUp, TrendingDown, Minus, Plus, Flame, Beef, Dumbbell } from 'lucide-react'
import { weeklyStats, weightSeries, deltaBand, currentWeight } from '../lib/aggregate.js'
import { PrimaryButton } from '../components/ui.jsx'
import Masthead from '../components/Masthead.jsx'
import SignatureMark from '../components/SignatureMark.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { useNumberTicker } from '../lib/useNumberTicker.js'

export default function Dashboard({ state, onGoToGiornata }) {
  const stats = weeklyStats(state)
  const series = weightSeries(state, 30)
  const cur = currentWeight(state)
  const band = deltaBand(stats.weight_delta)
  const hasData = cur.weight != null

  const bandColor = {
    good: '#7fb893',
    warn: '#d7b261',
    bad: '#d96d6d',
    unknown: '#9b9aa0',
  }[band]

  const BandIcon =
    stats.weight_delta == null ? Minus :
    stats.weight_delta > 0 ? TrendingUp :
    stats.weight_delta < 0 ? TrendingDown : Minus

  const tickedWeight = useNumberTicker(cur.weight, { digits: 1, duration: 900 })
  const tickedAvg = useNumberTicker(stats.weight_avg, { digits: 2, duration: 900 })
  const tickedKcal = useNumberTicker(stats.kcal_avg, { digits: 0, duration: 800 })
  const tickedProt = useNumberTicker(stats.protein_avg, { digits: 0, duration: 800 })

  return (
    <div className="px-5 pt-5 pb-nav max-w-md mx-auto">
      <Masthead section="Diario" phase="Lean Bulk" state={state} />

      {!hasData ? (
        <EmptyState
          icon={Plus}
          title="La pagina è bianca"
          hint="Registra la prima giornata per dare inizio al diario."
        />
      ) : (
        <>
          {/* ─── ASYMMETRIC HERO ────────────────────────────────────────
              The peso number BREAKS out of the card's left padding.
              The delta floats free as a chip on the right.
              The chart sub-emerges below, blending into the same surface.
          */}
          <section className="relative">
            {/* Hero card body */}
            <div className="glass-prominent rounded-glass-lg overflow-hidden">
              {/* Top header strip */}
              <div className="flex items-baseline justify-between px-6 pt-5 pb-2">
                <span className="label-editorial">Peso · oggi</span>
                <div
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full border tabular-nums"
                  style={{
                    background: `${bandColor}1f`,
                    borderColor: `${bandColor}40`,
                    color: bandColor,
                  }}
                >
                  <BandIcon size={12} strokeWidth={2.6} />
                  <span className="text-[11px] font-semibold tracking-wider">
                    {stats.weight_delta == null
                      ? '— kg'
                      : `${stats.weight_delta >= 0 ? '+' : ''}${stats.weight_delta.toFixed(2)} kg`}
                  </span>
                </div>
              </div>

              {/* The peso — editorial serif at 88px, deliberately overflowing left */}
              <div className="px-6 pb-1 -ml-1">
                <div className="flex items-baseline gap-2">
                  <span className="num-editorial text-[88px] leading-[0.95] font-light text-cream">
                    {tickedWeight}
                  </span>
                  <span className="text-sm text-muted tracking-widest font-medium">KG</span>
                </div>
              </div>

              {/* Sub-stats row, hairline-separated */}
              <div className="grid grid-cols-2 gap-0 mt-4 border-t border-white/[0.06]">
                <div className="px-6 py-3.5 border-r border-white/[0.06]">
                  <div className="label-editorial !text-[9px] mb-1">Media 7gg</div>
                  <div className="num-editorial text-[20px] font-light text-cream">
                    {stats.weight_avg != null ? tickedAvg : '—'}
                    <span className="text-[11px] text-muted ml-1 tracking-widest font-sans">kg</span>
                  </div>
                </div>
                <div className="px-6 py-3.5">
                  <div className="label-editorial !text-[9px] mb-1">Sett. scorsa</div>
                  <div className="num-editorial text-[20px] font-light text-cream">
                    {stats.weight_avg_prev != null ? stats.weight_avg_prev.toFixed(2) : '—'}
                    <span className="text-[11px] text-muted ml-1 tracking-widest font-sans">kg</span>
                  </div>
                </div>
              </div>

              {/* Chart sub-emerging — same surface, just darker base, no separate card */}
              <div className="border-t border-white/[0.06] pt-3 pb-2 px-2 bg-black/10">
                <div className="flex items-baseline justify-between px-4 mb-2">
                  <span className="label-editorial !text-[9px]">Trend · 30 giorni</span>
                  <span className="text-[9px] text-faint tracking-wider">
                    {series.filter((s) => s.weight != null).length} pt
                  </span>
                </div>
                <div className="h-28">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={series} margin={{ top: 4, right: 8, bottom: 0, left: 8 }}>
                      <defs>
                        <linearGradient id="weightFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#C9A961" stopOpacity={0.4} />
                          <stop offset="100%" stopColor="#C9A961" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <YAxis hide domain={['dataMin - 0.4', 'dataMax + 0.4']} />
                      <XAxis dataKey="date" hide />
                      <Tooltip
                        contentStyle={{
                          background: 'rgba(20,18,20,0.85)',
                          backdropFilter: 'blur(12px)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: 12,
                          fontSize: 12,
                          padding: '8px 12px',
                        }}
                        labelStyle={{ color: '#9b9aa0', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase' }}
                        itemStyle={{ color: '#F5F3EE' }}
                        formatter={(v) => [`${v} kg`, 'Peso']}
                      />
                      <Area
                        type="monotone"
                        dataKey="weight"
                        stroke="#C9A961"
                        strokeWidth={1.8}
                        fill="url(#weightFill)"
                        dot={false}
                        activeDot={{ r: 4, fill: '#E8C982', stroke: '#08080a', strokeWidth: 2 }}
                        connectNulls
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </section>

          {/* ─── 3 metric tiles ─────────────────────────────── */}
          <div className="mt-4 grid grid-cols-3 gap-2">
            <Tile icon={Flame} label="Kcal medie" value={stats.kcal_avg != null ? tickedKcal : '—'} />
            <Tile icon={Beef} label="Proteine" value={stats.protein_avg != null ? `${tickedProt}g` : '—'} />
            <Tile icon={Dumbbell} label="Sessioni" value={`${stats.workouts}/7`} />
          </div>

          <div className="mt-7">
            <PrimaryButton onClick={onGoToGiornata}>
              <span className="inline-flex items-center justify-center gap-2">
                <Plus size={18} strokeWidth={2.4} />
                Registra oggi
              </span>
            </PrimaryButton>
          </div>

          <p className="text-[10px] text-faint tracking-wider text-center mt-5 uppercase">
            {stats.days_logged}/7 giorni loggati questa settimana
          </p>
        </>
      )}

      {!hasData && (
        <div className="mt-6">
          <PrimaryButton onClick={onGoToGiornata}>
            <span className="inline-flex items-center justify-center gap-2">
              <Plus size={18} strokeWidth={2.4} /> Inizia
            </span>
          </PrimaryButton>
        </div>
      )}

      <SignatureMark />
    </div>
  )
}

function Tile({ icon: Icon, label, value }) {
  return (
    <div className="glass-regular rounded-glass p-3 text-center">
      <Icon size={15} className="mx-auto text-accent mb-1.5" strokeWidth={1.7} />
      <div className="num-editorial text-[20px] font-light text-cream leading-none">{value}</div>
      <div className="label-editorial !text-[8px] mt-1.5">{label}</div>
    </div>
  )
}
