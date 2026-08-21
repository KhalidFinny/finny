import { useState } from 'react'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import type { Experience as ExperienceItem } from '@/types/site'
import FaIcon from '@/components/ui/FaIcon'
import TopGearQuote from '@/components/sections/TopGearQuote'

export function parseBullets(description: string): string[] {
  try {
    const parsed: unknown = JSON.parse(description)
    return Array.isArray(parsed)
      ? parsed.filter((bullet): bullet is string => typeof bullet === 'string')
      : []
  } catch {
    return []
  }
}

const MONTHS: Record<string, number> = {
  January: 1,
  February: 2,
  March: 3,
  April: 4,
  May: 5,
  June: 6,
  July: 7,
  August: 8,
  September: 9,
  October: 10,
  November: 11,
  December: 12,
}

const MONTH_ABBR: Record<string, string> = {
  January: 'Jan',
  February: 'Feb',
  March: 'Mar',
  April: 'Apr',
  May: 'May',
  June: 'Jun',
  July: 'Jul',
  August: 'Aug',
  September: 'Sep',
  October: 'Oct',
  November: 'Nov',
  December: 'Dec',
}

export function shortenPeriod(period: string): string {
  return period.replace(
    /\b(January|February|March|April|May|June|July|August|September|October|November|December)\b/g,
    (month) => MONTH_ABBR[month] ?? month,
  )
}

function periodStart(period: string): { month: number; year: number } | null {
  const match = period.match(/^([A-Za-z]+) (\d{4})/)
  if (!match) return null
  return { month: MONTHS[match[1]] ?? 1, year: Number(match[2]) }
}

function buildSpecs(experiences: ExperienceItem[]) {
  const workOrgs = experiences.filter((experience) => experience.type !== 'education')
  const starts = workOrgs
    .map((experience) => periodStart(experience.period))
    .filter((start): start is { month: number; year: number } => start !== null)

  let years = '—'
  if (starts.length > 0) {
    const earliest = starts.reduce((min, start) =>
      start.year * 12 + start.month < min.year * 12 + min.month ? start : min,
    )
    const now = new Date()
    const months =
      (now.getFullYear() - earliest.year) * 12 + (now.getMonth() + 1 - earliest.month)
    years = String(Math.max(months, 0) / 12).slice(0, 3)
  }

  const current = workOrgs.find(
    (experience) => experience.period.endsWith('Present') && experience.type === 'work',
  )

  return [
    { label: 'Years in service', value: years },
    { label: 'Records on file', value: String(experiences.length) },
    { label: 'Orgs worked', value: String(new Set(workOrgs.map((e) => e.company)).size) },
    { label: 'Current post', value: current?.company ?? '—' },
  ]
}

