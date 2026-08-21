import { useEffect, type RefObject } from 'react'

export default function useHomeMotion(rootRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    root.dataset.motionReady = 'false'

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      root.dataset.motionReady = 'true'
      return
    }

    let cancelled = false
    const raf = requestAnimationFrame(() => {
      if (cancelled) return
      root.dataset.motionReady = 'true'
    })

    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
    }
  }, [rootRef])
}
