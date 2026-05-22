// Liquid Glass primitives — concentric squircle radii, specular highlights,
// editorial typography. Used everywhere.

export function Card({ className = '', children, as: As = 'div' }) {
  return (
    <As className={`glass rounded-glass-lg p-5 ${className}`}>
      {children}
    </As>
  )
}

export function SectionTitle({ children, right }) {
  return (
    <div className="flex items-center justify-between mt-6 mb-3 first:mt-0 px-1">
      <h2 className="label-editorial">{children}</h2>
      {right}
    </div>
  )
}

export function NumberInput({ value, onChange, placeholder = '', step = '1', className = '', ariaLabel, suffix, align = 'left' }) {
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
        className={`w-full min-h-[48px] rounded-glass-sm glass-inset px-4 text-base font-medium text-cream placeholder:text-faint focus:outline-none focus:border-accent/40 ${
          align === 'center' ? 'text-center' : ''
        } ${suffix ? 'pr-10' : ''}`}
      />
      {suffix && (
        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-muted tracking-wider">
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
      className={`w-full rounded-glass-sm glass-inset px-4 py-3 text-base text-cream placeholder:text-faint focus:outline-none focus:border-accent/40 resize-none ${className}`}
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
        className="press min-w-[48px] min-h-[48px] rounded-glass-sm glass text-xl text-cream font-light"
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
        align="center"
      />
      <button
        type="button"
        onClick={inc}
        aria-label={`${ariaLabel || 'valore'} più`}
        className="press min-w-[48px] min-h-[48px] rounded-glass-sm glass text-xl text-cream font-light"
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
      className="press flex w-full items-center justify-between rounded-glass-sm glass-inset px-4 py-3 min-h-[60px] border border-white/5"
    >
      <div className="text-left">
        <div className="text-base text-cream font-medium">{label}</div>
        {sublabel && <div className="text-[11px] text-muted mt-0.5 tracking-wide">{sublabel}</div>}
      </div>
      <span
        className={`relative inline-flex h-[30px] w-[52px] items-center rounded-full transition-colors duration-300 ${
          checked ? 'bg-accent/90' : 'bg-white/10'
        }`}
        style={{
          boxShadow: checked
            ? 'inset 0 1px 0 rgba(255,255,255,0.25), 0 0 20px -4px rgba(201,169,97,0.5)'
            : 'inset 0 1px 0 rgba(255,255,255,0.06)',
        }}
      >
        <span
          className={`inline-block h-[26px] w-[26px] transform rounded-full bg-cream shadow-md transition-transform duration-300 ${
            checked ? 'translate-x-[24px]' : 'translate-x-[2px]'
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
      className={`press w-full min-h-[56px] rounded-glass text-ink-950 font-semibold text-[15px] tracking-wide disabled:opacity-40 disabled:pointer-events-none ${className}`}
      style={{
        background: 'linear-gradient(180deg, #E8C982 0%, #C9A961 50%, #A88B47 100%)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4), 0 8px 28px -8px rgba(201,169,97,0.5), 0 0 0 1px rgba(201,169,97,0.3)',
      }}
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
      className={`press w-full min-h-[52px] rounded-glass glass text-cream font-medium text-[15px] tracking-wide ${className}`}
    >
      {children}
    </button>
  )
}

export function ProgressBar({ value, max, label, suffix = '', kind = 'accent' }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0
  const fill =
    kind === 'good'
      ? 'linear-gradient(90deg, #7fb893 0%, #a0d4b3 100%)'
      : kind === 'warn'
      ? 'linear-gradient(90deg, #d7b261 0%, #e8c982 100%)'
      : kind === 'bad'
      ? 'linear-gradient(90deg, #d96d6d 0%, #e89090 100%)'
      : 'linear-gradient(90deg, #C9A961 0%, #E8C982 100%)'
  return (
    <div>
      <div className="flex items-baseline justify-between text-[11px] mb-1.5">
        <span className="label-editorial !text-[10px]">{label}</span>
        <span className="text-muted font-mono tabular-nums">
          <span className="text-cream font-semibold">{Math.round(value)}</span>
          <span className="text-faint"> / {max}{suffix}</span>
        </span>
      </div>
      <div className="h-[6px] rounded-full bg-white/[0.04] overflow-hidden border border-white/[0.03]">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%`, background: fill, boxShadow: '0 0 12px -2px currentColor' }}
        />
      </div>
    </div>
  )
}

// Editorial display number — for hero values like weight
export function DisplayNumber({ value, unit, className = '' }) {
  return (
    <div className={`flex items-baseline gap-2 ${className}`}>
      <span className="font-display text-[64px] leading-none font-extralight text-cream tabular-nums tracking-tight">
        {value}
      </span>
      {unit && <span className="text-base text-muted font-light tracking-wide">{unit}</span>}
    </div>
  )
}
