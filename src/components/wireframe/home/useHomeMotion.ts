import { useEffect, useState } from 'react'

// Readiness for the page's reveal animation. It is returned as state rather than written
// onto the DOM: the attribute is rendered by React, so a later re-render cannot reset it
// back to hidden and leave the content invisible.
export default function useHomeMotion() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setReady(true)
      return
    }
    const raf = requestAnimationFrame(() => setReady(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  return ready
}
