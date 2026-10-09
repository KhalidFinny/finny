import { heroBased, heroTagline } from '@/components/wireframe/home/hero/heroContent'

// The name lockup shared by the hero: location, badge name, a hairline rule,
// and the tagline. Set in the serif so the name reads as the hero, not a label.
export default function HeroIdentity() {
  return (
    <div>
      <p className="motion-enter motion-step-2 ui-label text-panel-muted">{heroBased}</p>

      <h1 className="motion-enter motion-step-2 mt-5 font-serif text-[clamp(3.25rem,5vw,5rem)] uppercase leading-[0.86] tracking-[-0.02em] text-panel-ink">
        Khalid
        <span className="block text-panel-accent">Atthoriq</span>
      </h1>

      <span
        aria-hidden="true"
        className="motion-enter motion-step-3 mt-6 block h-px w-12 bg-panel-accent"
      />

      <p className="motion-enter motion-step-3 mt-5 max-w-[22rem] font-serif text-[clamp(1.4rem,1.9vw,1.85rem)] leading-snug text-panel-ink">
        {heroTagline}
      </p>
    </div>
  )
}
