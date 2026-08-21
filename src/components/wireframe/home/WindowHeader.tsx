import { useLocation, useNavigate } from '@tanstack/react-router'
import { faGithub, faInstagram, faLinkedinIn } from '@fortawesome/free-brands-svg-icons'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import type { NavPath } from '@/components/wireframe/home/data'
import { animateOutThen } from '@/lib/transition'
import FaIcon from '@/components/ui/FaIcon'

export default function WindowHeader({
  items,
  cvHref,
}: {
  items: readonly { label: string; to: NavPath }[]
  cvHref?: string
}) {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const go = (to: NavPath) =>
    animateOutThen(() => {
      void navigate({ to })
    })

  return (
    <header className="flex shrink-0 items-center gap-2 border-b border-line bg-brand px-3 py-2 md:gap-3 md:px-6">
      <a
        href="/"
        aria-label="Khalid Atthoriq"
        onClick={(e) => {
          if (pathname !== '/') {
            e.preventDefault()
            go('/')
          }
        }}
        className="flex shrink-0 items-center"
      >
        <img
          src="/icons/logo.webp"
          alt=""
          className="h-8 w-8 shrink-0 object-contain md:h-9 md:w-9"
        />
      </a>
      <a
        href={cvHref ?? '/CV%20-%20Muhammad%20Khalid%20Atthoriq.pdf'}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-9 shrink-0 items-center justify-center rounded-full border border-canvas/80 px-3 py-1.5 font-mono text-xs uppercase tracking-[0.2em] text-canvas transition-colors duration-200 hover:bg-canvas hover:text-brand md:px-4 md:text-sm"
      >
        View my CV
      </a>

      <nav
        aria-label="Primary"
        className="ml-auto flex min-w-0 items-center gap-1 overflow-x-auto md:gap-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item) => {
          const active = pathname === item.to
          return (
            <a
              key={item.to}
              href={item.to}
              onClick={(e) => {
                if (!active) {
                  e.preventDefault()
                  go(item.to)
                }
              }}
              className={`motion-ui inline-flex min-h-9 shrink-0 items-center whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium uppercase tracking-[0.14em] md:text-sm ${
                active ? 'bg-paper' : 'text-canvas/90'
              }`}
              style={active ? { color: 'var(--color-brand)' } : undefined}
            >
              {item.label}
            </a>
          )
        })}
      </nav>

      <div className="hidden shrink-0 items-center gap-1.5 md:flex">
        <a
          href="https://instagram.com/finnn.designs"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-canvas/50 text-canvas/90 transition-colors duration-200 hover:border-canvas hover:bg-canvas hover:text-brand"
        >
          <FaIcon icon={faInstagram} className="h-4 w-4" />
        </a>
        <a
          href="https://linkedin.com/in/khalidatthoriq"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-canvas/50 text-canvas/90 transition-colors duration-200 hover:border-canvas hover:bg-canvas hover:text-brand"
        >
          <FaIcon icon={faLinkedinIn} className="h-4 w-4" />
        </a>
        <a
          href="https://github.com/khalidfinny"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-canvas/50 text-canvas/90 transition-colors duration-200 hover:border-canvas hover:bg-canvas hover:text-brand"
        >
          <FaIcon icon={faGithub} className="h-4 w-4" />
        </a>
        <a
          href="mailto:katthoriq@gmail.com"
          aria-label="Email"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-canvas/50 text-canvas/90 transition-colors duration-200 hover:border-canvas hover:bg-canvas hover:text-brand"
        >
          <FaIcon icon={faEnvelope} className="h-4 w-4" />
        </a>
      </div>
    </header>
  )
}
