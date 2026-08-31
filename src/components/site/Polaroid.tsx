import { useState, type ReactNode } from 'react'
import { cn } from '@/components/ui/cn'

const COVER_ROTATIONS = [
  'rotate-[-1.5deg]',
  'rotate-[1.2deg]',
  'rotate-[-0.8deg]',
  'rotate-[2deg]',
  'rotate-[-2deg]',
  'rotate-[0.8deg]',
]

interface PolaroidProps {
  src?: string | null
  alt: string
  /** Seed for the rotation sequence. Omit for a straight polaroid. */
  index?: number
  /** Explicit rotation class (e.g. `rotate-[1.5deg]`) — overrides the index seed. */
  rotation?: string
  /** Title written on the polaroid strip. */
  caption?: string
  /** Right-aligned meta on the strip (e.g. status, "01 / 08"). */
  meta?: string
  metaClassName?: string
  /** Rendered inside the photo area (e.g. a play badge). */
  overlay?: ReactNode
  lazy?: boolean
  className?: string
  /** Aspect of the photo area — defaults to a 4:3 print crop. */
  photoClassName?: string
}

export default function Polaroid({
  src,
  alt,
  index,
  rotation,
  caption,
  meta,
  metaClassName,
  overlay,
  lazy = true,
  className,
  photoClassName,
}: PolaroidProps) {
  const [failed, setFailed] = useState(false)
  const rotationClass = rotation ?? (index !== undefined ? COVER_ROTATIONS[index % COVER_ROTATIONS.length] : undefined)

  return (
    <figure
      className={cn(
        'border border-line bg-paper p-3 pb-2.5 transition-[transform,border-color,background-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:rotate-0 hover:-translate-y-0.5 hover:rotate-0 hover:border-deep-line',
        rotationClass,
        className,
      )}
    >
      <div className={cn('relative overflow-hidden bg-canvas', photoClassName ?? 'aspect-[4/3]')}>
        {src && !failed ? (
          <img
            src={src}
            alt={alt}
            loading={lazy ? 'lazy' : 'eager'}
            onError={() => setFailed(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-graphite">{alt}</span>
          </div>
        )}
        {overlay}
      </div>
      {caption || meta ? (
        <figcaption className="flex items-baseline justify-between gap-3 px-1 pb-1 pt-3">
          {caption ? (
            <span className="truncate font-mono text-xs uppercase tracking-[0.18em] text-ink">
              {caption}
            </span>
          ) : null}
          {meta ? (
            <span className={cn('shrink-0 font-mono text-xs uppercase tracking-[0.18em] text-graphite', metaClassName)}>
              {meta}
            </span>
          ) : null}
        </figcaption>
      ) : null}
    </figure>
  )
}
