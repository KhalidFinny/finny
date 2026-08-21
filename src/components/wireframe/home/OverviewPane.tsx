import CurrentStateCard from '@/components/wireframe/home/CurrentStateCard'
import { currentStateLines } from '@/components/wireframe/home/data'

export default function OverviewPane() {
  return (
    <aside className="min-h-0 border-b border-line bg-paper lg:border-b-0 lg:border-r">
      <div className="border-b border-line bg-canvas px-4 py-2.5 md:px-5">
        <p className="text-sm font-medium uppercase tracking-[0.14em] text-brand">
          Overview
        </p>
      </div>

      <div className="px-4 py-6 md:px-6 md:py-9">
        <p className="motion-enter motion-step-2 text-2xl text-ink md:text-3xl">Khalid Atthoriq</p>

        <h1 className="motion-enter motion-step-2 mt-6 font-serif text-[clamp(2.8rem,3.8vw,4.2rem)] leading-[0.88] tracking-[-0.03em] text-ink [text-wrap:balance] md:mt-8">
          Clean. Workable. Full of <span className="text-brand">character.</span>
        </h1>

        <p className="motion-enter motion-step-3 mt-8 text-sm font-medium uppercase tracking-[0.14em] text-brand md:mt-10">
          Fullstack · UI/UX · Photographer · Videographer
        </p>

        <p className="motion-enter motion-step-3 mt-6 text-base leading-relaxed text-graphite md:mt-8 md:text-lg">
          I build digital products with an engineer&apos;s structure and a creative eye.
        </p>

        <div className="motion-enter motion-step-4 mt-8 md:mt-10">
          <CurrentStateCard lines={currentStateLines} />
        </div>
      </div>
    </aside>
  )
}
