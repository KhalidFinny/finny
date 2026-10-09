import { heroIndex } from '@/components/wireframe/home/hero/heroContent'
import HeroIdentity from '@/components/wireframe/home/hero/HeroIdentity'
import HeroPanel from '@/components/wireframe/home/hero/HeroPanel'

// Variant G — Index. A magazine-style contents list: what he does, numbered,
// with the craft under each. Reads as a section list, not a data table.
export default function HeroIndex() {
  return (
    <HeroPanel label="Index">
      <HeroIdentity />

      <ol className="motion-enter motion-step-5 flex flex-1 flex-col justify-evenly border-t border-panel-line">
        {heroIndex.map((item) => (
          <li
            key={item.no}
            className="flex items-baseline gap-4 border-b border-panel-line py-3.5 last:border-b-0"
          >
            <span className="w-11 shrink-0 font-serif text-3xl leading-none text-panel-accent">
              {item.no}
            </span>
            <span className="min-w-0">
              <span className="block text-lg leading-snug text-panel-ink">
                {item.title}
              </span>
              <span className="mt-1 block text-base leading-snug text-panel-muted">
                {item.note}
              </span>
            </span>
          </li>
        ))}
      </ol>
    </HeroPanel>
  )
}
