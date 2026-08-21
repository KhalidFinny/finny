import { getSiteData } from '@/server/site'
import { getGitHubStats } from '@/server/github'
import { getLastFmData } from '@/server/lastfm'

export const siteQueryOptions = {
  queryKey: ['site'] as const,
  queryFn: () => getSiteData(),
}

export const githubQueryOptions = {
  queryKey: ['github'] as const,
  queryFn: () => getGitHubStats(),
}

export const lastFmQueryOptions = {
  queryKey: ['lastfm'] as const,
  queryFn: () => getLastFmData(),
}
