import { useEffect, useRef, useState } from 'react'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import type { Project } from '@/types/site'
import FaIcon from '@/components/ui/FaIcon'
import Polaroid from '@/components/site/Polaroid'
import { cn } from '@/components/ui/cn'

type ImageRatio = 'landscape' | 'portrait' | 'square'

const RATIO_ASPECT: Record<ImageRatio, string> = {
  landscape: 'aspect-[4/3]',
  portrait: 'aspect-[3/4]',
  square: 'aspect-square',
}

const RATIO_SIZE: Record<ImageRatio, string> = {
  landscape: 'w-[min(86vw,42rem)] max-h-[58vh]',
  portrait: 'h-[min(58vh,36rem)] w-auto',
  square: 'w-[min(86vw,38rem)] max-h-[58vh]',
}

const SLIDE_ROTATIONS = ['rotate-[-1.5deg]', 'rotate-[1.5deg]', 'rotate-0']

function useImageRatio(src: string): ImageRatio | null {
  const [ratio, setRatio] = useState<ImageRatio | null>(null)

  useEffect(() => {
    let cancelled = false
    const img = new Image()
    img.onload = () => {
      if (cancelled) return
      const value = img.naturalWidth / img.naturalHeight
      setRatio(value >= 1.2 ? 'landscape' : value <= 0.85 ? 'portrait' : 'square')
    }
    img.src = src
    return () => {
      cancelled = true
    }
  }, [src])

  return ratio
}

function AlbumSlide({ src, title, index }: { src: string; title: string; index: number }) {
  const ratio = useImageRatio(src)

  return (
    <Polaroid
      src={src}
      alt={`${title} — photo ${index + 1}`}
      index={index}
      rotation={SLIDE_ROTATIONS[index % SLIDE_ROTATIONS.length]}
      caption={title}
      lazy={false}
      photoClassName={cn(
        ratio ? RATIO_ASPECT[ratio] : 'aspect-[4/3]',
        ratio ? RATIO_SIZE[ratio] : 'w-[min(86vw,42rem)] max-h-[58vh]',
      )}
    />
  )
}

export default function AlbumModal({
  project,
  shots,
  onClose,
}: {
  project: Project
  shots: string[]
  onClose: () => void
}) {
  const total = shots.length
  const [index, setIndex] = useState(0)
  const closeRef = useRef<HTMLButtonElement>(null)
  const swipeStartRef = useRef<number | null>(null)

  const goTo = (next: number) => setIndex(((next % total) + total) % total)

  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowRight') goTo(index + 1)
      if (event.key === 'ArrowLeft') goTo(index - 1)
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onClose, index, total])

  useEffect(() => {
    const neighborSrcs = [shots[(index + 1) % total], shots[(index - 1 + total) % total]]
    for (const src of neighborSrcs) {
      const img = new Image()
      img.src = src
    }
  }, [index, shots, total])

  if (total === 0) return null

  const counter = `${String(index + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`

  const controlCls =
    'inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-paper text-ink transition-colors duration-200 hover:border-deep-line disabled:cursor-not-allowed disabled:opacity-40'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onPointerDown={(event) => {
        swipeStartRef.current = event.clientX
      }}
      onPointerUp={(event) => {
        const start = swipeStartRef.current
        swipeStartRef.current = null
        if (start === null) return
        const delta = event.clientX - start
        if (Math.abs(delta) < 48) return
        if (delta < 0) goTo(index + 1)
        else goTo(index - 1)
      }}
    >
      <button
        type="button"
        aria-label="Close album"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-ink/70"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${project.title} album`}
        className="relative flex flex-col items-center gap-4"
      >
        <div key={index} className="animate-[page-in_200ms_ease-out] motion-reduce:animate-none">
          <AlbumSlide src={shots[index]} title={project.title} index={index} />
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            aria-label="Previous photo"
            disabled={total === 1}
            onClick={() => goTo(index - 1)}
            className={controlCls}
          >
            <FaIcon icon={faChevronLeft} className="h-4 w-4" />
          </button>
          <span aria-live="polite" className="font-mono text-xs uppercase tracking-[0.18em] text-paper">
            {counter}
          </span>
          <button
            type="button"
            aria-label="Next photo"
            disabled={total === 1}
            onClick={() => goTo(index + 1)}
            className={controlCls}
          >
            <FaIcon icon={faChevronRight} className="h-4 w-4" />
          </button>
        </div>

        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="font-mono text-xs uppercase tracking-[0.18em] text-paper transition-colors duration-200 hover:text-canvas"
        >
          × Close
        </button>
      </div>
    </div>
  )
}
