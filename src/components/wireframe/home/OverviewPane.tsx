import CurrentStateCard from '@/components/wireframe/home/CurrentStateCard'
import { currentStateLines } from '@/components/wireframe/home/data'

export default function OverviewPane() {
  return (
    <aside className="min-h-0 border-b border-line bg-paper xl:border-b-0 xl:border-r">
      <div className="border-b border-line bg-canvas px-4 py-2.5 md:px-6">
        <p className="ui-sticker-label">
          Overview
        </p>
      </div>

      <div className="flex min-h-0 flex-col justify-center px-4 py-6 md:px-7 md:py-7">
        <div className="space-y-4 md:space-y-5">
          <p className="motion-enter motion-step-2 font-sans text-xl font-medium tracking-[-0.01em] text-brand md:text-2xl">
            Khalid Atthoriq
          </p>

          <h1 className="motion-enter motion-step-2 font-serif text-[clamp(2.2rem,3.4vw,3.5rem)] leading-[0.94] tracking-[-0.03em] text-ink [text-wrap:balance]">
            Clean. Workable. Full of <span className="text-brand">character.</span>
          </h1>

          <p className="motion-enter motion-step-3 text-sm font-medium uppercase tracking-[0.14em] text-brand">
            Fullstack · UI/UX · Photographer · Videographer
          </p>

          <p className="motion-enter motion-step-3 max-w-[22rem] text-base leading-relaxed text-graphite md:text-lg">
            I build digital products with an engineer&apos;s structure and a creative eye.
          </p>
        </div>

        <div className="motion-enter motion-step-4 mt-6 md:mt-7">
          <CurrentStateCard lines={currentStateLines} />
        </div>
      </div>
    </aside>
  )
}
