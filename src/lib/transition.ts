const OUT_MS = 160

export function animateOutThen(update: () => void, target?: Element | null) {
  if (typeof document === 'undefined') {
    update()
    return
  }
  const element =
    target ??
    Array.from(document.querySelectorAll('main')).find((el) => el.offsetParent !== null) ??
    document.querySelector('main')
  const reduce =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!element || reduce) {
    update()
    return
  }
  element.classList.add('page-out')
  window.setTimeout(update, OUT_MS)
}
