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
        <p className="text-sm font-medium uppercase tracking-[0.14em] text-graphite">
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
    <div className={`motion-enter motion-step-${step} flex items-center gap-4 rounded-[14px] border border-line bg-canvas p-4 transition-colors duration-200 hover:border-deep-line md:p-5`}>
      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[14px] border border-line bg-paper text-brand">
        <FaIcon icon={icon} className="h-6 w-6" />
      </span>
      <div className="min-w-0">
        <dt className="ui-label ui-label-muted">{label}</dt>
        <dd className="mt-1 truncate text-3xl font-medium leading-none tracking-[-0.02em] text-ink md:text-4xl">
          {value}
        </dd>
      </div>
    </div>
  )
}

export default function GitHubStats({ stats }: { stats: GitHubStats }) {
  const { user, activity } = stats
  const maxLangCount = stats.topLanguages[0]?.count ?? 1

  return (
    <section aria-labelledby="github-stats-heading" className="px-4 py-6 md:px-6">
      <article className="motion-enter motion-step-3 rounded-[14px] border border-line bg-paper p-4 md:p-5">
        <Heatmap days={stats.days} total={stats.totalContributions} />
      </article>

        <div className="mt-3 xl:grid xl:grid-cols-6 xl:gap-3">
          <article className="motion-enter motion-step-4 rounded-[14px] border border-line bg-paper p-4 md:p-5 xl:col-span-2">
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
                <p className="mt-0.5 text-sm font-medium uppercase tracking-[0.14em] text-graphite">
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

          <dl className="mt-3 grid grid-cols-2 gap-3 xl:col-span-4 xl:mt-0 xl:grid-cols-4">
            <NumberTile label="Stars" value={stats.reposOk ? stats.totalStars : '—'} icon={faStar} step={3} />
            <NumberTile label="Forks" value={stats.reposOk ? stats.totalForks : '—'} icon={faCodeBranch} step={4} />
            <NumberTile label="Repos" value={user.publicRepos} icon={faFolder} step={5} />
            <NumberTile label="Contributions" value={stats.totalContributions} icon={faChartColumn} step={5} />
          </dl>

          <article className="motion-enter motion-step-4 mt-3 rounded-[14px] border border-line bg-paper p-4 md:p-5 xl:col-span-3 xl:mt-0">
            <h3 className="text-sm font-medium uppercase tracking-[0.14em] text-brand">
              Top languages
            </h3>
            {stats.reposOk ? (
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
            ) : (
              <p className="mt-4 text-base leading-relaxed text-graphite">
                Repos data unavailable — the GitHub API rate-limited this request.
                Check back later.
              </p>
            )}
          </article>

          <dl className="mt-3 grid grid-cols-2 gap-3 xl:col-span-3 xl:mt-0">
            <NumberTile label="Current streak" value={`${activity.currentStreak}d`} icon={faFire} step={3} />
            <NumberTile label="Longest streak" value={`${activity.longestStreak}d`} icon={faTrophy} step={4} />
            <NumberTile label="Active days" value={activity.activeDays} icon={faCalendarCheck} step={5} />
            <NumberTile label="Avg / active day" value={activity.avgPerActiveDay} icon={faBolt} step={5} />
          </dl>
        </div>
    </section>
  )
}
