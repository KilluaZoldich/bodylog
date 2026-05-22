import { Home, ClipboardEdit, Ruler, Download } from 'lucide-react'

const TABS = [
  { key: 'dashboard', label: 'Home', icon: Home },
  { key: 'giornata', label: 'Giornata', icon: ClipboardEdit },
  { key: 'misure', label: 'Misure', icon: Ruler },
  { key: 'esporta', label: 'Esporta', icon: Download },
]

// Refined floating dock. Icons-only at rest; active tab expands to show
// its label inside a gold pill. Editorial, not utilitarian.
export default function BottomNav({ active, onChange }) {
  return (
    <nav
      className="fixed inset-x-0 z-40 flex justify-center pointer-events-none px-4"
      style={{ bottom: 'calc(env(safe-area-inset-bottom) + 14px)' }}
    >
      <div className="pointer-events-auto glass-prominent rounded-full p-1.5 flex items-center gap-1">
        {TABS.map((t) => {
          const Icon = t.icon
          const isActive = active === t.key
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => onChange(t.key)}
              aria-label={t.label}
              aria-pressed={isActive}
              className={`press relative flex h-[46px] items-center justify-center rounded-full transition-all duration-300 ease-out ${
                isActive
                  ? 'px-4 text-ink-950'
                  : 'w-[46px] text-muted'
              }`}
              style={
                isActive
                  ? {
                      background:
                        'linear-gradient(180deg, #E8C982 0%, #C9A961 60%, #A88B47 100%)',
                      boxShadow:
                        'inset 0 1px 0 rgba(255,255,255,0.45), 0 4px 16px -4px rgba(201,169,97,0.55)',
                    }
                  : undefined
              }
            >
              <Icon size={18} strokeWidth={isActive ? 2.4 : 1.8} />
              {isActive && (
                <span className="ml-1.5 text-[12px] font-semibold tracking-wider">
                  {t.label}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
