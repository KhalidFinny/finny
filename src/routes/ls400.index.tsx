import { createFileRoute, useLoaderData } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import AdminPanel from '@/components/admin/AdminPanel'
import { queryClient } from '@/lib/queryClient'
import { siteQueryOptions } from '@/lib/queries'

export const Route = createFileRoute('/ls400/')({
  loader: () => queryClient.ensureQueryData(siteQueryOptions),
  component: AdminPage,
})

function AdminPage() {
  const loaderData = useLoaderData({ from: '/ls400/' })
  const [authed, setAuthed] = useState(false)
  const [key, setKey] = useState('')
  const [error, setError] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem('ls400-auth') === '1') {
      setAuthed(true)
    }
  }, [])

  if (!authed) {
    return (
      <div className="page-grid flex min-h-screen items-center justify-center bg-wall px-6 animate-[page-in_300ms_ease-out] motion-reduce:animate-none">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (key.trim() === 'ls400') {
              sessionStorage.setItem('ls400-auth', '1')
              setAuthed(true)
            } else {
              setError(true)
            }
          }}
          className="w-full max-w-sm rounded-[14px] border border-line bg-paper p-6"
        >
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand">Service bay</p>
          <h1 className="mt-3 font-serif text-3xl text-ink">Key required</h1>
          <label className="mt-6 block font-mono text-xs uppercase tracking-[0.2em] text-graphite" htmlFor="ls400-key">
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
            <p className="mt-2 font-mono text-xs uppercase tracking-[0.18em] text-brand">
              Wrong key
            </p>
          )}
          <button
            type="submit"
            className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-full border border-ink px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] text-ink transition-colors hover:bg-ink hover:text-canvas"
          >
            Unlock
          </button>
        </form>
      </div>
    )
  }

  return <AdminPanel initialData={loaderData} />
}
