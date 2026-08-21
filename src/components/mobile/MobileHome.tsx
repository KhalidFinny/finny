import MobileShell from '@/components/mobile/MobileShell'

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

export default function MobileHome() {
  return (
    <MobileShell>
      <section className="space-y-6">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.14em] text-brand">
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
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-brand">
              bball · creative
            </p>
            <img
              src="/portofolio/bball.webp"
              alt="Basketball motion shot"
              loading="lazy"
              className="mt-2 aspect-[4/3] w-full rounded-[14px] border border-line object-cover"
            />
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-brand">
              flower · creative
            </p>
            <img
              src="/portofolio/flower.webp"
              alt="Pink flowers photo"
              loading="lazy"
              className="mt-2 aspect-[4/3] w-full rounded-[14px] border border-line object-cover"
            />
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-brand">
              novaris · programming
            </p>
            <div className="mt-2 rounded-[14px] border border-line bg-paper p-2">
              <img
                src="/pics/Novaris.webp"
                alt="Novaris project"
                loading="lazy"
                className="aspect-[16/9] w-full bg-paper object-contain"
              />
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-[14px] border border-line bg-paper">
          <div className="border-b border-line bg-paper px-4 py-2.5 text-sm font-medium uppercase tracking-[0.14em] text-brand">
            Stack &amp; tools
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
