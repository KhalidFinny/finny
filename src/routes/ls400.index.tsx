import { createFileRoute, useLoaderData } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import AdminPanel from '@/components/admin/AdminPanel'
import Skeleton from '@/components/ui/Skeleton'
import { verifyAdminKey } from '@/server/admin'
import { queryClient } from '@/lib/queryClient'
import { siteQueryOptions } from '@/lib/queries'

export const Route = createFileRoute('/ls400/')({
  loader: () => queryClient.ensureQueryData(siteQueryOptions),
  pendingComponent: AdminPending,
  pendingMs: 0,
  component: AdminPage,
})

function AdminPending() {
  return (
    <div className="page-grid min-h-screen bg-wall p-4 md:p-8 animate-[page-in_300ms_ease-out] motion-reduce:animate-none">
      <div className="mx-auto max-w-6xl space-y-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-28 w-full" />
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    </div>
  )
}

function AdminPage() {
  const loaderData = useLoaderData({ from: '/ls400/' })
  const [authed, setAuthed] = useState(false)
  const [key, setKey] = useState('')
  const [error, setError] = useState(false)

  useEffect(() => {
    const stored = sessionStorage.getItem('ls400-auth')
    if (stored) {
      setKey(stored)
      setAuthed(true)
    }
  }, [])

  if (!authed) {
    return (
      <div className="page-grid flex min-h-screen items-center justify-center bg-wall px-6 animate-[page-in_300ms_ease-out] motion-reduce:animate-none">
        <form
          onSubmit={async (e) => {
            e.preventDefault()
            const ok = await verifyAdminKey({ data: key.trim() })
            if (ok) {
              sessionStorage.setItem('ls400-auth', key.trim())
              setAuthed(true)
            } else {
              setError(true)
            }
          }}
          className="w-full max-w-sm rounded-[14px] border border-line bg-paper p-6"
        >
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-brand">Service bay</p>
          <h1 className="mt-3 font-serif text-3xl text-ink">Key required</h1>
          <label className="mt-6 block font-mono text-xs uppercase tracking-[0.18em] text-graphite" htmlFor="ls400-key">
            Secret key
          </label>
          <input
            id="ls400-key"
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            autoFocus
            className="mt-2 w-full rounded-md border border-line bg-canvas px-3 py-2.5 text-ink outline-none transition-colors focus:border-ink"
            placeholder="••••"
          />
          {error && (
            <p className="mt-2 text-sm font-medium uppercase tracking-[0.14em] text-brand">
              Wrong key
            </p>
          )}
          <button
            type="submit"
            className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-full border border-ink px-6 py-3 text-sm font-medium uppercase tracking-[0.14em] text-ink transition-colors hover:bg-ink hover:text-canvas"
          >
            Unlock
          </button>
        </form>
      </div>
    )
  }

  return <AdminPanel initialData={loaderData} adminKey={key} />
}
