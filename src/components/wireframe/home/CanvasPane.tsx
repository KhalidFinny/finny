import { useRef, useState, type PointerEvent, type ReactNode } from 'react'
import { cn } from '@/components/ui/cn'
import { useAppScale } from '@/components/site/AppScale'
import type { PhotobyPhoto } from '@/server/photoby'

const stackTools = [
  'React',
  'JavaScript',
  'TypeScript',
  'Next.js',
  'Tailwind CSS',
  'Angular',
  'Python',
  'Astro',
  'Laravel',
  'PostgreSQL',
  'Figma',
  'Photoshop',
  'After Effects',
  'Premiere Pro',
  'Capcut',
  'Vite',
  'TanStack',
  'Django',
  'MySQL',
] as const

function StackToolsPanel() {
  return (
    <div className="overflow-hidden rounded-[14px] border border-line bg-paper">
      <div className="flex items-center justify-between gap-4 border-b border-line bg-paper px-4 py-2.5">
        <span className="ui-sticker-label">Stack &amp; tools</span>
        <span className="ui-label ui-label-muted">· ×</span>
      </div>
      <ul className="grid grid-cols-2 gap-x-4 gap-y-2 px-4 py-3.5">
        {stackTools.map((item) => (
          <li key={item} className="text-sm text-ink">
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

type DragSnapshot = {
  pointerId: number
  startX: number
  startY: number
  offsetX: number
  offsetY: number
}

function DraggablePiece({
  className,
  label,
  rotation = 0,
  zIndex = 10,
  front = false,
  onGrab,
  children,
}: {
  className: string
  label?: string
  rotation?: number
  zIndex?: number
  /** Raise this piece above every other resting piece. */
  front?: boolean
  onGrab?: () => void
  children: ReactNode
}) {
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const dragRef = useRef<DragSnapshot | null>(null)
  // The whole app is scale-to-fitted; pointer clientX/Y are in viewport px, so
  // divide the drag delta by the scale to keep the piece under the cursor 1:1.
  const scale = useAppScale()

  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (dragRef.current?.pointerId !== event.pointerId) return
    dragRef.current = null
    setIsDragging(false)
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  const restingZ = front || isDragging ? 40 : zIndex

  return (
    <div
      className={cn('absolute select-none touch-none cursor-grab active:cursor-grabbing', className)}
      style={{
        zIndex: restingZ,
        transform: `translate3d(${offset.x}px, ${offset.y}px, 0) rotate(${rotation}deg)`,
      }}
      onPointerDown={(event) => {
        if (event.button !== 0) return
        onGrab?.()
        dragRef.current = {
          pointerId: event.pointerId,
          startX: event.clientX,
          startY: event.clientY,
          offsetX: offset.x,
          offsetY: offset.y,
        }
        setIsDragging(true)
        event.currentTarget.setPointerCapture(event.pointerId)
      }}
      onPointerMove={(event) => {
        if (dragRef.current?.pointerId !== event.pointerId) return
        const deltaX = (event.clientX - dragRef.current.startX) / scale
        const deltaY = (event.clientY - dragRef.current.startY) / scale
        setOffset({
          x: dragRef.current.offsetX + deltaX,
          y: dragRef.current.offsetY + deltaY,
        })
      }}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onLostPointerCapture={() => {
        dragRef.current = null
        setIsDragging(false)
      }}
    >
      {label ? <p className="mb-2 ui-sticker-label">{label}</p> : null}
      <div className={cn(isDragging && 'ring-1 ring-brand/20')}>
        {children}
      </div>
    </div>
  )
}

export default function CanvasPane({ photos }: { photos: PhotobyPhoto[] }) {
  const [frontKey, setFrontKey] = useState<string | null>(null)
  const photoPieces = photos.slice(0, 2)

  const bringToFront = (key: string) => () => setFrontKey(key)

  return (
    <section className="flex min-h-0 flex-col border-b border-line md:border-b-0">
      <div className="border-b border-line bg-canvas px-4 py-2.5 md:px-6">
        <div className="motion-enter motion-step-2 flex items-center justify-between gap-4">
          <p className="ui-sticker-label">
            Workspace · visual proof
          </p>
          <p className="ui-label ui-label-muted">
            2 creative · 1 programming
          </p>
        </div>
      </div>

      <div className="space-y-6 px-4 py-6 md:hidden">
        {photoPieces.map((photo, index) => (
          <div key={photo.id} className="motion-enter motion-step-3">
            <p className="ui-sticker-label">{photo.category} · photoby</p>
            <img
              src={photo.src}
              alt={photo.caption ?? `${photo.category} photograph`}
              loading={index === 0 ? 'eager' : 'lazy'}
              draggable={false}
              className="mt-2 aspect-[4/3] w-full border border-line bg-canvas object-cover"
            />
          </div>
        ))}

        <div className="motion-enter motion-step-4">
          <p className="ui-sticker-label">novaris · programming</p>
          <img
            src="/pics/Novaris.webp"
            alt="Novaris project"
            width={800}
            height={429}
            srcSet="/pics/Novaris.webp 800w, /pics/Novaris-1600.webp 1600w"
            sizes="92vw"
            fetchPriority="high"
            draggable={false}
            className="mt-2 aspect-[16/9] w-full bg-canvas object-contain"
          />
        </div>

        <div className="motion-enter motion-step-4">
          <StackToolsPanel />
        </div>

        <div className="motion-enter motion-step-5">
          <p className="ui-sticker-label">dream garage</p>
          <div className="mt-2 grid grid-cols-2 gap-3">
            <img
              src="/ls400.webp"
              alt="Lexus LS400 sticker"
              width={800}
              height={541}
              srcSet="/ls400-400.webp 400w, /ls400.webp 800w"
              sizes="46vw"
              loading="lazy"
              draggable={false}
              className="w-full object-contain"
            />
            <img
              src="/crown.webp"
              alt="Toyota Crown sticker"
              width={800}
              height={541}
              srcSet="/crown-400.webp 400w, /crown.webp 800w"
              sizes="46vw"
              loading="lazy"
              draggable={false}
              className="w-full object-contain"
            />
          </div>
        </div>
      </div>

      <div className="relative hidden min-h-[26rem] flex-1 overflow-hidden px-6 py-6 md:block">
        {photoPieces[0] && (
          <DraggablePiece
            className="left-[8%] top-[17%] w-[20%]"
            label={`${photoPieces[0].category} · photoby`}
            rotation={-4}
            zIndex={12}
            front={frontKey === 'photo-0'}
            onGrab={bringToFront('photo-0')}
          >
            <img
              src={photoPieces[0].src}
              alt={photoPieces[0].caption ?? `${photoPieces[0].category} photograph`}
              sizes="20vw"
              loading="eager"
              decoding="async"
              draggable={false}
              className="w-full bg-canvas object-cover"
            />
          </DraggablePiece>
        )}

        {photoPieces[1] && (
          <DraggablePiece
            className="left-[37%] top-[12%] w-[19%]"
            label={`${photoPieces[1].category} · photoby`}
            rotation={3}
            zIndex={14}
            front={frontKey === 'photo-1'}
            onGrab={bringToFront('photo-1')}
          >
            <img
              src={photoPieces[1].src}
              alt={photoPieces[1].caption ?? `${photoPieces[1].category} photograph`}
              sizes="19vw"
              loading="lazy"
              decoding="async"
              draggable={false}
              className="w-full bg-canvas object-cover"
            />
          </DraggablePiece>
        )}

        <DraggablePiece
          className="left-[17%] top-[45%] w-[38%]"
          label="novaris · programming"
          rotation={-2}
          zIndex={16}
          front={frontKey === 'novaris'}
          onGrab={bringToFront('novaris')}
        >
          <img
            src="/pics/Novaris.webp"
            alt="Novaris project"
            width={800}
            height={429}
            srcSet="/pics/Novaris.webp 800w, /pics/Novaris-1600.webp 1600w"
            sizes="38vw"
            fetchPriority="high"
            decoding="async"
            draggable={false}
            className="aspect-[16/9] w-full bg-canvas object-contain"
          />
        </DraggablePiece>

        <DraggablePiece
          className="right-[6%] top-[10%] w-[26%]"
          rotation={2}
          zIndex={15}
          front={frontKey === 'stack'}
          onGrab={bringToFront('stack')}
        >
          <StackToolsPanel />
        </DraggablePiece>

        <DraggablePiece
          className="right-[20%] bottom-[8%] w-[20%]"
          label="LS400"
          rotation={-6}
          zIndex={12}
          front={frontKey === 'ls400'}
          onGrab={bringToFront('ls400')}
        >
          <img
            src="/ls400.webp"
            alt="Lexus LS400 sticker"
            width={800}
            height={541}
            srcSet="/ls400-400.webp 400w, /ls400.webp 800w"
            sizes="20vw"
            loading="lazy"
            decoding="async"
            draggable={false}
            className="w-full object-contain"
          />
        </DraggablePiece>

        <DraggablePiece
          className="right-[3%] bottom-[6%] w-[22%]"
          label="Crown"
          rotation={5}
          zIndex={14}
          front={frontKey === 'crown'}
          onGrab={bringToFront('crown')}
        >
          <img
            src="/crown.webp"
            alt="Toyota Crown sticker"
            width={800}
            height={541}
            srcSet="/crown-400.webp 400w, /crown.webp 800w"
            sizes="22vw"
            loading="lazy"
            decoding="async"
            draggable={false}
            className="w-full object-contain"
          />
        </DraggablePiece>
      </div>
    </section>
  )
}
