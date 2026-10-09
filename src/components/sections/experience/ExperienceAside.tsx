import type { Experience as ExperienceItem } from '@/types/site'
import TopGearQuote from '@/components/sections/TopGearQuote'
import { buildSpecs, parseBullets, shortenPeriod } from './experienceUtils'

const SECTION_LABEL_CLS = 'ui-sticker-label'
const CARD_LABEL_CLS = 'ui-label ui-label-brand'
const META_LABEL_CLS = 'ui-label ui-label-muted'

// Shared right column for every experience layout: education, the stats grid,
// and the quote. Extracted so the variants only differ in the work log.
export default function ExperienceAside({
  experiences,
}: {
  experiences: ExperienceItem[]
}) {
  const education = experiences.filter((experience) => experience.type === 'education')
  const specs = buildSpecs(experiences)

  return (
    <aside className="mt-8 flex flex-col gap-6 xl:mt-0 xl:pl-8">
      {education.map((experience, index) => {
        const bullets = parseBullets(experience.description)
        return (
          <section key={experience.id}>
            <p className={SECTION_LABEL_CLS}>Education</p>
            <article
              className={`motion-enter motion-step-${Math.min(index + 3, 5)} mt-3 rounded-[14px] border border-line bg-paper p-5 transition-colors duration-200`}
            >
              <p className={META_LABEL_CLS}>{shortenPeriod(experience.period)}</p>
              <h3 className="mt-2 font-sans text-[1.125rem] font-medium leading-tight tracking-[-0.01em] text-ink md:text-[1.375rem]">
                {experience.role}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-graphite md:text-base">
                {experience.company}
              </p>
              <p className="mt-3 text-sm font-medium uppercase tracking-[0.14em] text-graphite">
                {experience.location}
              </p>
              {bullets.length > 0 && (
                <ul className="mt-4 space-y-3">
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
            </article>
          </section>
        )
      })}

      <section>
        <p className={SECTION_LABEL_CLS}>Stats</p>
        <dl className="mt-3 grid grid-cols-2 gap-2">
          {specs.map((spec) => (
            <div
              key={spec.label}
              className="motion-enter motion-step-5 rounded-[14px] border border-line bg-paper p-4"
            >
              <dt className={CARD_LABEL_CLS}>{spec.label}</dt>
              <dd className="mt-1 truncate font-sans text-2xl font-medium leading-tight tracking-[-0.01em] text-ink">
                {spec.value}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <TopGearQuote />
    </aside>
  )
}
