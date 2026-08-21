import { useState } from 'react'
import { faPlay } from '@fortawesome/free-solid-svg-icons'
import type { Project } from '@/types/site'
import FaIcon from '@/components/ui/FaIcon'
import Placeholder from '@/components/ui/Placeholder'
import Lightbox from '@/components/site/Lightbox'

export default function ProjectsGallery({ projects }: { projects: Project[] }) {
  const gallery = projects.filter((project) => project.category_id !== 'programming')
  const [video, setVideo] = useState<Project | null>(null)

  return (
    <section aria-labelledby="projects-gallery-heading" className="px-4 py-6 md:px-6">
      <h2 id="projects-gallery-heading" className="sr-only">
        Creative projects
      </h2>
      <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5">
        {gallery.map((project) => {
          const isVideo = Boolean(project.youtube_embed)
          const isOngoing = project.status === 'ongoing'
          const media = project.image ? (
            <img
              src={project.image}
              alt={project.title}
              loading="lazy"
              className="aspect-[4/3] w-full object-cover"
            />
          ) : (
            <Placeholder label={project.title} className="aspect-[4/3] w-full" />
          )

          if (isVideo) {
            return (
              <li key={project.id} className="motion-enter motion-step-4">
                <figure className="overflow-hidden rounded-[14px] border border-line bg-paper transition-colors duration-200 hover:border-deep-line">
                  <button
                    type="button"
                    onClick={() => setVideo(project)}
                    aria-label={`Play video: ${project.title}`}
                    className="group relative block w-full text-left"
                  >
                    {media}
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-ink/70 text-canvas transition-transform duration-200 group-hover:scale-105">
                        <FaIcon icon={faPlay} className="ml-0.5 h-4 w-4" />
                      </span>
                    </span>
                  </button>
                  <figcaption className="px-4 py-3 font-mono text-xs uppercase tracking-[0.2em] text-graphite">
                    <span className="inline-flex items-center gap-1.5">
                      <span
                        aria-hidden="true"
                        className={`h-1 w-1 rounded-full ${isOngoing ? 'bg-rosso' : 'bg-deep-line'}`}
                      />
                      {isOngoing ? 'Ongoing' : 'Done'}
                    </span>
                    <span aria-hidden="true" className="mx-1.5">·</span>
                    {project.title}
                  </figcaption>
                </figure>
              </li>
            )
          }

          return (
            <li key={project.id} className="motion-enter motion-step-4">
              <figure className="overflow-hidden rounded-[14px] border border-line bg-paper transition-colors duration-200 hover:border-deep-line">
                {media}
                <figcaption className="px-4 py-3 font-mono text-xs uppercase tracking-[0.2em] text-graphite">
                  <span className="inline-flex items-center gap-1.5">
                    <span
                      aria-hidden="true"
                      className={`h-1 w-1 rounded-full ${isOngoing ? 'bg-rosso' : 'bg-deep-line'}`}
                    />
                    {isOngoing ? 'Ongoing' : 'Done'}
                  </span>
                  <span aria-hidden="true" className="mx-1.5">·</span>
                  {project.title}
                </figcaption>
              </figure>
            </li>
          )
        })}
      </ul>

      {video && video.youtube_embed && (
        <Lightbox url={video.youtube_embed} title={video.title} onClose={() => setVideo(null)} />
      )}
    </section>
  )
}
