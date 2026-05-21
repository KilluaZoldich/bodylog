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
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-bg/95 backdrop-blur-md pb-safe"
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 6px)' }}
    >
      <div className="mx-auto grid max-w-md grid-cols-4">
        {TABS.map((t) => {
          const Icon = t.icon
          const isActive = active === t.key
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => onChange(t.key)}
              className={`flex min-h-[56px] flex-col items-center justify-center gap-0.5 py-2 ${
                isActive ? 'text-accent' : 'text-muted'
              }`}
            >
              <Icon size={22} strokeWidth={isActive ? 2.4 : 2} />
              <span className="text-[11px] font-medium">{t.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
