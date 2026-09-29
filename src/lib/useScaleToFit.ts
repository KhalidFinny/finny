// Computes a scale factor that fits a fixed-size design (baseW x baseH) inside
// the viewport, for the "scale-to-fit — identical everywhere" app frame.
// - Scales DOWN to fit small/short viewports (e.g. a laptop in a framed browser).
// - Never scales below a usable minimum.
// - Allows a modest UPScale (MAX_SCALE) so common 16:9 monitors still fill,
//   without the heavy blur that larger upscales cause.
import { useEffect, useState } from 'react'

const MAX_SCALE = 1.15
const MIN_SCALE = 0.25
/** Breathing room between the scaled app and the viewport edge. */
const PAD = 24

export function useScaleToFit(baseW: number, baseH: number) {
  const [scale, setScale] = useState(1)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const compute = () => {
      const w = Math.max(1, window.innerWidth - PAD)
      const h = Math.max(1, window.innerHeight - PAD)
      const s = Math.min(w / baseW, h / baseH)
      setScale(Math.min(MAX_SCALE, Math.max(MIN_SCALE, s)))
    }
    compute()
    window.addEventListener('resize', compute)
    window.addEventListener('orientationchange', compute)
    return () => {
      window.removeEventListener('resize', compute)
      window.removeEventListener('orientationchange', compute)
    }
  }, [baseW, baseH])

  return scale
}
