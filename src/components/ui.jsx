// Tiny shared primitives used across tabs.

export function Card({ className = '', children }) {
  return (
    <div className={`rounded-2xl bg-surface border border-border p-4 ${className}`}>
      {children}
    </div>
  )
}

export function SectionTitle({ children, right }) {
  return (
    <div className="flex items-center justify-between mb-2 mt-4 first:mt-0">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">{children}</h2>
      {right}
    </div>
  )
}

export function NumberInput({ value, onChange, placeholder = '', step = '1', className = '', ariaLabel, suffix }) {
  return (
    <div className={`relative ${className}`}>
      <input
        aria-label={ariaLabel}
        type="number"
        inputMode="decimal"
        step={step}
        value={value == null || Number.isNaN(value) ? '' : value}
        placeholder={placeholder}
        onChange={(e) => {
          const v = e.target.value
          onChange(v === '' ? null : Number(v))
        }}
        className="w-full min-h-[44px] rounded-xl bg-surface2 border border-border px-3 text-base text-text focus:border-accent focus:outline-none"
      />
      {suffix && (
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted">
          {suffix}
        </span>
      )}
    </div>
  )
}

export function TextArea({ value, onChange, placeholder = '', rows = 2, className = '', ariaLabel }) {
  return (
    <textarea
      aria-label={ariaLabel}
      rows={rows}
      value={value ?? ''}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full rounded-xl bg-surface2 border border-border px-3 py-2.5 text-base text-text focus:border-accent focus:outline-none resize-none ${className}`}
    />
  )
}

export function Stepper({ value, onChange, step = 0.1, min = 0, max = 999, suffix = '', ariaLabel }) {
  const current = value == null || Number.isNaN(value) ? 0 : Number(value)
  const dec = () => onChange(Math.max(min, +(current - step).toFixed(2)))
  const inc = () => onChange(Math.min(max, +(current + step).toFixed(2)))
  return (
    <div className="flex items-stretch gap-2">
      <button
        type="button"
        onClick={dec}
        aria-label={`${ariaLabel || 'valore'} meno`}
        className="min-w-[44px] min-h-[44px] rounded-xl bg-surface2 border border-border text-xl text-text active:bg-border"
      >
        −
      </button>
      <NumberInput
        value={value}
        onChange={onChange}
        step={String(step)}
        ariaLabel={ariaLabel}
        suffix={suffix}
        className="flex-1"
      />
      <button
        type="button"
        onClick={inc}
        aria-label={`${ariaLabel || 'valore'} più`}
        className="min-w-[44px] min-h-[44px] rounded-xl bg-surface2 border border-border text-xl text-text active:bg-border"
      >
        +
      </button>
    </div>
  )
}

export function Toggle({ checked, onChange, label, sublabel }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between rounded-xl bg-surface2 border border-border px-4 py-3 min-h-[56px]"
    >
      <div className="text-left">
        <div className="text-base text-text">{label}</div>
        {sublabel && <div className="text-xs text-muted mt-0.5">{sublabel}</div>}
      </div>
      <span
        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
          checked ? 'bg-accent' : 'bg-border'
        }`}
      >
        <span
          className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-5' : 'translate-x-0.5'
          }`}
        />
      </span>
    </button>
  )
}

export function PrimaryButton({ children, onClick, type = 'button', className = '', disabled }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`w-full min-h-[52px] rounded-2xl bg-accent text-bg font-semibold text-base active:bg-accent-soft disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  )
}

export function GhostButton({ children, onClick, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full min-h-[48px] rounded-2xl bg-surface2 border border-border text-text font-medium active:bg-border ${className}`}
    >
      {children}
    </button>
  )
}

export function ProgressBar({ value, max, label, suffix = '', kind = 'accent' }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0
  const color = kind === 'good' ? 'bg-good' : kind === 'warn' ? 'bg-warn' : kind === 'bad' ? 'bg-bad' : 'bg-accent'
  return (
    <div>
      <div className="flex items-baseline justify-between text-xs text-muted mb-1">
        <span>{label}</span>
        <span>
          <span className="text-text font-medium">{Math.round(value)}</span>
          <span> / {max}{suffix}</span>
        </span>
      </div>
      <div className="h-2 rounded-full bg-surface2 overflow-hidden">
        <div className={`h-full ${color} transition-all`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
