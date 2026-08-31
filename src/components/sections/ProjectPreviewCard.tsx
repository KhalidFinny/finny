import { useState } from 'react'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { faGlobe } from '@fortawesome/free-solid-svg-icons'
import type { Project } from '@/types/site'
import FaIcon from '@/components/ui/FaIcon'
import Lightbox from '@/components/site/Lightbox'
import { getProjectShots } from '@/lib/project-media'

const ROLE_FALLBACK = 'Lead developer'
const STACK_FALLBACK = 'React · TypeScript · Vite'
const DEFAULT_GITHUB = 'https://github.com/khalidfinny'

const SECTION_LABEL_CLS = 'ui-sticker-label'
const CARD_LABEL_CLS = 'ui-label ui-label-brand'

export default function ProjectPreviewCard({ project }: { project: Project }) {
  const roles = (project.role || ROLE_FALLBACK)
    .split('|')
    .map((role) => role.trim())
    .filter(Boolean)
  const stack = project.stack || STACK_FALLBACK
  const isOngoing = project.status === 'ongoing'
  const titleId = `project-preview-${project.id}`
  const shots = getProjectShots(project)
  const [preview, setPreview] = useState<string | null>(null)

  return (
    <>
      <article
        aria-labelledby={titleId}
        className="animate-[preview-in_260ms_ease-out] motion-reduce:animate-none px-4 py-4 md:px-6 md:py-5"
      >
        <div className="flex items-baseline justify-between gap-3">
          <p className={SECTION_LABEL_CLS}>Project preview</p>
          <p
            className={`inline-flex items-center gap-1.5 text-sm font-medium uppercase tracking-[0.14em] ${
              isOngoing ? 'text-graphite' : 'text-brand'
            }`}
          >
            <span
              aria-hidden="true"
              className={`h-1 w-1 rounded-full ${isOngoing ? 'bg-deep-line' : 'bg-rosso'}`}
            />
            {isOngoing ? 'Ongoing' : 'Done'}
          </p>
        </div>

        <div className="mt-3 grid gap-2.5 sm:grid-cols-[minmax(0,1fr)_15.5rem] sm:items-end">
          <h2
            id={titleId}
            className="min-w-0 line-clamp-2 font-serif text-[clamp(2.1rem,3.8vw,3.25rem)] leading-[0.94] tracking-[-0.025em] text-ink [text-wrap:balance]"
          >
            {project.title}
          </h2>
          <nav aria-label="Project links" className="grid grid-cols-2 gap-2.5">
            {project.link ? (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-full border border-ink px-4 py-2 text-sm font-medium uppercase tracking-[0.14em] text-ink transition-colors duration-200 hover:bg-ink hover:text-canvas"
              >
                <FaIcon icon={faGlobe} className="h-4 w-4" />
                Website
              </a>
            ) : (
              <span className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-medium uppercase tracking-[0.14em] text-graphite">
                <FaIcon icon={faGlobe} className="h-4 w-4" />
                Not deployed
              </span>
            )}
            <a
              href={project.source_link || DEFAULT_GITHUB}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-medium uppercase tracking-[0.14em] text-graphite transition-colors duration-200 hover:border-ink hover:text-ink"
            >
              <FaIcon icon={faGithub} className="h-4 w-4" />
              GitHub
            </a>
          </nav>
        </div>

        <dl className="mt-3 grid items-start gap-x-8 gap-y-3 sm:grid-cols-[minmax(0,2fr)_8rem_minmax(0,1.15fr)]">
          <div className="min-w-0">
            <dt className={CARD_LABEL_CLS}>Role</dt>
            <dd className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm leading-relaxed text-ink md:text-base">
              {roles.map((role, index) => (
                <span key={role} className="inline-flex items-center gap-3">
                  {index > 0 ? (
                    <span aria-hidden="true" className="h-1 w-1 rounded-full bg-rosso" />
                  ) : null}
                  <span>{role}</span>
                </span>
              ))}
            </dd>
          </div>
          <div>
            <dt className={CARD_LABEL_CLS}>Year</dt>
            <dd className="mt-2 text-sm leading-relaxed text-ink md:text-base">{project.year || '—'}</dd>
          </div>
          <div className="min-w-0">
            <dt className={CARD_LABEL_CLS}>Stack</dt>
            <dd className="mt-2 text-sm leading-relaxed text-ink md:text-base">{stack}</dd>
          </div>
        </dl>

        {project.description ? (
          <p className="mt-3 line-clamp-3 rounded-[14px] border border-line bg-canvas px-5 py-4 text-base leading-relaxed text-ink">
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
                className="group relative block aspect-[16/9] overflow-hidden rounded-[14px] transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:scale-[1.01] hover:opacity-100 motion-reduce:transform-none"
              >
                <img
                  src={shot}
                  alt={index === 0 ? project.title : `${project.title} — shot ${index + 1}`}
                  loading="lazy"
                  className="h-full w-full object-cover"
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
