import { useEffect, useRef, type ReactNode } from 'react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  subtitle?: string
  wide?: boolean
  children: ReactNode
}

export default function Modal({
  open,
  onClose,
  title,
  subtitle,
  wide = false,
  children,
}: ModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    closeRef.current?.focus()
    document.body.style.overflow = 'hidden'

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'Tab') {
        const focusable = contentRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        )
        if (!focusable || focusable.length === 0) return

        const first = focusable[0]
        const last = focusable[focusable.length - 1]

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/30 px-4 pt-[8vh] pb-[8vh]">
      <button
        type="button"
        aria-label="Close dialog"
        onClick={onClose}
        className="fixed inset-0 cursor-default"
      />
      <div
        ref={contentRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`animate-[page-in_300ms_ease-out] motion-reduce:animate-none relative w-full border border-line bg-paper shadow-[0_24px_80px_-12px_rgba(24,18,15,0.18)] ${
          wide ? 'max-w-5xl' : 'max-w-2xl'
        }`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4 md:px-6">
          <div>
            {subtitle ? (
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-brand">{subtitle}</p>
            ) : null}
            <h2 className="mt-1 font-serif text-2xl text-ink">{title}</h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-graphite transition-colors duration-200 hover:border-ink hover:text-ink"
          >
            ×
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto px-5 py-5 md:px-6 md:py-6">{children}</div>
      </div>
    </div>
  )
}
