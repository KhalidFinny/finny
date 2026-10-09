import MobileShell from '@/components/mobile/MobileShell'
import type { PhotobyPhoto } from '@/server/photoby'

const STACK = [
  'React',
  'TypeScript',
  'Next.js',
  'Tailwind CSS',
  'Laravel',
  'Python',
  'Figma',
  'Photoshop',
  'Premiere Pro',
] as const

export default function MobileHome({ photos }: { photos: PhotobyPhoto[] }) {
  return (
    <MobileShell>
      <section className="space-y-6">
        <div>
          <p className="ui-sticker-label">
            Khalid Atthoriq
          </p>
          <h1 className="mt-3 font-serif text-4xl leading-[0.9] tracking-[-0.03em] text-ink [text-wrap:balance]">
            Clean. Workable. Full of <span className="text-brand">character.</span>
          </h1>
          <p className="mt-4 text-sm font-medium uppercase tracking-[0.14em] text-brand">
            Fullstack · UI/UX · Photographer · Videographer
          </p>
          <p className="mt-4 text-base leading-relaxed text-graphite">
            I build digital products with an engineer&apos;s structure and a creative eye.
          </p>
        </div>

        <div className="space-y-4">
          {photos.slice(0, 2).map((photo, index) => (
            <div key={photo.id}>
              <p className="ui-sticker-label">{photo.category} · photoby</p>
              <img
                src={photo.src}
                alt={photo.caption ?? `${photo.category} photograph`}
                loading={index === 0 ? 'eager' : 'lazy'}
                className="mt-2 aspect-[4/3] w-full border border-line object-cover"
              />
            </div>
          ))}
          <div>
            <p className="ui-sticker-label">novaris · programming</p>
            <img
              src="/pics/Novaris.webp"
              alt="Novaris project"
              width={800}
              height={429}
              srcSet="/pics/Novaris.webp 800w, /pics/Novaris-1600.webp 1600w"
              sizes="92vw"
              loading="lazy"
              className="mt-2 aspect-[16/9] w-full object-contain"
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-[14px] border border-line bg-paper">
          <div className="px-4 pt-4">
            <p className="ui-sticker-label">
              Stack &amp; tools
            </p>
          </div>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-2 px-4 py-3.5">
            {STACK.map((item) => (
              <li key={item} className="text-sm text-ink">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </MobileShell>
  )
}
