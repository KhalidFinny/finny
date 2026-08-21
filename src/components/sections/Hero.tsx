import type { Profile } from '@/types/site'
import { Link } from '@tanstack/react-router'
import { ArrowDown } from '@/components/ui/icons'

export default function Hero({ profile }: { profile: Profile }) {
  const [first, ...rest] = profile.name.split(' ')
  const last = rest.join(' ')

  return (
    <section
      id="home"
      className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-canvas px-6 md:px-12 lg:px-20"
    >
      <div className="relative mx-auto w-full max-w-5xl">
        {/* Instrument header: model designation + indicator lamp */}
        <div className="motion-opacity-in motion-duration-200 flex flex-wrap items-center justify-between gap-3 font-mono text-xs uppercase tracking-[0.25em] text-graphite md:text-sm">
          <p>{profile.title}</p>
          <p className="flex items-center gap-2">
            <span aria-hidden="true" className="h-1.5 w-1.5 animate-pulse rounded-full bg-rosso" />
            Engine running
          </p>
        </div>

        {/* The name — the analog face */}
        <h1 className="motion-opacity-in motion-translate-y-in-[10px] motion-duration-250 mt-12 font-serif text-[clamp(3rem,11vw,10rem)] uppercase leading-[0.9] tracking-[0.01em] text-ink">
          <span className="block">{first}</span>
          <em className="block text-brand">{last}</em>
        </h1>

        {/* Redline — the gauge track with the red zone */}
        <div
          aria-hidden="true"
          className="relative mt-10 h-[3px] w-full max-w-xl overflow-hidden rounded-full bg-line/70"
        >
          <span className="absolute right-0 top-0 h-full w-[15%] bg-rosso" />
          <span className="redline-needle absolute top-1/2 h-[26px] w-[2px] -translate-y-1/2 bg-ink" />
        </div>

        {/* Trip computer readouts */}
        <div className="mt-10 grid grid-cols-1 gap-x-10 gap-y-3 font-mono text-xs uppercase tracking-[0.2em] text-graphite sm:grid-cols-3 md:text-sm">
          <p className="motion-opacity-in motion-duration-200 motion-delay-200 flex items-center gap-2.5">
            <span aria-hidden="true" className="h-1 w-1 shrink-0 bg-rosso" />
            <span>Current — intern @ PT Intelix Global Crossing</span>
          </p>
          <p className="motion-opacity-in motion-duration-200 motion-delay-300 flex items-center gap-2.5">
            <span aria-hidden="true" className="h-1 w-1 shrink-0 bg-rosso" />
            <span>Focus — Fullstack · Design · Video · Photo</span>
          </p>
          <p className="motion-opacity-in motion-duration-200 motion-delay-400 flex items-center gap-2.5">
            <span aria-hidden="true" className="h-1 w-1 shrink-0 bg-rosso" />
            <span>Based — Malang, ID</span>
          </p>
        </div>

        {/* Ignition */}
        <Link
          to="/projects"
          className="motion-opacity-in motion-duration-250 motion-delay-350 mt-14 inline-flex min-h-11 items-center justify-center gap-2.5 rounded-full border border-ink px-7 py-3 font-mono text-xs uppercase tracking-[0.25em] text-ink transition-colors duration-200 hover:bg-ink hover:text-canvas md:text-sm"
        >
          See the work
          <ArrowDown className="h-4 w-4" />
        </Link>
      </div>
    </section>
  )
}
