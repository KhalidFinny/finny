// NOTE: reconstructed 2026-08-08 after accidental deletion — standard
// TanStack Start root route shell (original was never committed).
import { Link, createRootRoute, HeadContent, Outlet, Scripts } from '@tanstack/react-router'
import { QueryClientProvider } from '@tanstack/react-query'
import { useCallback, useState } from 'react'
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
    <div className="flex min-h-screen items-center justify-center bg-wall px-6 text-center text-ink">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.14em] text-brand">Not found</p>
        <h1 className="mt-4 font-serif text-4xl leading-tight">This route does not exist.</h1>
        <Link to="/" className="mt-6 inline-block rounded-md bg-brand px-4 py-2 text-sm font-medium uppercase tracking-[0.14em] text-paper">
          Back home
        </Link>
      </div>
    </div>
  )
}
