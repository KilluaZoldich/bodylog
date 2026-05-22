import { useEffect, useRef, useState } from 'react'

// Animates from current displayed value → target on mount and on change.
// RAF-based, ease-out cubic. Returns the live value formatted to `digits`.
export function useNumberTicker(target, { digits = 0, duration = 700 } = {}) {
  const [value, setValue] = useState(target ?? 0)
  const prevTargetRef = useRef(target)
  const fromRef = useRef(target ?? 0)
  const startRef = useRef(null)
  const rafRef = useRef(null)

  useEffect(() => {
    if (target == null || Number.isNaN(target)) {
      setValue(null)
      prevTargetRef.current = null
      return
    }
    fromRef.current = (typeof value === 'number' ? value : 0)
    startRef.current = null
    cancelAnimationFrame(rafRef.current)

    const tick = (ts) => {
      if (startRef.current == null) startRef.current = ts
      const elapsed = ts - startRef.current
      const t = Math.min(1, elapsed / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      const next = fromRef.current + (target - fromRef.current) * eased
      setValue(next)
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        setValue(target)
      }
    }
    rafRef.current = requestAnimationFrame(tick)
    prevTargetRef.current = target
    return () => cancelAnimationFrame(rafRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration])

  if (value == null) return '—'
  return Number(value).toFixed(digits)
}
