import { createFileRoute, useLoaderData } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useRef } from 'react'
import Experience from '@/components/sections/Experience'
import Ticker from '@/components/sections/Ticker'
import Skeleton from '@/components/ui/Skeleton'
import MobileExperiences from '@/components/mobile/MobileExperiences'
import WindowHeader from '@/components/wireframe/home/WindowHeader'
import { navItems } from '@/components/wireframe/home/data'
import useHomeMotion from '@/components/wireframe/home/useHomeMotion'
import { queryClient } from '@/lib/queryClient'
import { siteQueryOptions } from '@/lib/queries'

export const Route = createFileRoute('/experiences/')({
  loader: () => queryClient.ensureQueryData(siteQueryOptions),
  component: ExperiencesPage,
})

function ExperiencesPage() {
  const loaderData = useLoaderData({ from: '/experiences/' })
  const { data } = useQuery({ ...siteQueryOptions, initialData: loaderData })
  const rootRef = useRef<HTMLDivElement>(null)
  useHomeMotion(rootRef)

  if (!data) {
    return (
      <div className="h-dvh bg-wall p-1.5 md:p-3">
        <div className="mx-auto flex h-full max-w-[1760px] flex-col overflow-hidden rounded-[18px] border border-line bg-paper">
          <WindowHeader items={navItems} />
          <div className="border-b border-line bg-canvas px-4 py-3 md:px-6">
            <Skeleton className="h-4 w-44" />
          </div>
          <main className="min-h-0 flex-1 overflow-y-auto border-b border-line px-4 py-6 md:px-6">
            <div className="space-y-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
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
        <MobileExperiences experiences={experiences} />
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
            <p className="text-sm font-medium uppercase tracking-[0.14em] text-brand">Service log</p>
            <p className="text-sm font-medium uppercase tracking-[0.14em] text-brand">
              {experiences.length} records on file
            </p>
          </div>
        </div>
        <main className="min-h-0 flex-1 overflow-y-auto border-b border-line animate-[page-in_300ms_ease-out] motion-reduce:animate-none">
          <Experience experiences={experiences} />
        </main>
        <Ticker experiences={experiences} projects={projects} techs={techs} />
        </div>
      </div>
      </div>
    </>
  )
}