export default function Experience({ experiences }: { experiences: ExperienceItem[] }) {
  const currentId = experiences.find(
    (experience) => experience.period.endsWith('Present') && experience.type === 'work',
  )?.id

  const [openIds, setOpenIds] = useState<Set<string>>(
    () => new Set(currentId ? [currentId] : []),
  )

  const toggle = (id: string) =>
    setOpenIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  const workLog = experiences.filter((experience) => experience.type !== 'education')
  const education = experiences.filter((experience) => experience.type === 'education')
  const specs = buildSpecs(experiences)

  return (
    <section id="experience">
      <div className="px-4 py-6 md:px-6">
        <div className="md:grid md:grid-cols-2 md:gap-6">
          <div className="space-y-4 md:space-y-5">
            {workLog.map((experience, index) => {
              const bullets = parseBullets(experience.description)
              const open = openIds.has(experience.id)
              const inService =
                experience.period.endsWith('Present') && experience.type === 'work'
              return (
                <article
                  key={experience.id}
                  className={`motion-enter motion-step-${Math.min(index + 2, 5)} rounded-[14px] border border-line bg-paper transition-colors duration-200 hover:border-deep-line`}
                >
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={`${experience.id}-details`}
                    onClick={() => toggle(experience.id)}
                    className="flex w-full items-center gap-4 px-5 py-5 text-left md:px-6 md:py-6"
                  >
                    <div className="grid w-full items-center gap-x-8 gap-y-3 md:grid-cols-[minmax(0,12rem)_1fr_auto]">
                      <div className="font-mono text-xs uppercase tracking-[0.2em] text-graphite md:text-sm">
                        <p className="whitespace-nowrap normal-case tracking-normal">
                          {shortenPeriod(experience.period)}
                        </p>
                      </div>
                      <div>
                        <p className="font-serif text-xl leading-tight text-ink md:text-2xl">
                          {experience.role}
                        </p>
                        <p className="mt-1 text-sm font-medium text-graphite md:text-base">
                          {experience.company}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 justify-self-start md:justify-self-end">
                        {inService && (
                          <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-graphite">
                            <span
                              aria-hidden="true"
                              className="h-1.5 w-1.5 animate-pulse rounded-full bg-rosso"
                            />
                            In service
                          </span>
                        )}
                        <FaIcon
                          icon={faChevronDown}
                          className={`h-4 w-4 text-graphite transition-transform duration-200 motion-reduce:transition-none ${
                            open ? 'rotate-180' : ''
                          }`}
                        />
                      </div>
                    </div>
                  </button>

                  <div
                    id={`${experience.id}-details`}
                    role="region"
                    aria-hidden={!open}
                    className={`grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                      open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="min-h-0 overflow-hidden">
                      <div className="grid gap-x-8 gap-y-5 border-t border-line px-5 pb-5 pt-4 md:grid-cols-[minmax(0,11rem)_1fr] md:px-6 md:pb-6">
                        <p className="font-mono text-xs uppercase tracking-[0.2em] text-graphite md:text-sm">
                          {experience.location}
                        </p>
                        {bullets.length > 0 && (
                          <ul className="space-y-3">
                            {bullets.map((bullet, bulletIndex) => (
                              <li
                                key={bulletIndex}
                                className="flex items-start gap-3 text-base leading-relaxed text-graphite md:text-[1.0625rem]"
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
                    </div>
                  </div>
                </article>
              )
            })}

            <p className="pt-2 font-mono text-xs uppercase tracking-[0.25em] text-graphite">
              — end of log —
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-6 md:mt-0">
            {education.map((experience, index) => {
              const bullets = parseBullets(experience.description)
              return (
                <div key={experience.id}>
                  <p className="font-mono text-xs uppercase tracking-[0.25em] text-graphite">
                    — education —
                  </p>
                  <article
                    className={`motion-enter motion-step-${Math.min(index + 3, 5)} mt-3 rounded-[14px] border border-line bg-paper p-5 transition-colors duration-200 hover:border-deep-line`}
                  >
                    <p className="font-mono text-xs uppercase tracking-[0.2em] text-graphite">
                      {shortenPeriod(experience.period)}
                    </p>
                    <h3 className="mt-2 font-serif text-xl leading-tight text-ink">
                      {experience.role}
                    </h3>
                    <p className="mt-1 text-sm font-medium text-graphite">
                      {experience.company}
                    </p>
                    <p className="mt-3 font-mono text-xs uppercase tracking-[0.2em] text-graphite">
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
                </div>
              )
            })}
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-graphite">
              — stats —
            </p>
            <dl className="mt-3 grid grid-cols-2 gap-2">
              {specs.map((spec) => (
                <div
                  key={spec.label}
                  className="motion-enter motion-step-5 rounded-[14px] border border-line bg-paper p-4 transition-colors duration-200 hover:border-deep-line"
                >
                  <dt className="font-mono text-xs uppercase tracking-[0.2em] text-graphite">
                    {spec.label}
                  </dt>
                  <dd className="mt-1 truncate font-serif text-2xl leading-tight text-ink">
                    {spec.value}
                  </dd>
                </div>
              ))}
            </dl>
            <TopGearQuote />
          </div>
        </div>
      </div>
    </section>
  )
}
