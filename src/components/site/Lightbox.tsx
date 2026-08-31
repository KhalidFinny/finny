import { useEffect, useRef } from 'react'

export default function Lightbox({
  url,
  title,
  onClose,
  kind = 'video',
}: {
  url: string
  title: string
  onClose: () => void
  kind?: 'image' | 'video'
}) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [onClose])

  const mediaLabel = kind === 'image' ? 'image' : 'video'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label={`Close ${mediaLabel}`}
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-ink/70"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`relative border border-deep-line bg-paper p-2 ${
          kind === 'image' ? 'w-fit max-w-[92vw]' : 'w-full max-w-4xl'
        }`}
      >
        {kind === 'image' ? (
          <img src={url} alt={title} className="block max-h-[80vh] w-auto max-w-full" />
        ) : (
          <iframe
            src={url}
            title={title}
            className="aspect-video w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
        <div className="flex justify-end pb-1 pt-2">
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label={`Close ${mediaLabel}`}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line bg-paper text-graphite transition-colors duration-200 hover:border-ink hover:text-ink"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  )
}
