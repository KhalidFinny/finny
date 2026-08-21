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

const PILL_CLS =
  'inline-block rounded-sm bg-paper px-2 py-1 font-mono text-xs uppercase tracking-[0.14em] text-brand ring-1 ring-line'

export default function CanvasPane() {
  return (
    <section className="flex min-h-0 flex-col border-b border-line lg:border-b-0">
      <div className="border-b border-line bg-canvas px-4 py-2.5 md:px-6">
        <div className="motion-enter motion-step-2 flex items-center justify-between gap-4">
          <p className="text-sm font-medium uppercase tracking-[0.14em] text-brand">
            Workspace · visual proof
          </p>
          <p className="text-sm font-medium uppercase tracking-[0.14em] text-brand">
            2 creative · 1 programming
          </p>
        </div>
      </div>

      {/* Mobile — stacked feed (separate layout from the desktop collage) */}
      <div className="space-y-6 px-4 py-6 md:hidden">
        <div className="motion-enter motion-step-3">
          <p className={PILL_CLS}>bball · creative</p>
          <img
            src="/portofolio/bball.webp"
            alt="Basketball motion shot"
            loading="lazy"
            className="mt-2 aspect-[4/3] w-full rounded-[14px] border border-line object-cover"
          />
        </div>

        <div className="motion-enter motion-step-3">
          <p className={PILL_CLS}>flower · creative</p>
          <img
            src="/portofolio/flower.webp"
            alt="Pink flowers photo"
            loading="lazy"
            className="mt-2 aspect-[4/3] w-full rounded-[14px] border border-line object-cover"
          />
        </div>

        <div className="motion-enter motion-step-4">
          <p className={PILL_CLS}>novaris · programming</p>
          <div className="mt-2 rounded-[14px] border border-line bg-paper p-2">
            <img
              src="/pics/Novaris.webp"
              alt="Novaris project"
              loading="lazy"
              className="aspect-[16/9] w-full bg-paper object-contain"
            />
          </div>
        </div>

        <div className="motion-enter motion-step-4 overflow-hidden rounded-[14px] border border-line bg-paper">
          <div className="flex items-center justify-between gap-4 border-b border-line bg-paper px-4 py-2.5 text-sm font-medium uppercase tracking-[0.14em] text-brand">
            <span>Stack &amp; tools</span>
            <span className="text-graphite">· ×</span>
          </div>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-2 px-4 py-3.5">
            {stackTools.map((item) => (
              <li key={item} className="text-sm text-ink">
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="motion-enter motion-step-5">
          <p className={PILL_CLS}>dream garage</p>
          <div className="mt-2 grid grid-cols-2 gap-3">
            <img
              src="/ls400.webp"
              alt="Lexus LS400 sticker"
              loading="lazy"
              className="w-full rounded-[14px] border border-line object-contain"
            />
            <img
              src="/crown.webp"
              alt="Toyota Crown sticker"
              loading="lazy"
              className="w-full rounded-[14px] border border-line object-contain"
            />
          </div>
        </div>
      </div>

      {/* Desktop — collage */}
      <div className="relative hidden min-h-0 flex-1 overflow-hidden px-6 py-6 md:block">
        <p className="motion-enter motion-step-3 motion-ui absolute left-[8%] top-[10%] rounded-sm bg-paper px-2 py-1 text-sm font-medium uppercase tracking-[0.14em] text-brand ring-1 ring-line">
          bball · creative
        </p>
        <img
          src="/portofolio/bball.webp"
          alt="Basketball motion shot"
          loading="lazy"
          data-hover="lift"
          className="motion-enter motion-step-3 motion-ui-soft absolute left-[8%] top-[16%] h-[34%] w-[22%] object-cover"
        />

        <p className="motion-enter motion-step-3 motion-ui absolute left-[40%] top-[8%] rounded-sm bg-paper px-2 py-1 text-sm font-medium uppercase tracking-[0.14em] text-brand ring-1 ring-line">
          flower · creative
        </p>
        <img
          src="/portofolio/flower.webp"
          alt="Pink flowers photo"
          loading="lazy"
          data-hover="lift"
          className="motion-enter motion-step-3 motion-ui-soft absolute left-[40%] top-[14%] h-[30%] w-[22%] object-cover"
        />

        <p className="motion-enter motion-step-4 motion-ui absolute left-[16%] top-[38%] rounded-sm bg-paper px-2 py-1 text-sm font-medium uppercase tracking-[0.14em] text-brand ring-1 ring-line">
          novaris · programming
        </p>
        <div
          data-hover="lift"
          className="motion-enter motion-step-4 motion-ui-soft absolute left-[16%] top-[44%] w-[46%] bg-paper p-2 ring-1 ring-line"
        >
          <img
            src="/pics/Novaris.webp"
            alt="Novaris project"
            loading="lazy"
            className="aspect-[16/9] w-full bg-paper object-contain"
          />
        </div>

        <div className="motion-enter motion-step-4 motion-ui-soft absolute right-[4%] top-[10%] w-[30%] overflow-hidden rounded-[14px] border border-line bg-paper">
          <div className="flex items-center justify-between gap-4 border-b border-line bg-paper px-4 py-2.5 text-sm font-medium uppercase tracking-[0.14em] text-brand">
            <span>Stack &amp; tools</span>
            <span className="text-graphite">· ×</span>
          </div>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-2 px-4 py-3.5">
            {stackTools.map((item) => (
              <li key={item} className="text-sm text-ink">
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="motion-enter motion-step-5 absolute bottom-[5%] right-[2%] w-[34%]">
          <p className="mb-2 inline-block rounded-sm bg-paper px-2 py-1 text-sm font-medium uppercase tracking-[0.14em] text-brand ring-1 ring-line">
            dream garage
          </p>
          <div className="relative h-[170px]">
            <img
              src="/ls400.webp"
              alt="Lexus LS400 sticker"
              loading="lazy"
              data-hover="lift"
              className="motion-ui-soft absolute bottom-[18%] left-0 w-[58%] -rotate-[6deg] object-contain"
            />
            <img
              src="/crown.webp"
              alt="Toyota Crown sticker"
              loading="lazy"
              data-hover="lift"
              className="motion-ui-soft absolute bottom-0 right-0 w-[62%] rotate-[5deg] object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
