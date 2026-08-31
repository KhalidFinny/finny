import { createFileRoute, useLoaderData } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useRef, useState } from 'react'
import ProjectsCatalog from '@/components/sections/ProjectsCatalog'
import ProjectsGallery from '@/components/sections/ProjectsGallery'
import Ticker from '@/components/sections/Ticker'
import EmptyStatePanel from '@/components/site/EmptyStatePanel'
import Skeleton from '@/components/ui/Skeleton'
import MobileProjects from '@/components/mobile/MobileProjects'
import WindowHeader from '@/components/wireframe/home/WindowHeader'
import { navItems } from '@/components/wireframe/home/data'
import useHomeMotion from '@/components/wireframe/home/useHomeMotion'
import { queryClient } from '@/lib/queryClient'
import { siteQueryOptions } from '@/lib/queries'

export const Route = createFileRoute('/projects/')({
  loader: () => queryClient.ensureQueryData(siteQueryOptions),
  pendingComponent: ProjectsPending,
  pendingMs: 0,
  component: ProjectsPage,
})

const TABS = [
  { id: 'programming', label: 'Programming' },
  { id: 'creative', label: 'Creative' },
] as const

type TabId = (typeof TABS)[number]['id']

function ProjectsPending() {
  return (
    <div className="h-dvh bg-wall p-1.5 md:p-3">
      <div className="mx-auto flex h-full max-w-[1760px] flex-col overflow-hidden rounded-[18px] border border-line bg-paper">
        <WindowHeader items={navItems} />
        <div className="border-b border-line px-4 py-2.5 md:px-6">
          <div className="flex gap-2">
            <Skeleton className="h-9 w-28" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>
        <main className="min-h-0 flex-1 overflow-y-auto border-b border-line px-4 py-6 md:grid md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:gap-4 md:px-6">
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
    </div>
  )
}

function ProjectsPage() {
  const loaderData = useLoaderData({ from: '/projects/' })
  const { data } = useQuery({ ...siteQueryOptions, initialData: loaderData })
  const [tab, setTab] = useState<TabId>('programming')
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
        <div className="h-dvh bg-wall p-1.5 md:p-3">
      <div
        ref={rootRef}
        data-motion-pending="false"
        data-motion-ready="false"
        className="mx-auto flex h-full max-w-[1760px] flex-col overflow-hidden rounded-[18px] border border-line bg-paper page-grid"
      >
        <WindowHeader items={navItems} cvHref={profile.cv_path} />
        <div role="tablist" aria-label="Project views" className="border-b border-line px-4 py-2.5 md:px-6">
          <div className="motion-enter motion-step-2 flex items-center gap-2">
            {TABS.map((item) => (
              <button
                key={item.id}
                id={`projects-tab-${item.id}`}
                role="tab"
                type="button"
                tabIndex={tab === item.id ? 0 : -1}
                aria-selected={tab === item.id}
                aria-controls={`projects-panel-${item.id}`}
                onClick={() => setTab(item.id)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium uppercase tracking-[0.14em] transition-colors duration-200 ${
                  tab === item.id
                    ? 'bg-ink text-paper'
                    : 'text-graphite hover:bg-canvas hover:text-ink'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
        <main className={`min-h-0 flex-1 border-b border-line animate-[page-in_300ms_ease-out] motion-reduce:animate-none ${tab === 'programming' ? 'overflow-y-auto xl:overflow-hidden' : 'overflow-y-auto'}`}>
          {projects.length === 0 ? (
            <div className="p-4 md:p-6">
              <EmptyStatePanel
                label="Garage empty"
                title="No projects on the lift yet"
                description="Publish the first project and it lands in this catalog."
              />
            </div>
          ) : (
          <div key={tab} className="h-full animate-[page-in_250ms_ease-out] motion-reduce:animate-none">
            {tab === 'programming' ? (
              <div id="projects-panel-programming" role="tabpanel" aria-labelledby="projects-tab-programming" className="h-full">
                <ProjectsCatalog projects={projects} />
              </div>
            ) : (
              <div id="projects-panel-creative" role="tabpanel" aria-labelledby="projects-tab-creative">
                <ProjectsGallery projects={projects} />
              </div>
            )}
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
