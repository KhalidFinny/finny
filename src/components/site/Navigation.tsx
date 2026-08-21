import { Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

const links = [
  { href: '/#about', label: 'About' },
  { href: '/#experience', label: 'Experience' },
]

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const linkClass =
    'font-mono text-xs uppercase tracking-[0.2em] text-graphite transition-colors duration-200 hover:text-brand md:text-sm'

  return (
    <header className="fixed inset-x-0 top-2 z-40 px-2 md:top-4 md:px-8">
      <nav
        aria-label="Primary"
        className={`mx-auto flex w-full max-w-[1600px] items-center justify-between gap-3 rounded-xl border px-4 py-2.5 transition-all duration-300 md:gap-4 md:px-8 md:py-3 ${
          scrolled
            ? 'border-transparent bg-transparent opacity-70 hover:border-line hover:bg-canvas/95 hover:opacity-100 hover:backdrop-blur-sm'
            : 'border-line bg-canvas'
        }`}
      >
        <a href="/" className="flex items-center gap-2 md:gap-2.5" aria-label="Back to top">
          <img
            src="/icons/logo.webp"
            alt=""
            className="h-7 w-7 shrink-0 object-contain md:h-9 md:w-9"
          />
          <span className="font-serif text-lg text-ink md:text-xl">Khalid</span>
        </a>

        <ul className="flex items-center gap-5 md:gap-8">
          <li>
            <a href="/" className={linkClass}>
              Home
            </a>
          </li>
          {links.map(({ href, label }) => (
            <li key={href}>
              <a href={href} className={linkClass}>
                {label}
              </a>
            </li>
          ))}
          <li>
            <Link
              to="/projects"
              activeOptions={{ exact: true }}
              className={linkClass}
              activeProps={{ className: `${linkClass} text-brand` }}
            >
              Projects
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}
