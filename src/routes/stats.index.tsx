import { createFileRoute, useLoaderData } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import GitHubStats from '@/components/sections/GitHubStats'
import Ticker from '@/components/sections/Ticker'
import MobileShell from '@/components/mobile/MobileShell'
import EmptyStatePanel from '@/components/site/EmptyStatePanel'
import Skeleton from '@/components/ui/Skeleton'
import useHomeMotion from '@/components/wireframe/home/useHomeMotion'
import { queryClient } from '@/lib/queryClient'
import { githubQueryOptions, siteQueryOptions } from '@/lib/queries'
import { buildPageHead } from '@/lib/seo'

export const Route = createFileRoute('/stats/')({
  head: () =>
    buildPageHead({
      title: "Stats — Khalid's Garage",
      description: 'Live numbers from the garage — GitHub activity and the stats behind the work.',
      image: 'stats',
      path: '/stats',
    }),
  loader: async () => {
    void queryClient.prefetchQuery(githubQueryOptions)
    return queryClient.ensureQueryData(siteQueryOptions)
  },
  pendingComponent: StatsPending,
  pendingMs: 0,
  component: StatsPage,
})

function StatsSkeleton() {
  return (
    <div className="px-4 py-6 md:px-6">
      <Skeleton className="h-48 w-full" />
      <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-6">
        <Skeleton className="h-28 md:col-span-2" />
        <Skeleton className="h-28 md:col-span-4" />
        <Skeleton className="h-32 md:col-span-3" />
        <Skeleton className="h-32 md:col-span-3" />
      </div>
    </div>
  )
}

function StatsUnavailable() {
  return (
    <EmptyStatePanel
      label="Data offline"
      title="GitHub is unreachable"
      description="The public ledger is unavailable right now. Give it a minute and try again."
    />
  )
}

function StatsPending() {
  return (
    <>
      <div className="md:hidden min-h-dvh bg-wall">
        <StatsSkeleton />
      </div>
      <div className="hidden md:block">
          <div className="flex h-full w-full flex-col overflow-hidden rounded-[18px] border border-line bg-paper">
            <main className="min-h-0 flex-1 overflow-y-auto border-b border-line px-4 py-6 md:px-6">
              <StatsSkeleton />
            </main>
            <div className="h-12 shrink-0 border-t border-line bg-paper" />
          </div>
      </div>
    </>
  )
}

function StatsPage() {
  const loaderSite = useLoaderData({ from: '/stats/' })
  const siteQuery = useQuery({ ...siteQueryOptions, initialData: loaderSite })
  const githubQuery = useQuery(githubQueryOptions)
  const motionReady = useHomeMotion()

  const data = siteQuery.data
  const github = githubQuery.data
  const isGitHubLoading = githubQuery.isPending && !github

  if (!data) {
    return <StatsPending />
  }

  const { experiences, projects, techs, profile } = data

  return (
    <>
      <div className="md:hidden">
        <MobileShell label="Stats">
          {isGitHubLoading ? (
            <StatsSkeleton />
          ) : github ? (
            <GitHubStats stats={github} />
          ) : (
            <StatsUnavailable />
          )}
        </MobileShell>
      </div>
      <div className="hidden md:block">
      <div
        data-motion-pending="false"
        data-motion-ready={motionReady ? 'true' : 'false'}
        className="flex h-full w-full flex-col overflow-hidden rounded-[18px] border border-line bg-paper"
      >
        <main className="min-h-0 flex-1 overflow-y-auto border-b border-line animate-[page-in_300ms_ease-out] motion-reduce:animate-none">
          {isGitHubLoading ? (
            <StatsSkeleton />
          ) : github ? (
            <GitHubStats stats={github} />
          ) : (
            <StatsUnavailable />
          )}
        </main>
        <Ticker experiences={experiences} projects={projects} techs={techs} />
        </div>
      </div>
    </>
  )
}
