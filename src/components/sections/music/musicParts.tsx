import type { ReactNode } from 'react'
import type { IconDefinition } from '@fortawesome/fontawesome-common-types'
import FaIcon from '@/components/ui/FaIcon'

export function initialOf(name: string): string {
  return name.trim().charAt(0).toUpperCase() || '♪'
}

export function formatPlays(count: number): string {
  return `${count} ${count === 1 ? 'play' : 'plays'}`
}

/** Rough listening time from a scrobble count, at ~3.5 min a scrobble. */
export function listeningHours(totalScrobbles: number): number {
  return Math.max(1, Math.round((totalScrobbles * 3.5) / 60))
}

export function Sticker({ children }: { children: ReactNode }) {
  return <p className="ui-sticker-label">{children}</p>
}

export function Artwork({ src, alt, size }: { src: string; alt: string; size: string }) {
  if (!src) {
    return (
      <div
        aria-hidden="true"
        className={`flex shrink-0 items-center justify-center rounded-[12px] border border-line bg-canvas ${size}`}
      >
        <span className="font-serif text-brand/50">{initialOf(alt || '♪')}</span>
      </div>
    )
  }
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={`${size} shrink-0 rounded-[12px] border border-line object-cover`}
    />
  )
}

export function StatTile({
  label,
  icon,
  children,
}: {
  label: string
  icon: IconDefinition
  children: ReactNode
}) {
  return (
    <div className="flex items-center gap-4 rounded-[14px] border border-line bg-canvas px-4 py-4">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[12px] border border-line bg-paper text-brand">
        <FaIcon icon={icon} className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <dt className="ui-label ui-label-muted">{label}</dt>
        <dd className="mt-1 text-2xl font-medium leading-none tracking-[-0.02em] text-ink md:text-3xl">
          {children}
        </dd>
      </div>
    </div>
  )
}

export function WallTile({
  image,
  title,
  subtitle,
  rank,
}: {
  image: string
  title: string
  subtitle: string
  rank?: number
}) {
  return (
    <li className="group">
      <div className="relative overflow-hidden rounded-[12px] border border-line bg-canvas">
        {image ? (
          <img
            src={image}
            alt={title}
            loading="lazy"
            className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        ) : (
          <div className="flex aspect-square w-full items-center justify-center">
            <span className="font-serif text-4xl leading-none text-brand/40 md:text-5xl">
              {initialOf(title)}
            </span>
          </div>
        )}
        {rank !== undefined && (
          <span className="absolute left-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-ink text-sm font-medium tabular-nums text-canvas">
            {rank}
          </span>
        )}
      </div>
      <p className="mt-2 line-clamp-1 text-sm font-medium text-ink">{title}</p>
      <p className="line-clamp-1 text-sm font-medium uppercase tracking-[0.14em] text-graphite">
        {subtitle}
      </p>
    </li>
  )
}
