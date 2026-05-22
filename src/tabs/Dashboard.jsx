import { AreaChart, Area, ResponsiveContainer, YAxis, XAxis, Tooltip } from 'recharts'
import { TrendingUp, TrendingDown, Minus, Plus, Flame, Beef, Dumbbell } from 'lucide-react'
import { weeklyStats, weightSeries, deltaBand, currentWeight } from '../lib/aggregate.js'
import { Card, PrimaryButton, DisplayNumber } from '../components/ui.jsx'
import { PROFILE } from '../lib/profile.js'

export default function Dashboard({ state, onGoToGiornata }) {
  const stats = weeklyStats(state)
  const series = weightSeries(state, 30)
  const cur = currentWeight(state)
  const band = deltaBand(stats.weight_delta)

  const bandColor = {
    good: '#7fb893',
    warn: '#d7b261',
    bad: '#d96d6d',
    unknown: '#9b9aa0',
  }[band]

  const BandIcon = stats.weight_delta == null ? Minus : stats.weight_delta > 0 ? TrendingUp : stats.weight_delta < 0 ? TrendingDown : Minus

  return (
    <div className="px-5 pt-5 pb-nav max-w-md mx-auto">
      {/* Wordmark header */}
      <header className="mb-7 flex items-center justify-between">
        <div>
          <div className="label-editorial mb-1">BodyLog</div>
          <h1 className="text-2xl font-display font-light text-cream">
            Ciao, <span className="text-accent">{PROFILE.name}</span>
          </h1>
        </div>
        <div className="text-right">
          <div className="label-editorial !text-[9px]">Phase</div>
          <div className="text-xs text-cream font-medium tracking-wide mt-1">Lean Bulk</div>
        </div>
      </header>

      {/* Hero peso card */}
      <Card className="!p-6">
        <div className="label-editorial mb-3">Peso attuale</div>
        <div className="flex items-end justify-between">
          <DisplayNumber
            value={cur.weight != null ? cur.weight.toFixed(1) : '—'}
            unit="kg"
          />
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
            style={{
              background: `${bandColor}1f`,
              border: `1px solid ${bandColor}40`,
              color: bandColor,
            }}
          >
            <BandIcon size={14} strokeWidth={2.4} />
            <span className="text-[12px] font-semibold tracking-wide tabular-nums">
              {stats.weight_delta == null
                ? '— kg'
                : `${stats.weight_delta >= 0 ? '+' : ''}${stats.weight_delta.toFixed(2)} kg`}
            </span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 pt-5 border-t border-white/[0.06]">
          <Stat
            label="Media 7gg"
            value={stats.weight_avg != null ? `${stats.weight_avg.toFixed(2)}` : '—'}
            unit="kg"
          />
          <Stat
            label="Sett. scorsa"
            value={stats.weight_avg_prev != null ? `${stats.weight_avg_prev.toFixed(2)}` : '—'}
            unit="kg"
          />
        </div>
      </Card>

      {/* Chart */}
      <div className="mt-4">
        <Card className="!p-4 !pb-3">
          <div className="flex items-baseline justify-between mb-3 px-1">
            <div className="label-editorial">Peso · 30 giorni</div>
            <div className="text-[10px] text-faint tracking-wider">
              {series.filter((s) => s.weight != null).length} punti
            </div>
          </div>
          <div className="h-36">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={series} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="weightFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#C9A961" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#C9A961" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <YAxis hide domain={['dataMin - 0.5', 'dataMax + 0.5']} />
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
                  strokeWidth={2}
                  fill="url(#weightFill)"
                  dot={false}
                  activeDot={{ r: 4, fill: '#E8C982', stroke: '#08080a', strokeWidth: 2 }}
                  connectNulls
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Mini stats */}
      <div className="mt-4 grid grid-cols-3 gap-2">
        <MiniStat icon={Flame} label="Kcal/d" value={stats.kcal_avg != null ? Math.round(stats.kcal_avg) : '—'} />
        <MiniStat icon={Beef} label="Prot/d" value={stats.protein_avg != null ? `${Math.round(stats.protein_avg)}g` : '—'} />
        <MiniStat icon={Dumbbell} label="Sessioni" value={`${stats.workouts}/7`} />
      </div>

      {/* CTA */}
      <div className="mt-7">
        <PrimaryButton onClick={onGoToGiornata}>
          <span className="inline-flex items-center justify-center gap-2">
            <Plus size={18} strokeWidth={2.5} />
            Registra oggi
          </span>
        </PrimaryButton>
      </div>

      <p className="text-[11px] text-faint tracking-wider text-center mt-5 uppercase">
        {stats.days_logged}/7 giorni loggati
      </p>
    </div>
  )
}

function Stat({ label, value, unit }) {
  return (
    <div>
      <div className="label-editorial !text-[9px] mb-1">{label}</div>
      <div className="flex items-baseline gap-1">
        <span className="text-lg font-display font-light text-cream tabular-nums">{value}</span>
        {unit && <span className="text-[11px] text-muted tracking-wider">{unit}</span>}
      </div>
    </div>
  )
}

function MiniStat({ icon: Icon, label, value }) {
  return (
    <div className="glass rounded-glass p-3 text-center">
      <Icon size={16} className="mx-auto text-accent mb-1.5" strokeWidth={1.8} />
      <div className="text-lg font-display font-light text-cream tabular-nums">{value}</div>
      <div className="label-editorial !text-[9px] mt-0.5">{label}</div>
    </div>
  )
}
