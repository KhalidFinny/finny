import { createFileRoute, useLoaderData } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useRef } from 'react'
import Music from '@/components/sections/Music'
import Ticker from '@/components/sections/Ticker'
import MobileShell from '@/components/mobile/MobileShell'
import EmptyStatePanel from '@/components/site/EmptyStatePanel'
import Skeleton from '@/components/ui/Skeleton'
import WindowHeader from '@/components/wireframe/home/WindowHeader'
import { navItems } from '@/components/wireframe/home/data'
import useHomeMotion from '@/components/wireframe/home/useHomeMotion'
import { queryClient } from '@/lib/queryClient'
import { lastFmQueryOptions, siteQueryOptions } from '@/lib/queries'

export const Route = createFileRoute('/music/')({
  loader: async () => {
    void queryClient.prefetchQuery(lastFmQueryOptions)
    return queryClient.ensureQueryData(siteQueryOptions)
  },
  pendingComponent: MusicPending,
  pendingMs: 0,
  component: MusicPage,
})

function MusicSkeleton() {
  return (
    <div className="px-4 py-6 md:px-6">
      <div className="flex flex-col gap-3 md:grid md:grid-cols-12 md:items-start md:gap-3">
        <div className="space-y-3 md:col-span-4">
          <Skeleton className="aspect-square w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
        <div className="space-y-3 md:col-span-8">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
          </div>
          <Skeleton className="h-40 w-full" />
          <div className="grid gap-3 md:grid-cols-2">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </div>
    </div>
  )
}

function MusicUnavailable() {
  return (
    <EmptyStatePanel
      label="Signal lost"
      title="Music is offline right now"
      description="The listening feed is taking a breath. Check back later for the current rotation."
    />
  )
}

function MusicPending() {
  return (
    <div className="h-dvh bg-wall p-1.5 md:p-3">
      <div className="mx-auto flex h-full max-w-[1760px] flex-col overflow-hidden rounded-[18px] border border-line bg-paper">
        <WindowHeader items={navItems} />
        <main className="min-h-0 flex-1 overflow-y-auto border-b border-line px-4 py-6 md:px-6">
          <MusicSkeleton />
        </main>
        <div className="h-12 shrink-0 border-t border-line bg-paper" />
      </div>
    </div>
  )
}

function MusicPage() {
  const loaderSite = useLoaderData({ from: '/music/' })
  const siteQuery = useQuery({ ...siteQueryOptions, initialData: loaderSite })
  const musicQuery = useQuery(lastFmQueryOptions)
  const rootRef = useRef<HTMLDivElement>(null)
  useHomeMotion(rootRef)

  const data = siteQuery.data
  const music = musicQuery.data
  const isMusicLoading = musicQuery.isPending && !music

  if (!data) {
    return <MusicPending />
  }

  const { experiences, projects, techs, profile } = data

  return (
    <>
      <div className="md:hidden">
        <MobileShell label="Music">
          {isMusicLoading ? (
            <MusicSkeleton />
          ) : music ? (
            <Music data={music} />
          ) : (
            <MusicUnavailable />
          )}
        </MobileShell>
      </div>
      <div className="hidden md:block">
        <div className="h-dvh bg-wall p-1.5 md:p-3">
      <div
        ref={rootRef}
        data-motion-pending="false"
        data-motion-ready="false"
        className="mx-auto flex h-full max-w-[1760px] flex-col overflow-hidden rounded-[18px] border border-line bg-paper page-grid"
      >
        <WindowHeader items={navItems} cvHref={profile.cv_path} />
        <main className="min-h-0 flex-1 overflow-y-auto border-b border-line animate-[page-in_300ms_ease-out] motion-reduce:animate-none">
          {isMusicLoading ? (
            <MusicSkeleton />
          ) : music ? (
            <Music data={music} />
          ) : (
            <MusicUnavailable />
          )}
        </main>
        <Ticker experiences={experiences} projects={projects} techs={techs} />
        </div>
      </div>
      </div>
    </>
  )
}
