import type { Experience as ExperienceItem } from '@/types/site'
import MobileShell from '@/components/mobile/MobileShell'
import { parseBullets, shortenPeriod } from '@/components/sections/Experience'

export default function MobileExperiences({ experiences }: { experiences: ExperienceItem[] }) {
  return (
    <MobileShell label="Experiences">
      <ul className="space-y-4">
        {experiences.map((experience) => {
          const bullets = parseBullets(experience.description)
          const isOngoing =
            experience.period.endsWith('Present') && experience.type === 'work'
          return (
            <li key={experience.id}>
              <article className="rounded-[14px] border border-line bg-paper p-4">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-graphite">
                  {shortenPeriod(experience.period)}
                </p>
                <div className="mt-2 flex items-baseline justify-between gap-3">
                  <h2 className="font-serif text-xl leading-tight text-ink">
                    {experience.role}
                  </h2>
                  {isOngoing ? (
                    <span className="inline-flex shrink-0 items-center gap-1.5 font-mono text-xs uppercase tracking-[0.2em] text-graphite">
                      <span
                        aria-hidden="true"
                        className="h-1.5 w-1.5 animate-pulse rounded-full bg-rosso"
                      />
                      Active
                    </span>
                  ) : null}
                </div>
                <p className="mt-1 text-sm font-medium text-graphite">{experience.company}</p>
                <p className="mt-2 font-mono text-xs uppercase tracking-[0.2em] text-graphite">
                  {experience.location}
                </p>
                {bullets.length > 0 ? (
                  <ul className="mt-4 space-y-2.5">
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
                ) : null}
              </article>
            </li>
          )
        })}
      </ul>
    </MobileShell>
  )
}
