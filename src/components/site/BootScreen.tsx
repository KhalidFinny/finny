import { useEffect, useState } from 'react'

const MIN_BOOT_MS = 500
const REDUCED_BOOT_MS = 300
const FADE_MS = 250

// Gauge geometry (viewBox 240×140, hub at bottom-center)
const CX = 120
const CY = 126
const R = 96

function polar(r: number, v: number) {
  const theta = ((180 - 1.8 * v) * Math.PI) / 180
  return { x: CX + r * Math.cos(theta), y: CY - r * Math.sin(theta) }
}

function BootGauge() {
  const trackLen = Math.PI * R
  const redlineLen = trackLen * 0.15
  const trackPath = `M ${polar(R, 0).x} ${polar(R, 0).y} A ${R} ${R} 0 0 1 ${polar(R, 100).x} ${polar(R, 100).y}`
  const majors = Array.from({ length: 11 }, (_, i) => i * 10)
  const minors = Array.from({ length: 19 }, (_, i) => 5 + i * 5)

  return (
    <svg
      viewBox="0 0 240 140"
      aria-hidden="true"
      className="mx-auto mt-9 block w-full max-w-[300px]"
    >
      {/* Track */}
      <path d={trackPath} fill="none" stroke="var(--color-line)" strokeWidth="2" />
      {/* Redline — last 15% of the sweep */}
      <path
        d={trackPath}
        fill="none"
        stroke="var(--color-rosso)"
        strokeWidth="2"
        strokeDasharray={`${redlineLen} ${trackLen}`}
        strokeDashoffset={trackLen - redlineLen}
      />
      {majors.map((v) => {
        const outer = polar(100, v)
        const inner = polar(88, v)
        return (
          <line
            key={v}
            x1={inner.x}
            y1={inner.y}
            x2={outer.x}
            y2={outer.y}
            stroke="var(--color-graphite)"
            strokeWidth="1.5"
            opacity="0.5"
          />
        )
      })}
      {minors.map((v) => {
        const outer = polar(100, v)
        const inner = polar(93, v)
        return (
          <line
            key={v}
            x1={inner.x}
            y1={inner.y}
            x2={outer.x}
            y2={outer.y}
            stroke="var(--color-deep-line)"
            strokeWidth="1"
          />
        )
      })}
      {/* Needle — sweeps to 70% (idle), CSS-driven */}
      <line
        className="boot-needle"
        x1={CX}
        y1={CY}
        x2={CX}
        y2={CY - (R - 4)}
        stroke="var(--color-ink)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx={CX} cy={CY} r="4" fill="var(--color-ink)" />
    </svg>
  )
}

export default function BootScreen({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<'boot' | 'leaving' | 'gone'>('boot')

  useEffect(() => {
    let disposed = false
    let finished = false
    const finish = () => {
      if (disposed || finished) return
      finished = true
      onDone()
      setPhase('leaving')
      window.setTimeout(() => {
        if (!disposed) setPhase('gone')
      }, FADE_MS)
    }
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const minTimer = window.setTimeout(finish, reduce ? REDUCED_BOOT_MS : MIN_BOOT_MS)
    const onReady = () => {
      const fonts = document.fonts?.ready
      if (fonts) fonts.then(finish).catch(finish)
      else finish()
    }
    if (document.readyState === 'complete') onReady()
    else window.addEventListener('load', onReady, { once: true })
    return () => {
      disposed = true
      window.clearTimeout(minTimer)
      window.removeEventListener('load', onReady)
    }
  }, [onDone])

  if (phase === 'gone') return null

  return (
    <div
      role="status"
      className={`boot-mask fixed inset-0 z-50 flex items-center justify-center bg-wall transition-opacity duration-[250ms] ease-out ${
        phase === 'leaving' ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      <div className="w-full max-w-md px-6">
        {/* Model designation + lamp */}
        <div className="flex items-baseline justify-between text-sm font-medium uppercase tracking-[0.14em] text-graphite">
          <p>The Lab</p>
          <p className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 animate-pulse rounded-full bg-rosso motion-reduce:animate-none"
            />
            <span>Engine starting</span>
          </p>
        </div>

        {/* Marque — the name on the face */}
        <h1 className="mt-7 font-serif text-4xl uppercase leading-none text-ink md:text-5xl">
          Khalid
          <em className="block text-brand">Atthoriq</em>
        </h1>

        <BootGauge />

        {/* Trip computer — self-test sequence */}
        <ul className="mt-7 space-y-1.5 text-sm font-medium uppercase tracking-[0.14em] text-graphite">
          <li className="boot-check flex items-center gap-2.5">
            <span aria-hidden="true" className="h-1 w-1 shrink-0 bg-rosso" />
            Ignition — on
          </li>
          <li className="boot-check boot-check-2 flex items-center gap-2.5">
            <span aria-hidden="true" className="h-1 w-1 shrink-0 bg-rosso" />
            Systems — check
          </li>
          <li className="boot-check boot-check-3 flex items-center gap-2.5">
            <span aria-hidden="true" className="h-1 w-1 shrink-0 bg-rosso" />
            Engine — running
          </li>
        </ul>
      </div>
    </div>
  )
}
