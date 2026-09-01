import { useState } from 'react'
import { faPlay } from '@fortawesome/free-solid-svg-icons'
import type { Project } from '@/types/site'
import FaIcon from '@/components/ui/FaIcon'
import AlbumModal from '@/components/site/AlbumModal'
import EmptyStatePanel from '@/components/site/EmptyStatePanel'
import Lightbox from '@/components/site/Lightbox'
import Polaroid from '@/components/site/Polaroid'
import { coverSrcFor, getProjectShots } from '@/lib/project-media'

export default function ProjectsGallery({ projects }: { projects: Project[] }) {
  const creative = projects.filter((project) => project.category_id !== 'programming')
  const [video, setVideo] = useState<Project | null>(null)
  const [album, setAlbum] = useState<Project | null>(null)

  return (
    <section aria-labelledby="projects-gallery-heading" className="px-4 py-6 md:px-6">
      <h2 id="projects-gallery-heading" className="sr-only">
        Creative projects
      </h2>

      {creative.length === 0 ? (
        <EmptyStatePanel
          label="Creative work"
          title="Nothing on display yet"
          description="Publish a photography, video, or design project and its preview lands here."
        />
      ) : (
        <>
          <p className="ui-label ui-label-muted">
            {creative.length} project{creative.length === 1 ? '' : 's'} · photography · video · design
          </p>

          <ul className="mt-5 grid grid-cols-2 gap-x-5 gap-y-10 xl:grid-cols-3 md:gap-x-6">
            {creative.map((project, index) => {
              const isVideo = Boolean(project.youtube_embed)
              const isOngoing = project.status === 'ongoing'
              const shots = getProjectShots(project)

              const cover = (
                <Polaroid
                  src={coverSrcFor(project.image)}
                  fallbackSrc={project.image}
                  alt={project.title}
                  index={index}
                  caption={project.title}
                  meta={isOngoing ? 'Ongoing' : 'Done'}
                  metaClassName={isOngoing ? 'text-graphite' : 'text-brand'}
                  overlay={
                    isVideo ? (
                      <span className="absolute inset-0 flex items-center justify-center">
                        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-ink/70 text-canvas transition-transform duration-200 group-hover:scale-105">
                          <FaIcon icon={faPlay} className="ml-0.5 h-4 w-4" />
                        </span>
                      </span>
                    ) : undefined
                  }
                />
              )

              const handleOpen = () => {
                if (isVideo) setVideo(project)
                else if (shots.length > 0) setAlbum(project)
              }

              const isClickable = isVideo || shots.length > 0

              return (
                <li key={project.id} className="motion-enter motion-step-4">
                  {isClickable ? (
                    <button
                      type="button"
                      onClick={handleOpen}
                      aria-label={
                        isVideo ? `Play video: ${project.title}` : `Open album: ${project.title}`
                      }
                      className="group block w-full text-left"
                    >
                      {cover}
                    </button>
                  ) : (
                    cover
                  )}
                </li>
              )
            })}
          </ul>
        </>
      )}

      {video && video.youtube_embed && (
        <Lightbox url={video.youtube_embed} title={video.title} onClose={() => setVideo(null)} />
      )}
      {album && (
        <AlbumModal project={album} shots={getProjectShots(album)} onClose={() => setAlbum(null)} />
      )}
    </section>
  )
}
