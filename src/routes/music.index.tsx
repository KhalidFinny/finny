import { createFileRoute, useLoaderData } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useRef } from 'react'
import Music from '@/components/sections/Music'
import Ticker from '@/components/sections/Ticker'
import MobileShell from '@/components/mobile/MobileShell'
import Skeleton from '@/components/ui/Skeleton'
import WindowHeader from '@/components/wireframe/home/WindowHeader'
import { navItems } from '@/components/wireframe/home/data'
import useHomeMotion from '@/components/wireframe/home/useHomeMotion'
import { queryClient } from '@/lib/queryClient'
import { lastFmQueryOptions, siteQueryOptions } from '@/lib/queries'

export const Route = createFileRoute('/music/')({
  loader: () =>
    Promise.all([
      queryClient.ensureQueryData(siteQueryOptions),
      queryClient.ensureQueryData(lastFmQueryOptions),
    ]),
  component: MusicPage,
})

function MusicPage() {
  const [loaderSite, loaderMusic] = useLoaderData({ from: '/music/' })
  const siteQuery = useQuery({ ...siteQueryOptions, initialData: loaderSite })
  const musicQuery = useQuery({ ...lastFmQueryOptions, initialData: loaderMusic })
  const rootRef = useRef<HTMLDivElement>(null)
  useHomeMotion(rootRef)

  const data = siteQuery.data
  const music = musicQuery.data

  if (!data) {
    return (
      <div className="h-dvh bg-wall p-1.5 md:p-3">
        <div className="mx-auto flex h-full max-w-[1760px] flex-col overflow-hidden rounded-[18px] border border-line bg-paper">
          <WindowHeader items={navItems} />
          <div className="border-b border-line bg-canvas px-4 py-3 md:px-6">
            <Skeleton className="h-4 w-44" />
          </div>
          <main className="min-h-0 flex-1 overflow-y-auto border-b border-line px-4 py-4 md:px-5">
            <Skeleton className="h-24 w-full" />
            <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-6">
              <Skeleton className="h-40 md:col-span-3" />
              <Skeleton className="h-40 md:col-span-3" />
            </div>
            <Skeleton className="mt-3 h-40 w-full" />
          </main>
          <div className="h-12 shrink-0 border-t border-line bg-paper" />
        </div>
      </div>
    )
  }

  const { experiences, projects, techs, profile } = data

  return (
    <>
      <div className="md:hidden">
        <MobileShell label="Music">
          {music ? (
            <Music data={music} />
          ) : (
            <p className="py-10 text-center font-mono text-xs uppercase tracking-[0.2em] text-graphite">
              Last.fm isn&apos;t connected — set LASTFM_API_KEY and LASTFM_USER.
            </p>
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
        <div className="border-b border-line bg-canvas px-4 py-2.5 md:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-sm font-medium uppercase tracking-[0.14em] text-brand">
              Music · on repeat
            </h2>
          </div>
        </div>
        <main className="min-h-0 flex-1 overflow-y-auto border-b border-line animate-[page-in_300ms_ease-out] motion-reduce:animate-none">
          {music ? (
            <Music data={music} />
          ) : (
            <div className="px-4 py-16 text-center md:px-6">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-graphite">
                Last.fm isn't connected — set LASTFM_API_KEY and LASTFM_USER.
              </p>
            </div>
          )}
        </main>
        <Ticker experiences={experiences} projects={projects} techs={techs} />
        </div>
      </div>
      </div>
    </>
  )
}
