import { LineChart, Line, ResponsiveContainer, YAxis, XAxis, Tooltip } from 'recharts'
import { TrendingUp, TrendingDown, Minus, Plus, Flame, Beef, Dumbbell } from 'lucide-react'
import { weeklyStats, weightSeries, deltaBand, currentWeight } from '../lib/aggregate.js'
import { Card, PrimaryButton } from '../components/ui.jsx'
import { PROFILE } from '../lib/profile.js'

export default function Dashboard({ state, onGoToGiornata }) {
  const stats = weeklyStats(state)
  const series = weightSeries(state, 30)
  const cur = currentWeight(state)
  const band = deltaBand(stats.weight_delta)

  const bandColor = {
    good: 'text-good',
    warn: 'text-warn',
    bad: 'text-bad',
    unknown: 'text-muted',
  }[band]

  const bandIcon = stats.weight_delta == null ? Minus : stats.weight_delta > 0 ? TrendingUp : stats.weight_delta < 0 ? TrendingDown : Minus
  const BandIcon = bandIcon

  return (
    <div className="px-4 pt-4 pb-32 max-w-md mx-auto">
      <header className="mb-4">
        <h1 className="text-2xl font-bold text-text">Ciao, {PROFILE.name}</h1>
        <p className="text-sm text-muted mt-0.5">Lean bulk · target {PROFILE.tdee_kcal}+kcal</p>
      </header>

      <Card>
        <div className="flex items-baseline justify-between">
          <div>
            <div className="text-xs uppercase tracking-wider text-muted">Peso attuale</div>
            <div className="text-4xl font-bold text-text mt-1">
              {cur.weight != null ? cur.weight.toFixed(1) : '—'}
              <span className="text-xl text-muted font-normal ml-1">kg</span>
            </div>
          </div>
          <div className={`flex items-center gap-1 ${bandColor}`}>
            <BandIcon size={18} />
            <span className="text-sm font-medium">
              {stats.weight_delta == null
                ? 'no data'
                : `${stats.weight_delta >= 0 ? '+' : ''}${stats.weight_delta.toFixed(2)} kg`}
            </span>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3 pt-3 border-t border-border">
          <Stat label="Media 7gg" value={stats.weight_avg != null ? `${stats.weight_avg.toFixed(2)} kg` : '—'} />
          <Stat label="Settimana scorsa" value={stats.weight_avg_prev != null ? `${stats.weight_avg_prev.toFixed(2)} kg` : '—'} />
        </div>
      </Card>

      <div className="mt-4">
        <Card className="!p-3">
          <div className="text-xs uppercase tracking-wider text-muted mb-2 px-1">Peso ultimi 30 giorni</div>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={series}>
                <YAxis hide domain={['dataMin - 0.5', 'dataMax + 0.5']} />
                <XAxis dataKey="date" hide />
                <Tooltip
                  contentStyle={{ background: '#18181b', border: '1px solid #2a2a2e', borderRadius: 12, fontSize: 12 }}
                  labelStyle={{ color: '#9b9aa0' }}
                  formatter={(v) => [`${v} kg`, 'Peso']}
                  labelFormatter={(d) => d}
                />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="#C9A961"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 4, fill: '#C9A961' }}
                  connectNulls
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <MiniStat icon={Flame} label="kcal/d" value={stats.kcal_avg != null ? Math.round(stats.kcal_avg) : '—'} />
        <MiniStat icon={Beef} label="prot/d" value={stats.protein_avg != null ? `${Math.round(stats.protein_avg)}g` : '—'} />
        <MiniStat icon={Dumbbell} label="sessioni" value={`${stats.workouts}/7`} />
      </div>

      <div className="mt-6">
        <PrimaryButton onClick={onGoToGiornata}>
          <span className="inline-flex items-center justify-center gap-2">
            <Plus size={20} /> Registra oggi
          </span>
        </PrimaryButton>
      </div>

      <p className="text-xs text-muted text-center mt-4">
        {stats.days_logged}/7 giorni loggati questa settimana
      </p>
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wider text-muted">{label}</div>
      <div className="text-base text-text font-medium mt-0.5">{value}</div>
    </div>
  )
}

function MiniStat({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl bg-surface border border-border p-3 text-center">
      <Icon size={18} className="mx-auto text-accent" />
      <div className="text-lg font-bold text-text mt-1">{value}</div>
      <div className="text-[11px] text-muted">{label}</div>
    </div>
  )
}
