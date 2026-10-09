import EmptyStatePanel from '@/components/site/EmptyStatePanel'
import ProjectsCatalog from '@/components/sections/ProjectsCatalog'
import ProjectsGallery from '@/components/sections/ProjectsGallery'
import type { Project } from '@/types/site'
import type { PhotobyCategory, PhotobyPhoto } from '@/server/photoby'
import {
  PROJECTS_TABS,
  type ProjectsTabId,
  type ProjectsViewId,
} from './projectsConfig'

// The current Projects presentation: a Programming/Creative tab pair over the
// catalog and the creative gallery. Extracted from the route so the lab can
// render it alongside the other layouts.
export default function ProjectsTabs({
  projects,
  photos,
  tab,
  view,
  onTabChange,
  onViewChange,
  activeCategory,
  onCategoryChange,
}: {
  projects: Project[]
  photos: PhotobyPhoto[]
  tab: ProjectsTabId
  view: ProjectsViewId
  onTabChange: (tab: ProjectsTabId) => void
  onViewChange: (view: ProjectsViewId) => void
  activeCategory: PhotobyCategory | null
  onCategoryChange: (category: PhotobyCategory | null) => void
}) {
  return (
    <>
      <div role="tablist" aria-label="Project views" className="border-b border-line px-4 py-2.5 md:px-6">
        <div className="motion-enter motion-step-2 flex items-center gap-2">
          {PROJECTS_TABS.map((item) => (
            <button
              key={item.id}
              id={`projects-tab-${item.id}`}
              role="tab"
              type="button"
              tabIndex={tab === item.id ? 0 : -1}
              aria-selected={tab === item.id}
              aria-controls={`projects-panel-${item.id}`}
              onClick={() => onTabChange(item.id)}
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

      <main
        className={`min-h-0 flex-1 border-b border-line animate-[page-in_300ms_ease-out] motion-reduce:animate-none ${
          tab === 'programming' ? 'overflow-y-auto md:overflow-hidden' : 'overflow-y-auto'
        }`}
      >
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
              <div
                id="projects-panel-programming"
                role="tabpanel"
                aria-labelledby="projects-tab-programming"
                className="h-full"
              >
                <ProjectsCatalog projects={projects} />
              </div>
            ) : (
              <div
                id="projects-panel-creative"
                role="tabpanel"
                aria-labelledby="projects-tab-creative"
              >
                <ProjectsGallery
                  projects={projects}
                  photos={photos}
                  view={view}
                  onViewChange={onViewChange}
                  activeCategory={activeCategory}
                  onCategoryChange={onCategoryChange}
                />
              </div>
            )}
          </div>
        )}
      </main>
    </>
  )
}
