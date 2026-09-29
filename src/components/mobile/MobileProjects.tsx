import type { Project } from '@/types/site'
import MobileShell from '@/components/mobile/MobileShell'

export default function MobileProjects({ projects }: { projects: Project[] }) {
  return (
    <MobileShell label="Projects">
      <ul className="space-y-4">
        {projects.map((project) => {
          const isOngoing = project.status === 'ongoing'
          return (
            <li key={project.id}>
              <article className="overflow-hidden rounded-[14px] border border-line bg-paper">
                {project.image ? (
                  <img
                    src={project.image}
                    alt={project.title}
                    loading="lazy"
                    className="aspect-[16/9] w-full border-b border-line object-cover"
                  />
                ) : null}
                <div className="p-4">
                  <h2 className="font-sans font-semibold text-xl leading-tight text-ink">{project.title}</h2>
                  <p className="mt-1 text-sm font-medium text-graphite">
                    {project.role || 'Lead developer'}
                  </p>
                  <p className="mt-3 flex items-center gap-x-3 gap-y-1 text-sm font-medium uppercase tracking-[0.14em] text-graphite">
                    <span
                      className={`inline-flex items-center gap-1.5 ${isOngoing ? 'text-graphite' : 'text-brand'}`}
                    >
                      <span
                        aria-hidden="true"
                        className={`h-1 w-1 rounded-full ${isOngoing ? 'bg-deep-line' : 'bg-rosso'}`}
                      />
                      {isOngoing ? 'Ongoing' : 'Done'}
                    </span>
                    <span aria-hidden="true" className="h-1 w-1 rounded-full bg-rosso" />
                    {project.year || '—'}
                    <span aria-hidden="true" className="h-1 w-1 rounded-full bg-rosso" />
                    <span className="min-w-0 truncate">{project.stack || '—'}</span>
                  </p>
                  {project.link ? (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex min-h-11 items-center justify-center rounded-full border border-ink px-5 py-2 text-sm font-medium uppercase tracking-[0.14em] text-ink transition-colors duration-200 hover:bg-ink hover:text-canvas"
                    >
                      Visit site
                    </a>
                  ) : null}
                </div>
              </article>
            </li>
          )
        })}
      </ul>
    </MobileShell>
  )
}
