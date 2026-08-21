import { useState } from 'react'
import type { Project } from '@/types/site'
import ProjectPreviewCard from '@/components/sections/ProjectPreviewCard'

export default function ProjectsCatalog({ projects }: { projects: Project[] }) {
  const catalog = projects.filter((project) => project.category_id === 'programming')
  const [selectedId, setSelectedId] = useState<string | null>(catalog[0]?.id ?? null)
  const selected = catalog.find((project) => project.id === selectedId) ?? catalog[0] ?? null

  return (
    <section
      aria-labelledby="projects-catalog-heading"
      className="md:grid md:h-full md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]"
    >
      <div className="px-4 py-6 md:min-h-0 md:overflow-y-auto md:px-6">
        <h2 id="projects-catalog-heading" className="sr-only">
          Programming projects
        </h2>
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-graphite md:text-sm">
          Overview
        </p>

        {catalog.length === 0 ? (
          <p className="pt-6 font-mono text-sm uppercase tracking-[0.2em] text-graphite">
            No parts in the catalog yet.
          </p>
        ) : (
          <ol className="mt-4 space-y-4 md:space-y-5">
            {catalog.map((project, index) => (
              <li key={project.id}>
                <article
                  className={`motion-enter motion-step-${Math.min(index + 2, 5)} rounded-[14px] border bg-paper transition-colors duration-200 ${
                    selected?.id === project.id
                      ? 'border-ink'
                      : 'border-line hover:border-deep-line'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedId(project.id)}
                    aria-pressed={selected?.id === project.id}
                    className="w-full px-5 py-5 text-left md:px-6 md:py-6"
                  >
                    <span className="block">
                      <span className="line-clamp-2 font-serif text-xl leading-tight text-ink md:text-2xl">
                        {project.title}
                      </span>
                      <span className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs uppercase tracking-[0.18em] text-graphite md:text-sm">
                        <span>{project.role || 'Lead developer'}</span>
                        <span aria-hidden="true" className="h-1 w-1 rounded-full bg-rosso" />
                        <span>{project.year || '2026'}</span>
                        <span aria-hidden="true" className="h-1 w-1 rounded-full bg-rosso" />
                        <span>{project.stack || 'React · TypeScript · Vite'}</span>
                        <span aria-hidden="true" className="h-1 w-1 rounded-full bg-rosso" />
                        <span className="inline-flex items-center gap-1.5">
                          <span
                            aria-hidden="true"
                            className={`h-1 w-1 rounded-full ${project.status === 'ongoing' ? 'bg-rosso' : 'bg-deep-line'}`}
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
        className="border-t border-line md:min-h-0 md:overflow-y-auto md:border-l md:border-t-0"
      >
        <h2 id="project-preview-heading" className="sr-only">
          Project preview
        </h2>
        {selected ? (
          <ProjectPreviewCard key={selected.id} project={selected} />
        ) : (
          <p className="px-4 py-6 font-mono text-xs uppercase tracking-[0.2em] text-graphite md:px-6 md:py-8">
            Select a part
          </p>
        )}
      </aside>
    </section>
  )
}
