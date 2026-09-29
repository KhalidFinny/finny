import { useState } from 'react'
import type { Project } from '@/types/site'
import AlbumModal from '@/components/site/AlbumModal'
import EmptyStatePanel from '@/components/site/EmptyStatePanel'
import Polaroid from '@/components/site/Polaroid'
import { coverSrcFor, getProjectShots } from '@/lib/project-media'
import { parseYouTubeId, youtubeWatchUrl } from '@/lib/youtube'

export default function ProjectsGallery({
  projects,
  view,
  onViewChange,
}: {
  projects: Project[]
  view: 'photo' | 'video'
  onViewChange: (view: 'photo' | 'video') => void
}) {
  const creative = projects.filter((project) => project.category_id !== 'programming')
  const [album, setAlbum] = useState<Project | null>(null)

  const isVideo = (project: Project) => Boolean(project.youtube_embed)

  const filtered = creative.filter((project) =>
    view === 'video' ? isVideo(project) : !isVideo(project),
  )

  const FILTERS = [
    { id: 'photo', label: `Photos · ${creative.filter((p) => !isVideo(p)).length}` },
    { id: 'video', label: `Videos · ${creative.filter(isVideo).length}` },
  ] as const

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
          <div className="flex flex-wrap items-center gap-2">
            {FILTERS.map((item) => {
              const active = view === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onViewChange(item.id)}
                  aria-pressed={active}
                  className={`rounded-md px-3 py-1.5 text-sm font-medium uppercase tracking-[0.14em] transition-colors duration-200 ${
                    active
                      ? 'bg-ink text-paper'
                      : 'text-graphite hover:bg-canvas hover:text-ink'
                  }`}
                >
                  {item.label}
                </button>
              )
            })}
          </div>

          {filtered.length === 0 ? (
            <div className="pt-6">
              <EmptyStatePanel
                label={view === 'photo' ? 'Photos' : 'Videos'}
                title={`No ${view === 'video' ? 'videos' : 'photos'} yet`}
                description="Nothing in this filter yet — publish one and it lands here."
              />
            </div>
          ) : (
          <ul className="mt-5 grid grid-cols-2 gap-x-5 gap-y-10 xl:grid-cols-3 md:gap-x-6">
            {filtered.map((project, index) => {
              const videoProject = isVideo(project)
              if (videoProject && project.youtube_embed) {
                const videoId = parseYouTubeId(project.youtube_embed) ?? ''
                const watchUrl = youtubeWatchUrl(videoId)
                return (
                  <li key={project.id} className="motion-enter motion-step-4">
                    <figure className="group">
                      <div className="overflow-hidden rounded-[14px] border border-line bg-ink">
                        <iframe
                          src={project.youtube_embed}
                          title={project.title}
                          className="aspect-video w-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          loading="lazy"
                        />
                      </div>
                      <figcaption className="mt-2 px-0.5">
                        <a
                          href={watchUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-[0.14em] text-graphite transition-colors hover:text-brand"
                        >
                          Open on YouTube →
                        </a>
                      </figcaption>
                    </figure>
                  </li>
                )
              }

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
                />
              )

              const handleOpen = () => {
                if (shots.length > 0) setAlbum(project)
              }

              const isClickable = shots.length > 0

              return (
                <li key={project.id} className="motion-enter motion-step-4">
                  {isClickable ? (
                    <button
                      type="button"
                      onClick={handleOpen}
                      aria-label={`Open album: ${project.title}`}
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
          )}
        </>
      )}

      {album && (
        <AlbumModal project={album} shots={getProjectShots(album)} onClose={() => setAlbum(null)} />
      )}
    </section>
  )
}
