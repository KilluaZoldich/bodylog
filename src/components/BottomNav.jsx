import { Home, ClipboardEdit, Ruler, Download } from 'lucide-react'

const TABS = [
  { key: 'dashboard', label: 'Home', icon: Home },
  { key: 'giornata', label: 'Giornata', icon: ClipboardEdit },
  { key: 'misure', label: 'Misure', icon: Ruler },
  { key: 'esporta', label: 'Esporta', icon: Download },
]

export default function BottomNav({ active, onChange }) {
  return (
    <nav
      className="fixed inset-x-0 z-40 flex justify-center pointer-events-none"
      style={{ bottom: 'calc(env(safe-area-inset-bottom) + 14px)' }}
    >
      <div className="pointer-events-auto glass-strong rounded-full px-2 py-1.5 flex items-center gap-1">
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
              className={`press relative flex h-[52px] min-w-[60px] flex-col items-center justify-center gap-0.5 rounded-full px-3 transition-colors ${
                isActive ? 'text-ink-950' : 'text-muted'
              }`}
              style={
                isActive
                  ? {
                      background: 'linear-gradient(180deg, #E8C982 0%, #C9A961 60%, #A88B47 100%)',
                      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4), 0 4px 16px -4px rgba(201,169,97,0.5)',
                    }
                  : undefined
              }
            >
              <Icon size={20} strokeWidth={isActive ? 2.4 : 1.8} />
              <span className={`text-[10px] tracking-wider ${isActive ? 'font-semibold' : 'font-medium'}`}>
                {t.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
