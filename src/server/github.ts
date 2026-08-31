import { createServerFn } from '@tanstack/react-start'
import { getRuntimeEnv } from '@/server/platform'

const GITHUB_USER = 'khalidfinny'
const HEADERS = { 'User-Agent': 'finny-portfolio' }
const CACHE_KEY = 'github-stats'
const CACHE_TTL = 60 * 60 * 1000 // 1 hour
const LOCK_TTL = 30 * 1000 // 30 seconds

export interface GitHubDay {
  date: string
  level: number
}

export interface GitHubStats {
  user: {
    login: string
    name: string | null
    avatarUrl: string
    bio: string | null
    followers: number
    following: number
    publicRepos: number
    htmlUrl: string
  }
  days: GitHubDay[]
  totalContributions: number
  totalStars: number
  totalForks: number
  topLanguages: { name: string; count: number }[]
  activity: {
    currentStreak: number
    longestStreak: number
    activeDays: number
    avgPerActiveDay: number
  }
}

async function getDb() {
  try {
    const cf = await import('cloudflare:workers')
    return cf.env.DB ?? null
  } catch {
    return null
  }
}

// The Workers egress IP is shared across tenants, so unauthenticated GitHub
// API calls hit the 60 req/hr per-IP limit almost immediately. When the
// GITHUB_TOKEN secret is present (wrangler secret put), send it as a Bearer
// token for the 5000 req/hr authenticated quota.
async function getAuthHeaders(): Promise<Record<string, string>> {
  const env = await getRuntimeEnv()
  const token = env?.GITHUB_TOKEN ?? env?.GH_TOKEN
  return token ? { ...HEADERS, Authorization: `Bearer ${token}` } : HEADERS
}

async function fetchStats(): Promise<GitHubStats> {
  const headers = await getAuthHeaders()
  const [userRes, reposRes, contribRes] = await Promise.all([
    fetch(`https://api.github.com/users/${GITHUB_USER}`, { headers }),
    fetch(
      `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated`,
      { headers },
    ),
    fetch(`https://github.com/users/${GITHUB_USER}/contributions`, { headers }),
  ])

  if (!userRes.ok) throw new Error('GitHub user fetch failed')

  // GitHub API responses are cast once at this boundary to their documented
  // shapes — no schema library in the project, and each access below is a
  // plain property read from a typed value.
  const user = (await userRes.json()) as {
    login: string
    name: string | null
    avatar_url: string
    bio: string | null
    followers: number
    following: number
    public_repos: number
    html_url: string
  }
  const rawRepos = (reposRes.ok ? await reposRes.json() : []) as Array<{
    stargazers_count?: number
    forks_count?: number
    language?: string | null
  }>

  const days: GitHubDay[] = []
  let totalContributions = 0
  if (contribRes.ok) {
    const html = await contribRes.text()
    const re = /data-date="([^"]+)"[^>]*data-level="([0-4])"/g
    let match: RegExpExecArray | null
    while ((match = re.exec(html)) !== null) {
      const level = Number(match[2])
      days.push({ date: match[1], level })
      totalContributions += level
    }
  }

  let longestStreak = 0
  let run = 0
  let activeDays = 0
  for (const day of days) {
    if (day.level > 0) {
      run += 1
      activeDays += 1
      longestStreak = Math.max(longestStreak, run)
    } else {
      run = 0
    }
  }

  let currentStreak = 0
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].level > 0) currentStreak += 1
    else break
  }

  const avgPerActiveDay =
    activeDays > 0 ? Math.round((totalContributions / activeDays) * 10) / 10 : 0

  let totalStars = 0
  let totalForks = 0
  const langCount = new Map<string, number>()
  for (const repo of rawRepos) {
    totalStars += repo.stargazers_count ?? 0
    totalForks += repo.forks_count ?? 0
    if (repo.language) {
      langCount.set(repo.language, (langCount.get(repo.language) ?? 0) + 1)
    }
  }

  const topLanguages = [...langCount.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6)

  return {
    user: {
      login: user.login,
      name: user.name,
      avatarUrl: user.avatar_url,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      publicRepos: user.public_repos,
      htmlUrl: user.html_url,
    },
    days,
    totalContributions,
    totalStars,
    totalForks,
    topLanguages,
    activity: { currentStreak, longestStreak, activeDays, avgPerActiveDay },
  }
}

export const getGitHubStats = createServerFn({ method: 'GET' }).handler(
  async (): Promise<GitHubStats | null> => {
    const db = await getDb()
    let cachedStats: GitHubStats | null = null
    let lockHeld = false

    if (db) {
      try {
        const row = await db
          .prepare('SELECT value, expires_at FROM cache WHERE key = ?')
          .bind(CACHE_KEY)
          .first<{ value: string; expires_at: number }>()

        if (row) {
          try {
            cachedStats = JSON.parse(row.value) as GitHubStats
          } catch {
            cachedStats = null
          }
          if (cachedStats && row.expires_at > Date.now()) {
            return cachedStats
          }
        }

        // Atomic lock: only the request that wins the insert fetches and stores.
        const lock = await db
          .prepare('INSERT OR IGNORE INTO cache (key, value, expires_at) VALUES (?, ?, ?)')
          .bind(`${CACHE_KEY}:lock`, '1', Date.now() + LOCK_TTL)
          .run()
        lockHeld = lock.meta.changes === 1

        if (!lockHeld && cachedStats) {
          // Another request is refreshing — serve stale instead of stampeding GitHub.
          return cachedStats
        }
      } catch {
        // Cache unavailable (e.g. migrations not applied) — fetch live below.
        lockHeld = false
      }
    }

    try {
      const stats = await fetchStats()
      if (db) {
        try {
          await db
            .prepare('INSERT OR REPLACE INTO cache (key, value, expires_at) VALUES (?, ?, ?)')
            .bind(CACHE_KEY, JSON.stringify(stats), Date.now() + CACHE_TTL)
            .run()
        } catch {
          // Cache write failed — still serve the fresh stats.
        }
      }
      return stats
    } catch (error) {
      console.error('[github] stats fetch failed', error)
      return cachedStats
    } finally {
      if (db && lockHeld) {
        try {
          await db.prepare('DELETE FROM cache WHERE key = ?').bind(`${CACHE_KEY}:lock`).run()
        } catch {
          // Lock cleanup is best-effort — it expires on its own via LOCK_TTL.
        }
      }
    }
  },
)
