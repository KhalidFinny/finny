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
                  <p className="mt-3 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-graphite">
                    <span
                      aria-hidden="true"
                      className={`h-1.5 w-1.5 rounded-full ${isOngoing ? 'bg-rosso' : 'bg-deep-line'}`}
                    />
                    {isOngoing ? 'Ongoing' : 'Done'}
                    <span aria-hidden="true">·</span>
                    {project.year || '—'}
                    <span aria-hidden="true">·</span>
                    <span className="min-w-0 truncate">{project.stack || '—'}</span>
                  </p>
                  {project.link ? (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex min-h-10 items-center justify-center rounded-full border border-ink px-5 py-2 font-mono text-xs uppercase tracking-[0.2em] text-ink transition-colors duration-200 hover:bg-ink hover:text-canvas"
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
