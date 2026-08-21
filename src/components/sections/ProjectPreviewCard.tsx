import { useState } from 'react'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { faGlobe } from '@fortawesome/free-solid-svg-icons'
import type { Project } from '@/types/site'
import FaIcon from '@/components/ui/FaIcon'
import Lightbox from '@/components/site/Lightbox'

const ROLE_FALLBACK = 'Lead developer'
const STACK_FALLBACK = 'React · TypeScript · Vite'
const DEFAULT_GITHUB = 'https://github.com/khalidfinny'

function parseGallery(project: Project): string[] {
  try {
    const parsed: unknown = JSON.parse(project.gallery ?? '[]')
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === 'string' && item.length > 0)
      : []
  } catch {
    return []
  }
}

export default function ProjectPreviewCard({ project }: { project: Project }) {
  const roles = (project.role || ROLE_FALLBACK)
    .split('|')
    .map((role) => role.trim())
    .filter(Boolean)
  const stack = project.stack || STACK_FALLBACK
  const isOngoing = project.status === 'ongoing'
  const titleId = `project-preview-${project.id}`
  const shots = project.image ? [project.image, ...parseGallery(project)] : parseGallery(project)
  const [preview, setPreview] = useState<string | null>(null)

  return (
    <>
      <article
        aria-labelledby={titleId}
        className="animate-[preview-in_260ms_ease-out] motion-reduce:animate-none px-4 py-4 md:px-6 md:py-5"
      >
        <div className="flex items-baseline justify-between gap-3">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand">Project preview</p>
          <p
            className={`inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.2em] ${
              isOngoing ? 'text-brand' : 'text-graphite'
            }`}
          >
            <span
              aria-hidden="true"
              className={`h-1.5 w-1.5 rounded-full ${isOngoing ? 'bg-rosso' : 'bg-deep-line'}`}
            />
            {isOngoing ? 'Ongoing' : 'Done'}
          </p>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="flex items-center rounded-[14px] border border-line bg-canvas px-5 py-4">
            <h2
              id={titleId}
              className="font-serif text-3xl leading-[1.05] text-ink md:text-4xl"
            >
              {project.title}
            </h2>
          </div>
          <nav aria-label="Project links" className="flex flex-col justify-center gap-2.5">
            {project.link ? (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-full border border-ink px-5 py-2 font-mono text-xs uppercase tracking-[0.2em] text-ink transition-colors duration-200 hover:bg-ink hover:text-canvas"
              >
                <FaIcon icon={faGlobe} className="h-4 w-4" />
                Website
              </a>
            ) : (
              <span className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-full border border-line px-5 py-2 font-mono text-xs uppercase tracking-[0.2em] text-mist">
                <FaIcon icon={faGlobe} className="h-4 w-4" />
                Not deployed
              </span>
            )}
            <a
              href={project.source_link || DEFAULT_GITHUB}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-full border border-line px-5 py-2 font-mono text-xs uppercase tracking-[0.2em] text-graphite transition-colors duration-200 hover:border-ink hover:text-ink"
            >
              <FaIcon icon={faGithub} className="h-4 w-4" />
              GitHub
            </a>
          </nav>
        </div>

        <dl className="mt-3 flex flex-wrap gap-2">
          {roles.map((role) => (
            <div key={role} className="rounded-[10px] border border-line bg-canvas px-3.5 py-2">
              <dt className="font-mono text-xs uppercase tracking-[0.2em] text-graphite">Role</dt>
              <dd className="mt-0.5 text-sm font-medium text-ink">{role}</dd>
            </div>
          ))}
          <div className="rounded-[10px] border border-line bg-canvas px-3.5 py-2">
            <dt className="font-mono text-xs uppercase tracking-[0.2em] text-graphite">Year</dt>
            <dd className="mt-0.5 text-sm font-medium text-ink">{project.year || '—'}</dd>
          </div>
          <div className="rounded-[10px] border border-line bg-canvas px-3.5 py-2">
            <dt className="font-mono text-xs uppercase tracking-[0.2em] text-graphite">Stack</dt>
            <dd className="mt-0.5 text-sm font-medium text-ink">{stack}</dd>
          </div>
        </dl>

        {project.description ? (
          <p className="mt-3 line-clamp-3 rounded-[14px] border border-line bg-canvas px-5 py-4 text-sm leading-relaxed text-ink md:text-base">
            {project.description}
          </p>
        ) : null}

        {shots.length > 0 ? (
          <div className="mt-4 grid grid-cols-2 gap-3">
            {shots.map((shot, index) => (
              <button
                key={`${shot}-${index}`}
                type="button"
                onClick={() => setPreview(shot)}
                aria-label={`Preview ${index === 0 ? project.title : `shot ${index + 1}`}`}
                className="group relative block aspect-[16/9] overflow-hidden rounded-[14px] border border-line bg-canvas transition-colors duration-200 hover:border-deep-line"
              >
                <img
                  src={shot}
                  alt={index === 0 ? project.title : `${project.title} — shot ${index + 1}`}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.02] motion-reduce:transform-none"
                />
              </button>
            ))}
          </div>
        ) : null}
      </article>

      {preview ? (
        <Lightbox kind="image" url={preview} title={project.title} onClose={() => setPreview(null)} />
      ) : null}
    </>
  )
}
