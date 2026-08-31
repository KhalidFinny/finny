import { useLocation, useNavigate, useRouter } from '@tanstack/react-router'
import { navItems } from '@/components/wireframe/home/data'
import { animateOutThen } from '@/lib/transition'

export default function MobileHeader() {
  const navigate = useNavigate()
  const router = useRouter()
  const { pathname } = useLocation()

  const go = (to: string) =>
    animateOutThen(() => {
      void navigate({ to })
    })

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-brand px-4 pb-2.5 pt-3">
      <div className="flex items-center justify-between gap-3">
        <a
          href="/"
          aria-label="Khalid Atthoriq"
          onClick={(e) => {
            if (pathname !== '/') {
              e.preventDefault()
              go('/')
            }
          }}
          className="flex min-w-0 items-center gap-2"
        >
          <img
            src="/icons/logo.webp"
            alt=""
            className="h-8 w-8 shrink-0 object-contain"
          />
          <span className="truncate font-serif text-lg leading-tight text-canvas">
            Khalid Atthoriq
          </span>
        </a>
        <a
          href="/CV%20-%20Muhammad%20Khalid%20Atthoriq.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-full border border-canvas/80 px-3.5 py-1.5 text-sm font-medium uppercase tracking-[0.14em] text-canvas transition-colors duration-200 hover:bg-canvas hover:text-brand"
        >
          View CV
        </a>
      </div>
      <nav
        aria-label="Primary"
        className="mt-2.5 flex items-center gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {navItems.map((item) => {
          const active = pathname === item.to
          return (
            <a
              key={item.to}
              href={item.to}
              onMouseEnter={() => {
                void router.prefetchRoute({ to: item.to })
              }}
              onClick={(e) => {
                if (!active) {
                  e.preventDefault()
                  go(item.to)
                }
              }}
              className={`motion-ui inline-flex min-h-11 shrink-0 items-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium uppercase tracking-[0.14em] ${
                active ? 'bg-paper' : 'text-canvas/90'
              }`}
              style={active ? { color: 'var(--color-brand)' } : undefined}
            >
              {item.label}
            </a>
          )
        })}
      </nav>
    </header>
  )
}
