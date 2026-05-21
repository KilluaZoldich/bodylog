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

  return (
    <ToastCtx.Provider value={{ show }}>
      {children}
      <div className="fixed inset-x-0 top-4 z-50 flex flex-col items-center gap-2 px-4 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-center gap-2 rounded-xl px-4 py-3 shadow-lg max-w-sm w-full
              ${t.kind === 'success' ? 'bg-good/15 border border-good/40 text-good' : ''}
              ${t.kind === 'warn' ? 'bg-warn/15 border border-warn/40 text-warn' : ''}
              ${t.kind === 'error' ? 'bg-bad/15 border border-bad/40 text-bad' : ''}
              ${t.kind === 'info' ? 'bg-surface2 border border-border text-text' : ''}
            `}
          >
            {t.kind === 'success' && <CheckCircle2 size={18} />}
            {(t.kind === 'warn' || t.kind === 'error') && <AlertTriangle size={18} />}
            {t.kind === 'info' && <Info size={18} />}
            <span className="text-sm">{t.message}</span>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}
