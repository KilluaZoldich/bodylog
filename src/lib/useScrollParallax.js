import { useEffect } from 'react'

// Writes window.scrollY into a CSS var --scroll on <body> so CSS can drive
// subtle parallax on the aurora background. Passive listener, throttled via rAF.
export function useScrollParallax() {
  useEffect(() => {
    let raf = null
    const update = () => {
      raf = null
      document.body.style.setProperty('--scroll', window.scrollY.toFixed(0))
    }
    const onScroll = () => {
      if (raf == null) raf = requestAnimationFrame(update)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    update()
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])
}
