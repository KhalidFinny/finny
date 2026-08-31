import { useEffect, useState } from 'react'
import { faPlay } from '@fortawesome/free-solid-svg-icons'
import type { Project } from '@/types/site'
import FaIcon from '@/components/ui/FaIcon'
import AlbumModal from '@/components/site/AlbumModal'
import EmptyStatePanel from '@/components/site/EmptyStatePanel'
import Lightbox from '@/components/site/Lightbox'
import Polaroid from '@/components/site/Polaroid'
import { getProjectShots } from '@/lib/project-media'

type CollectionId = 'photography' | 'video' | 'design'

type CreativeCollection = {
  id: CollectionId
  label: string
  description: string
  projects: Project[]
}

function CollectionPreview({
  active,
  collection,
  onSelect,
}: {
  active: boolean
  collection: CreativeCollection
  onSelect: (id: CollectionId) => void
}) {
  const previews = collection.projects
    .flatMap((project) => {
      const [cover] = getProjectShots(project)
      return cover ? [{ src: cover, title: project.title }] : []
    })
    .slice(0, 3)

  return (
    <button
      type="button"
      onClick={() => onSelect(collection.id)}
      aria-pressed={active}
      className={`group w-full rounded-[14px] border bg-paper p-4 text-left transition-colors duration-200 ${
        active
          ? 'border-brand bg-canvas ring-1 ring-brand/15'
          : 'border-line hover:border-ink hover:bg-canvas'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="ui-sticker-label">{collection.label}</p>
          <p className="mt-3 text-base leading-relaxed text-ink">{collection.description}</p>
        </div>
        <p className="ui-label ui-label-muted shrink-0">
          {collection.projects.length} item{collection.projects.length === 1 ? '' : 's'}
        </p>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {previews.map((preview, index) => (
          <div key={`${preview.title}-${index}`} className="overflow-hidden rounded-[10px]">
            <img
              src={preview.src}
              alt={preview.title}
              loading="lazy"
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
        ))}
        {Array.from({ length: Math.max(0, 3 - previews.length) }).map((_, index) => (
          <div key={`empty-${index}`} className="aspect-[4/3] rounded-[10px] bg-canvas/80" />
        ))}
      </div>

      <p className="mt-3 ui-label ui-label-muted">
        Top 3 preview · click to open {collection.label.toLowerCase()}
      </p>
    </button>
  )
}

export default function ProjectsGallery({ projects }: { projects: Project[] }) {
  const creative = projects.filter((project) => project.category_id !== 'programming')
  const collections: CreativeCollection[] = [
    {
      id: 'photography',
      label: 'Photography',
      description: 'Polaroid albums and still frames.',
      projects: creative.filter(
        (project) => project.category_id === 'photography' && !project.youtube_embed,
      ),
    },
    {
      id: 'video',
      label: 'Video',
      description: 'Motion pieces and directed edits.',
      projects: creative.filter(
        (project) => project.category_id === 'videography' || Boolean(project.youtube_embed),
      ),
    },
    {
      id: 'design',
      label: 'Design',
      description: 'UI, layouts, and other creative work.',
      projects: creative.filter(
        (project) =>
          project.category_id !== 'photography' &&
          project.category_id !== 'videography' &&
          !project.youtube_embed,
      ),
    },
  ].filter((collection) => collection.projects.length > 0)

  const [activeCollectionId, setActiveCollectionId] = useState<CollectionId>('photography')
  const [video, setVideo] = useState<Project | null>(null)
  const [album, setAlbum] = useState<Project | null>(null)

  useEffect(() => {
    if (collections.length === 0) return
    if (!collections.some((collection) => collection.id === activeCollectionId)) {
      setActiveCollectionId(collections[0].id)
    }
  }, [activeCollectionId, collections])

  const activeCollection =
    collections.find((collection) => collection.id === activeCollectionId) ?? collections[0] ?? null

  return (
    <section aria-labelledby="projects-gallery-heading" className="px-4 py-6 md:px-6">
      <h2 id="projects-gallery-heading" className="sr-only">
        Creative projects
      </h2>

      {collections.length === 0 ? (
        <EmptyStatePanel
          label="Creative work"
          title="Nothing on display yet"
          description="Publish a photography, video, or design project and its preview lands here."
        />
      ) : (
        <>
          <div className="grid gap-4 pt-2 xl:grid-cols-3">
            {collections.map((collection) => (
              <CollectionPreview
                key={collection.id}
                active={activeCollection?.id === collection.id}
                collection={collection}
                onSelect={setActiveCollectionId}
              />
            ))}
          </div>

          {activeCollection ? (
            <div className="mt-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="ui-sticker-label">{activeCollection.label}</p>
                <p className="ui-label ui-label-muted">
                  Showing {activeCollection.projects.length} project
                  {activeCollection.projects.length === 1 ? '' : 's'}
                </p>
              </div>

              <ul className="mt-5 grid grid-cols-2 gap-x-5 gap-y-10 xl:grid-cols-3 md:gap-x-6">
                {activeCollection.projects.map((project, index) => {
                  const isVideo = Boolean(project.youtube_embed)
                  const isOngoing = project.status === 'ongoing'
                  const shots = getProjectShots(project)

                  const cover = (
                    <Polaroid
                      src={project.image}
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
            </div>
          ) : null}
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
