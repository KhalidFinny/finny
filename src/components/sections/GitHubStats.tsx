import type { IconDefinition } from '@fortawesome/fontawesome-common-types'
import {
  faBolt,
  faCalendarCheck,
  faChartColumn,
  faCodeBranch,
  faFire,
  faFolder,
  faStar,
  faTrophy,
} from '@fortawesome/free-solid-svg-icons'
import type { GitHubStats } from '@/server/github'
import FaIcon from '@/components/ui/FaIcon'

const LEVEL_BG: Record<number, string> = {
  0: 'bg-line',
  1: 'bg-brand/25',
  2: 'bg-brand/50',
  3: 'bg-brand/75',
  4: 'bg-brand',
}

function Heatmap({ days, total }: { days: GitHubStats['days']; total: number }) {
  if (days.length === 0) {
    return (
      <p className="text-sm font-medium uppercase tracking-[0.14em] text-graphite">
        Contribution data unavailable.
      </p>
    )
  }

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <p className="text-sm font-medium uppercase tracking-[0.14em] text-graphite">
          {total} contributions in the last year
        </p>
        <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-mist">
          Less · more
        </p>
      </div>
      <div className="mt-4 overflow-x-auto pb-1">
        <div className="grid w-full min-w-[640px] auto-cols-fr grid-flow-col grid-rows-7 gap-[3px]">
          {days.map((day) => (
            <span
              key={day.date}
              title={`${day.date} · ${day.level} contributions`}
              className={`aspect-square w-full rounded-[3px] ${LEVEL_BG[Math.max(0, Math.min(4, day.level))]}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function NumberTile({
  label,
  value,
  icon,
  step = 3,
}: {
  label: string
  value: string | number
  icon: IconDefinition
  step?: number
}) {
  return (
    <div className={`motion-enter motion-step-${step} flex flex-col-reverse gap-3 rounded-[14px] border border-line bg-canvas p-5 transition-colors duration-200 hover:border-deep-line`}>
      <dt className="text-sm font-medium uppercase tracking-[0.14em] text-brand">{label}</dt>
      <dd className="text-4xl font-medium leading-none text-ink md:text-[2.6rem]">{value}</dd>
      <span className="flex h-10 w-10 items-center justify-center rounded-[12px] border border-line bg-paper text-brand">
        <FaIcon icon={icon} className="h-4 w-4" />
      </span>
    </div>
  )
}

export default function GitHubStats({ stats }: { stats: GitHubStats }) {
  const { user, activity } = stats
  const maxLangCount = stats.topLanguages[0]?.count ?? 1

  return (
    <section aria-labelledby="github-stats-heading" className="px-4 py-4 md:px-5 md:py-5">
      <article className="motion-enter motion-step-3 rounded-[14px] border border-line bg-paper p-4 md:p-5">
        <Heatmap days={stats.days} total={stats.totalContributions} />
      </article>

        <div className="mt-3 md:grid md:grid-cols-6 md:gap-3">
          <article className="motion-enter motion-step-4 rounded-[14px] border border-line bg-paper p-4 md:col-span-2 md:p-5">
            <div className="flex items-center gap-3.5">
              <img
                src={user.avatarUrl}
                alt=""
                loading="lazy"
                className="h-14 w-14 shrink-0 rounded-full border border-line object-cover"
              />
              <div className="min-w-0">
                <h3 className="font-serif text-2xl leading-tight text-ink">
                  {user.name ?? user.login}
                </h3>
                <p className="mt-0.5 font-mono text-xs uppercase tracking-[0.2em] text-graphite">
                  @{user.login}
                </p>
              </div>
            </div>
            {user.bio && (
              <p className="mt-3.5 text-base leading-relaxed text-graphite">{user.bio}</p>
            )}
            <p className="mt-3.5 border-t border-line pt-3.5 text-sm font-medium uppercase tracking-[0.14em] text-graphite">
              {user.followers} followers · {user.following} following
            </p>
          </article>

          <dl className="mt-3 grid grid-cols-2 gap-3 md:col-span-4 md:mt-0 md:grid-cols-4">
            <NumberTile label="Stars" value={stats.totalStars} icon={faStar} step={3} />
            <NumberTile label="Forks" value={stats.totalForks} icon={faCodeBranch} step={4} />
            <NumberTile label="Repos" value={user.publicRepos} icon={faFolder} step={5} />
            <NumberTile label="Contributions" value={stats.totalContributions} icon={faChartColumn} step={5} />
          </dl>

          <article className="motion-enter motion-step-4 mt-3 rounded-[14px] border border-line bg-paper p-4 md:col-span-3 md:mt-0 md:p-5">
            <h3 className="text-sm font-medium uppercase tracking-[0.14em] text-brand">
              Top languages
            </h3>
            <ol className="mt-4 space-y-3.5">
              {stats.topLanguages.map((language) => (
                <li key={language.name}>
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="text-base font-medium text-ink">{language.name}</span>
                    <span className="text-sm tabular-nums text-graphite">
                      {language.count} repos
                    </span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-line">
                    <div
                      className="h-full rounded-full bg-brand"
                      style={{ width: `${Math.round((language.count / maxLangCount) * 100)}%` }}
                    />
                  </div>
                </li>
              ))}
            </ol>
          </article>

          <dl className="mt-3 grid grid-cols-2 gap-3 md:col-span-3 md:mt-0">
            <NumberTile label="Current streak" value={`${activity.currentStreak}d`} icon={faFire} step={3} />
            <NumberTile label="Longest streak" value={`${activity.longestStreak}d`} icon={faTrophy} step={4} />
            <NumberTile label="Active days" value={activity.activeDays} icon={faCalendarCheck} step={5} />
            <NumberTile label="Avg / active day" value={activity.avgPerActiveDay} icon={faBolt} step={5} />
          </dl>
        </div>
    </section>
  )
}
