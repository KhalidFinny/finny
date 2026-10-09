import { getSiteData } from '@/server/site'
import { getGitHubStats } from '@/server/github'
import { getLastFmData } from '@/server/lastfm'
import { getPhotobyPhotos } from '@/server/photoby'

// Cache tiers (staleTime = how long a value is served without refetching):
// - site: 5min — small tables; admin saves invalidate ['site'] explicitly.
// - github: 1h — slow-moving external stats.
// - lastfm: 5min — listening feed, fresh enough for a portfolio.
// - photoby: 10min — photography uploaded from the photoby studio.
const SITE_STALE_TIME = 5 * 60 * 1000
const GITHUB_STALE_TIME = 60 * 60 * 1000
const LASTFM_STALE_TIME = 5 * 60 * 1000
const PHOTOBY_STALE_TIME = 10 * 60 * 1000

export const siteQueryOptions = {
  queryKey: ['site'] as const,
  queryFn: () => getSiteData(),
  staleTime: SITE_STALE_TIME,
}

export const githubQueryOptions = {
  queryKey: ['github'] as const,
  queryFn: () => getGitHubStats(),
  staleTime: GITHUB_STALE_TIME,
}

export const lastFmQueryOptions = {
  queryKey: ['lastfm'] as const,
  queryFn: () => getLastFmData(),
  staleTime: LASTFM_STALE_TIME,
}

export const photobyQueryOptions = {
  queryKey: ['photoby'] as const,
  queryFn: () => getPhotobyPhotos(),
  staleTime: PHOTOBY_STALE_TIME,
}
