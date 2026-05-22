import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { CheckCircle2, AlertTriangle, Info } from 'lucide-react'

const ToastCtx = createContext({ show: () => {} })

export function useToast() {
  return useContext(ToastCtx)
}

let idSeq = 1

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const show = useCallback((message, opts = {}) => {
    const id = idSeq++
    const t = { id, message, kind: opts.kind || 'info', duration: opts.duration ?? 2400 }
    setToasts((prev) => [...prev, t])
    return id
  }, [])

  useEffect(() => {
    if (!toasts.length) return
    const timers = toasts.map((t) =>
      setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== t.id)), t.duration)
    )
    return () => timers.forEach(clearTimeout)
  }, [toasts])

  const tint = {
    success: { color: '#7fb893', icon: CheckCircle2 },
    warn:    { color: '#d7b261', icon: AlertTriangle },
    error:   { color: '#d96d6d', icon: AlertTriangle },
    info:    { color: '#F5F3EE', icon: Info },
  }

  return (
    <ToastCtx.Provider value={{ show }}>
      {children}
      <div
        className="fixed inset-x-0 z-50 flex flex-col items-center gap-2 px-4 pointer-events-none"
        style={{ top: 'calc(env(safe-area-inset-top) + 16px)' }}
      >
        {toasts.map((t) => {
          const T = tint[t.kind] || tint.info
          const Icon = T.icon
          return (
            <div
              key={t.id}
              className="pointer-events-auto glass-strong rounded-full px-4 py-2.5 flex items-center gap-2.5 max-w-sm animate-in"
              style={{
                animation: 'toast-in 240ms cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <Icon size={16} style={{ color: T.color }} />
              <span className="text-[13px] text-cream font-medium tracking-wide">{t.message}</span>
            </div>
          )
        })}
      </div>
      <style>{`
        @keyframes toast-in {
          0%   { opacity: 0; transform: translateY(-12px) scale(0.96); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </ToastCtx.Provider>
  )
}
