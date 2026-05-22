// Haptic feedback helper.
// Note: iOS Safari does NOT implement navigator.vibrate (it's stubbed).
// We call it anyway — it's a no-op on iPhone but works for Android testing.
// True iOS haptics require AudioContext tricks; we keep it simple and honest.

export function tap() {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(6)
  }
}

export function success() {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate([8, 40, 8])
  }
}

export function warn() {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(20)
  }
}
