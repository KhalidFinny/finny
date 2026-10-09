import { createFileRoute, useLoaderData } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useRef } from 'react'
import ExperienceRecord from '@/components/sections/experience/ExperienceRecord'
import Ticker from '@/components/sections/Ticker'
import Skeleton from '@/components/ui/Skeleton'
import MobileExperiences from '@/components/mobile/MobileExperiences'
import WindowHeader from '@/components/wireframe/home/WindowHeader'
import { navItems } from '@/components/wireframe/home/data'
import useHomeMotion from '@/components/wireframe/home/useHomeMotion'
import AppScale from '@/components/site/AppScale'
import { queryClient } from '@/lib/queryClient'
import { siteQueryOptions } from '@/lib/queries'
import { buildPageHead } from '@/lib/seo'

export const Route = createFileRoute('/experiences/')({
  head: () =>
    buildPageHead({
      title: "Experiences — Khalid's Garage",
      description:
        "Where I've worked and what I've built — internships, freelance work, and the organizations I've led.",
      image: 'experiences',
      path: '/experiences',
    }),
  loader: () => queryClient.ensureQueryData(siteQueryOptions),
  pendingComponent: ExperiencesPending,
  pendingMs: 0,
  component: ExperiencesPage,
})

function ExperiencesPending() {
  return (
    <>
      <div className="md:hidden min-h-dvh bg-wall">
        <Skeleton className="h-36 w-full rounded-none border-0" />
      </div>
      <div className="hidden md:block">
        <AppScale>
          <div className="flex h-full w-full flex-col overflow-hidden rounded-[18px] border border-line bg-paper">
            <WindowHeader items={navItems} />
            <main className="min-h-0 flex-1 overflow-y-auto border-b border-line px-4 py-6 md:px-6">
              <div className="space-y-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            </main>
            <div className="h-12 shrink-0 border-t border-line bg-paper" />
          </div>
        </AppScale>
      </div>
    </>
  )
}

function ExperiencesPage() {
  const loaderData = useLoaderData({ from: '/experiences/' })
  const { data } = useQuery({ ...siteQueryOptions, initialData: loaderData })
  const rootRef = useRef<HTMLDivElement>(null)
  useHomeMotion(rootRef)

  if (!data) {
    return <ExperiencesPending />
  }

  const { experiences, projects, techs, profile } = data

  return (
    <>
      <div className="md:hidden">
        <MobileExperiences experiences={experiences} />
      </div>
      <div className="hidden md:block">
        <AppScale>
      <div
        ref={rootRef}
        data-motion-pending="false"
        data-motion-ready="false"
        className="flex h-full w-full flex-col overflow-hidden rounded-[18px] border border-line bg-paper"
      >
        <WindowHeader items={navItems} cvHref={profile.cv_path} />
        <main className="min-h-0 flex-1 overflow-y-auto border-b border-line animate-[page-in_300ms_ease-out] motion-reduce:animate-none">
          <ExperienceRecord experiences={experiences} />
        </main>
        <Ticker experiences={experiences} projects={projects} techs={techs} />
        </div>
        </AppScale>
      </div>
    </>
  )
}
