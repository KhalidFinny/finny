import { useState } from 'react'
import EmptyStatePanel from '@/components/site/EmptyStatePanel'
import type { Project } from '@/types/site'
import ProjectPreviewCard from '@/components/sections/ProjectPreviewCard'

export default function ProjectsCatalog({ projects }: { projects: Project[] }) {
  const catalog = projects.filter((project) => project.category_id === 'programming')
  const [selectedId, setSelectedId] = useState<string | null>(catalog[0]?.id ?? null)
  const selected = catalog.find((project) => project.id === selectedId) ?? catalog[0] ?? null

  return (
    <section
      aria-labelledby="projects-catalog-heading"
      className="xl:grid xl:h-full xl:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]"
    >
      <div className="px-4 py-6 xl:min-h-0 xl:overflow-y-auto md:px-6">
        <h2 id="projects-catalog-heading" className="sr-only">
          Programming projects
        </h2>
        <p className="ui-sticker-label">
          Overview
        </p>

        {catalog.length === 0 ? (
          <div className="pt-6">
            <EmptyStatePanel
              label="Catalog empty"
              title="No programming projects yet"
              description="Add the first programming project and it will land here in the parts list."
            />
          </div>
        ) : (
          <ol className="mt-4 space-y-4 md:space-y-5">
            {catalog.map((project, index) => (
              <li key={project.id}>
                <article
                  className={`group motion-enter motion-step-${Math.min(index + 2, 5)} relative rounded-[14px] border bg-paper transition-colors duration-200 ${
                    selected?.id === project.id
                      ? 'border-brand bg-brand/[0.04] ring-1 ring-brand/25'
                      : 'border-line hover:border-ink hover:bg-canvas'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedId(project.id)}
                    aria-pressed={selected?.id === project.id}
                    className="w-full px-5 py-5 text-left md:px-6 md:py-6"
                  >
                    <span className="block">
                      <span
                        className={`line-clamp-2 font-sans font-semibold text-xl leading-tight transition-colors duration-200 md:text-2xl ${
                          selected?.id === project.id ? 'text-brand' : 'text-ink group-hover:text-brand'
                        }`}
                      >
                        {project.title}
                      </span>
                      <span className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-medium uppercase tracking-[0.14em] text-graphite">
                        <span>{project.role || 'Lead developer'}</span>
                        <span aria-hidden="true" className="h-1 w-1 rounded-full bg-rosso" />
                        <span>{project.year || '2026'}</span>
                        <span aria-hidden="true" className="h-1 w-1 rounded-full bg-rosso" />
                        <span>{project.stack || 'React · TypeScript · Vite'}</span>
                        <span aria-hidden="true" className="h-1 w-1 rounded-full bg-rosso" />
                        <span
                          className={`inline-flex items-center gap-1.5 ${
                            project.status === 'done' ? 'text-brand' : 'text-graphite'
                          }`}
                        >
                          <span
                            aria-hidden="true"
                            className={`h-1 w-1 rounded-full ${project.status === 'done' ? 'bg-rosso' : 'bg-deep-line'}`}
                          />
                          {project.status === 'ongoing' ? 'Ongoing' : 'Done'}
                        </span>
                      </span>
                    </span>
                  </button>
                </article>
              </li>
            ))}
          </ol>
        )}
      </div>

      <aside
        aria-labelledby="project-preview-heading"
        className="border-t border-line xl:min-h-0 xl:overflow-y-auto xl:border-l xl:border-t-0"
      >
        <h2 id="project-preview-heading" className="sr-only">
          Project preview
        </h2>
        {selected ? (
          <ProjectPreviewCard key={selected.id} project={selected} />
        ) : (
          <p className="px-4 py-6 text-sm font-medium uppercase tracking-[0.14em] text-graphite md:px-6 md:py-8">
            Select a part
          </p>
        )}
      </aside>
    </section>
  )
}
