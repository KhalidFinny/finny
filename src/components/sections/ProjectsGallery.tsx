import { useState } from 'react'
import type { Project } from '@/types/site'
import {
  PHOTOBY_CATEGORY_LABELS,
  PHOTOBY_CATEGORY_ORDER,
  type PhotobyCategory,
  type PhotobyPhoto,
} from '@/server/photoby'
import EmptyStatePanel from '@/components/site/EmptyStatePanel'
import Lightbox from '@/components/site/Lightbox'
import Polaroid from '@/components/site/Polaroid'
import { parseYouTubeId, youtubeWatchUrl } from '@/lib/youtube'

// How many photographs a category previews before its "See more". Matches
// photoby's studio, which shows the five newest per category on its front page.
const PREVIEW_LIMIT = 5

const FILTER_CLS = (active: boolean) =>
  `rounded-md px-3 py-1.5 text-sm font-medium uppercase tracking-[0.14em] transition-colors duration-200 ${
    active ? 'bg-ink text-paper' : 'text-graphite hover:bg-canvas hover:text-ink'
  }`

function PhotoGrid({
  photos,
  label,
  onOpen,
}: {
  photos: PhotobyPhoto[]
  label: string
  onOpen: (photo: PhotobyPhoto) => void
}) {
  return (
    <ul className="mt-4 grid grid-cols-2 gap-x-5 gap-y-8 md:grid-cols-3 md:gap-x-6">
      {photos.map((photo, index) => (
        <li key={photo.id} className="motion-enter motion-step-4">
          <button
            type="button"
            onClick={() => onOpen(photo)}
            aria-label={`Open photograph: ${photo.caption ?? label}`}
            className="block w-full text-left"
          >
            <Polaroid
              src={photo.src}
              alt={photo.caption ?? `${label} photograph`}
              index={index}
              caption={photo.caption ?? undefined}
            />
          </button>
        </li>
      ))}
    </ul>
  )
}

// Creative work. Photographs come from photoby (the source of truth), grouped by
// category: the five newest each, with a link to the category's full gallery.
export default function ProjectsGallery({
  projects,
  photos,
  view,
  onViewChange,
  activeCategory,
  onCategoryChange,
}: {
  projects: Project[]
  photos: PhotobyPhoto[]
  view: 'photo' | 'video'
  onViewChange: (view: 'photo' | 'video') => void
  activeCategory: PhotobyCategory | null
  onCategoryChange: (category: PhotobyCategory | null) => void
}) {
  const videoProjects = projects.filter(
    (project) => project.category_id !== 'programming' && project.youtube_embed,
  )
  const [preview, setPreview] = useState<PhotobyPhoto | null>(null)

  const groups = PHOTOBY_CATEGORY_ORDER.map((category) => ({
    category,
    label: PHOTOBY_CATEGORY_LABELS[category],
    photos: photos.filter((photo) => photo.category === category),
  })).filter((group) => group.photos.length > 0)

  const activeGroup = activeCategory
    ? groups.find((group) => group.category === activeCategory) ?? null
    : null

  const FILTERS = [
    { id: 'photo', label: `Photos · ${photos.length}` },
    { id: 'video', label: `Videos · ${videoProjects.length}` },
  ] as const

  return (
    <section aria-labelledby="projects-gallery-heading" className="px-4 py-6 md:px-6">
      <h2 id="projects-gallery-heading" className="sr-only">
        Creative projects
      </h2>

      <div className="flex flex-wrap items-center gap-2">
        {FILTERS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onViewChange(item.id)}
            aria-pressed={view === item.id}
            className={FILTER_CLS(view === item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {view === 'photo' ? (
        photos.length === 0 ? (
          <div className="pt-6">
            <EmptyStatePanel
              label="Photography"
              title="No photographs yet"
              description="Upload work in the photoby studio and it lands here."
            />
          </div>
        ) : activeGroup ? (
          <div className="mt-6">
            <button
              type="button"
              onClick={() => onCategoryChange(null)}
              className="inline-flex min-h-9 items-center rounded-md border border-line px-3 py-1.5 text-sm font-medium uppercase tracking-[0.14em] text-graphite transition-colors duration-200 hover:border-ink hover:text-ink"
            >
              ← All photos
            </button>

            <div className="mt-5 flex items-baseline justify-between gap-4">
              <p className="ui-sticker-label">{activeGroup.label}</p>
              <span className="ui-label ui-label-muted">{activeGroup.photos.length}</span>
            </div>

            <PhotoGrid
              photos={activeGroup.photos}
              label={activeGroup.label}
              onOpen={setPreview}
            />
          </div>
        ) : (
          <div className="mt-6 space-y-10">
            {groups.map((group) => {
              const shown = group.photos.slice(0, PREVIEW_LIMIT)
              const remaining = group.photos.length - shown.length
              return (
                <section key={group.category} aria-label={group.label}>
                  <div className="flex items-baseline justify-between gap-4">
                    <p className="ui-sticker-label">{group.label}</p>
                    <span className="ui-label ui-label-muted">{group.photos.length}</span>
                  </div>

                  <PhotoGrid photos={shown} label={group.label} onOpen={setPreview} />

                  {remaining > 0 && (
                    <div className="mt-5">
                      <button
                        type="button"
                        onClick={() => onCategoryChange(group.category)}
                        className="inline-flex min-h-9 items-center rounded-md border border-line px-3 py-1.5 text-sm font-medium uppercase tracking-[0.14em] text-graphite transition-colors duration-200 hover:border-ink hover:text-ink"
                      >
                        See more · {group.label} ({group.photos.length})
                      </button>
                    </div>
                  )}
                </section>
              )
            })}
          </div>
        )
      ) : videoProjects.length === 0 ? (
        <div className="pt-6">
          <EmptyStatePanel
            label="Videos"
            title="No videos yet"
            description="Publish a videography project with a video and it lands here."
          />
        </div>
      ) : (
        <ul className="mt-5 grid grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-2 xl:grid-cols-3">
          {videoProjects.map((project) => {
            const videoId = project.youtube_embed ? parseYouTubeId(project.youtube_embed) : null
            const watchUrl = videoId ? youtubeWatchUrl(videoId) : null
            return (
              <li key={project.id} className="motion-enter motion-step-4">
                <figure className="group">
                  <div className="overflow-hidden rounded-[14px] border border-line bg-ink">
                    <iframe
                      src={project.youtube_embed ?? ''}
                      title={project.title}
                      className="aspect-video w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      loading="lazy"
                    />
                  </div>
                  <figcaption className="mt-2 flex items-center justify-between gap-3 px-0.5">
                    <span className="truncate text-sm font-medium text-ink">
                      {project.title}
                    </span>
                    {watchUrl && (
                      <a
                        href={watchUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 text-sm font-medium uppercase tracking-[0.14em] text-graphite transition-colors hover:text-brand"
                      >
                        YouTube
                      </a>
                    )}
                  </figcaption>
                </figure>
              </li>
            )
          })}
        </ul>
      )}

      {preview && (
        <Lightbox
          kind="image"
          url={preview.src}
          title={preview.caption ?? PHOTOBY_CATEGORY_LABELS[preview.category]}
          onClose={() => setPreview(null)}
        />
      )}
    </section>
  )
}
