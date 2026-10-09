import { createFileRoute, useLoaderData, useNavigate, useSearch } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useRef } from 'react'
import ProjectsTabs from '@/components/sections/projects/ProjectsTabs'
import {
  PROJECTS_TABS,
  type ProjectsTabId,
  type ProjectsViewId,
} from '@/components/sections/projects/projectsConfig'
import Ticker from '@/components/sections/Ticker'
import Skeleton from '@/components/ui/Skeleton'
import MobileProjects from '@/components/mobile/MobileProjects'
import WindowHeader from '@/components/wireframe/home/WindowHeader'
import { navItems } from '@/components/wireframe/home/data'
import useHomeMotion from '@/components/wireframe/home/useHomeMotion'
import AppScale from '@/components/site/AppScale'
import { queryClient } from '@/lib/queryClient'
import { siteQueryOptions } from '@/lib/queries'
import { buildPageHead } from '@/lib/seo'

export const Route = createFileRoute('/projects/')({
  head: () =>
    buildPageHead({
      title: "Projects — Khalid's Garage",
      description:
        'Programming, UI/UX, photography, and video work — selected projects from the garage.',
      image: 'projects',
      path: '/projects',
    }),
  validateSearch: (search: Record<string, unknown>): ProjectsSearch => {
    const tab = search.tab
    const view = search.view === 'photo' || search.view === 'video' ? search.view : undefined
    return {
      ...(PROJECTS_TABS.some((t) => t.id === tab) ? { tab: tab as ProjectsTabId } : {}),
      ...(view ? { view } : {}),
    }
  },
  loader: () => queryClient.ensureQueryData(siteQueryOptions),
  pendingComponent: ProjectsPending,
  pendingMs: 0,
  component: ProjectsPage,
})

interface ProjectsSearch {
  tab?: ProjectsTabId
  view?: ProjectsViewId
}

function ProjectsPending() {
  return (
    <>
      <div className="md:hidden min-h-dvh bg-wall">
        <Skeleton className="h-36 w-full rounded-none border-0" />
      </div>
      <div className="hidden md:block">
        <AppScale>
          <div className="flex h-full w-full flex-col overflow-hidden rounded-[18px] border border-line bg-paper">
            <WindowHeader items={navItems} />
            <div className="border-b border-line px-4 py-2.5 md:px-6">
              <div className="flex gap-2">
                <Skeleton className="h-9 w-28" />
                <Skeleton className="h-9 w-24" />
              </div>
            </div>
            <main className="min-h-0 flex-1 overflow-y-auto border-b border-line px-4 py-6 md:px-6 md:grid md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:gap-4">
              <div className="space-y-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
              <div className="mt-4 md:mt-0">
                <Skeleton className="h-96 w-full" />
              </div>
            </main>
            <div className="h-12 shrink-0 border-t border-line bg-paper" />
          </div>
        </AppScale>
      </div>
    </>
  )
}

function ProjectsPage() {
  const loaderData = useLoaderData({ from: '/projects/' })
  const { data } = useQuery({ ...siteQueryOptions, initialData: loaderData })
  const search = useSearch({ from: '/projects/' })
  const navigate = useNavigate({ from: '/projects/' })
  const tab: ProjectsTabId = search.tab ?? 'programming'
  const view: ProjectsViewId = search.view ?? 'photo'
  const setTab = (next: ProjectsTabId) => void navigate({ search: { tab: next } })
  const setView = (next: ProjectsViewId) =>
    void navigate({ search: { tab: search.tab ?? 'creative', view: next } })
  const rootRef = useRef<HTMLDivElement>(null)
  useHomeMotion(rootRef)

  if (!data) {
    return <ProjectsPending />
  }

  const { projects, experiences, techs, profile } = data

  return (
    <>
      <div className="md:hidden">
        <MobileProjects projects={projects} />
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
        <ProjectsTabs
          projects={projects}
          tab={tab}
          view={view}
          onTabChange={setTab}
          onViewChange={setView}
        />
        <Ticker experiences={experiences} projects={projects} techs={techs} />
        </div>
        </AppScale>
      </div>
    </>
  )
}
