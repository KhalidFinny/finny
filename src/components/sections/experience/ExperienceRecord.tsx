import type { Experience as ExperienceItem } from '@/types/site'
import ExperienceAside from './ExperienceAside'
import { isInService, parseBullets, shortenPeriod } from './experienceUtils'

// Variant — Record. Editorial and always open: a ruled block per entry with the
// period as a lead label, the role set larger, and the bullets as body copy.
export default function ExperienceRecord({
  experiences,
}: {
  experiences: ExperienceItem[]
}) {
  const entries = experiences.filter((experience) => experience.type !== 'education')

  return (
    <section id="experience">
      <div className="px-4 py-6 md:px-6">
        <div className="md:grid md:grid-cols-[minmax(0,1.55fr)_minmax(21rem,0.95fr)] md:gap-6">
          <div className="space-y-8">
            {entries.map((experience, index) => {
              const bullets = parseBullets(experience.description)
              const inService = isInService(experience)
              return (
                <article
                  key={experience.id}
                  className={`motion-enter motion-step-${Math.min(index + 2, 5)} grid gap-x-6 gap-y-3 border-t border-line pt-5 md:grid-cols-[9rem_1fr]`}
                >
                  <p className="ui-label text-brand">
                    {shortenPeriod(experience.period)}
                  </p>
                  <div>
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <h3 className="font-sans text-[1.25rem] font-medium leading-tight tracking-[-0.01em] text-ink md:text-[1.5rem]">
                        {experience.role}
                      </h3>
                      {inService && (
                        <span className="flex items-center gap-2 text-sm font-medium uppercase tracking-[0.14em] text-brand">
                          <span
                            aria-hidden="true"
                            className="h-1.5 w-1.5 animate-pulse rounded-full bg-rosso"
                          />
                          In service
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-base leading-relaxed text-graphite">
                      {experience.company}
                      <span className="text-mist"> · {experience.location}</span>
                    </p>
                    {bullets.length > 0 && (
                      <ul className="mt-3 space-y-2">
                        {bullets.map((bullet, bulletIndex) => (
                          <li
                            key={bulletIndex}
                            className="flex items-start gap-3 text-base leading-relaxed text-graphite"
                          >
                            <span
                              aria-hidden="true"
                              className="mt-[0.62em] h-1 w-1 shrink-0 rounded-full bg-rosso"
                            />
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </article>
              )
            })}
          </div>

          <ExperienceAside experiences={experiences} />
        </div>
      </div>
    </section>
  )
}
