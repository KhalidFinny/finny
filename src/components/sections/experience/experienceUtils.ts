import type { Experience as ExperienceItem } from '@/types/site'

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

export function isInService(experience: ExperienceItem): boolean {
  return experience.period.endsWith('Present') && experience.type === 'work'
}

export function buildSpecs(experiences: ExperienceItem[]) {
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
