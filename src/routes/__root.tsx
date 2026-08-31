// NOTE: reconstructed 2026-08-08 after accidental deletion — standard
// TanStack Start root route shell (original was never committed).
import { Link, createRootRoute, HeadContent, Outlet, Scripts } from '@tanstack/react-router'
import { QueryClientProvider } from '@tanstack/react-query'
import { useCallback, useState } from 'react'
import WindowHeader from '@/components/wireframe/home/WindowHeader'
import { navItems } from '@/components/wireframe/home/data'
import { queryClient } from '@/lib/queryClient'
import BootScreen from '@/components/site/BootScreen'
import '@/styles.css'

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: RootNotFound,
})

function RootComponent() {
  const [booting, setBooting] = useState(true)
  const handleBootDone = useCallback(() => setBooting(false), [])

  return (
    <html lang="en">
      <head>
        {typeof window === 'undefined' ? <HeadContent /> : null}
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          rel="preload"
          as="font"
          type="font/woff2"
          href="/fonts/schibstedgrotesk-variable.woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          as="font"
          type="font/woff2"
          href="/fonts/instrumentserif-regular.woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          as="font"
          type="font/woff2"
          href="/fonts/instrumentserif-italic.woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          as="font"
          type="font/woff2"
          href="/fonts/ibmplexmono-regular.woff2"
          crossOrigin="anonymous"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
        <link rel="icon" type="image/webp" href="/icons/logo.webp" />
        <title>Khalid Atthoriq</title>
        <meta name="description" content="Portfolio of Khalid Atthoriq — Fullstack Developer & UI/UX Designer." />
      </head>
      <body>
        <BootScreen onDone={handleBootDone} />
        <div inert={booting}>
          <QueryClientProvider client={queryClient}>
            <Outlet />
          </QueryClientProvider>
        </div>
        <Scripts />
      </body>
    </html>
  )
}

function RootNotFound() {
  return (
    <div className="h-dvh bg-wall p-1.5 md:p-3">
      <div className="mx-auto flex h-full max-w-[1760px] flex-col overflow-hidden rounded-[18px] border border-line bg-paper page-grid">
        <WindowHeader items={navItems} />
        <main className="flex min-h-0 flex-1 flex-col items-center justify-center px-6 text-center">
          <p className="ui-sticker-label">404 · Route not found</p>
          <h1 className="mt-5 font-serif text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.9] tracking-[-0.03em] text-ink [text-wrap:balance]">
            This road is closed.
          </h1>
          <p className="mt-4 max-w-[42ch] text-base leading-relaxed text-graphite">
            The machine is running fine — this route just isn&apos;t on the map.
          </p>
          <Link
            to="/"
            className="mt-7 inline-flex min-h-11 items-center justify-center rounded-full border border-ink px-6 text-sm font-medium uppercase tracking-[0.14em] text-ink transition-colors duration-200 hover:bg-ink hover:text-canvas"
          >
            Back to the garage
          </Link>
        </main>
      </div>
    </div>
  )
}
