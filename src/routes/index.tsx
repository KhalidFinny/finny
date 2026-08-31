import { createFileRoute } from '@tanstack/react-router'
import { useRef } from 'react'
import CanvasPane from '@/components/wireframe/home/CanvasPane'
import OverviewPane from '@/components/wireframe/home/OverviewPane'
import StatusBar from '@/components/wireframe/home/StatusBar'
import MobileHome from '@/components/mobile/MobileHome'
import Skeleton from '@/components/ui/Skeleton'
import WindowHeader from '@/components/wireframe/home/WindowHeader'
import { navItems } from '@/components/wireframe/home/data'
import useHomeMotion from '@/components/wireframe/home/useHomeMotion'

export const Route = createFileRoute('/')({
  loader: async () => null,
  pendingComponent: HomePending,
  pendingMs: 0,
  component: Home,
})

function HomePending() {
  return (
    <>
      <div className="md:hidden min-h-dvh bg-wall">
        <div className="border-b border-line bg-brand px-4 pb-2.5 pt-3">
          <div className="flex items-center justify-between gap-3">
            <Skeleton className="h-8 w-36 border-canvas/30 bg-canvas/15" />
            <Skeleton className="h-11 w-24 border-canvas/30 bg-canvas/15" />
          </div>
          <div className="mt-2.5 flex gap-1.5 overflow-hidden">
            <Skeleton className="h-11 w-20 border-canvas/30 bg-canvas/15" />
            <Skeleton className="h-11 w-24 border-canvas/30 bg-canvas/15" />
            <Skeleton className="h-11 w-20 border-canvas/30 bg-canvas/15" />
          </div>
        </div>
        <main className="space-y-6 px-4 py-6">
          <Skeleton className="h-8 w-28" />
          <Skeleton className="h-36 w-full" />
          <Skeleton className="h-40 w-full" />
        </main>
      </div>
      <div className="hidden md:block">
        <div className="h-dvh bg-wall p-1.5 md:p-3">
          <div className="mx-auto flex h-full max-w-[1760px] flex-col overflow-hidden rounded-[18px] border border-line bg-paper">
            <WindowHeader items={navItems} />
            <main className="grid min-h-0 flex-1 overflow-y-auto border-b border-line xl:grid-cols-[minmax(20rem,28rem)_minmax(0,1fr)] 2xl:grid-cols-[480px_minmax(0,1fr)]">
              <div className="border-b border-line bg-paper xl:border-b-0 xl:border-r">
                <div className="border-b border-line bg-canvas px-4 py-2.5 md:px-6">
                  <Skeleton className="h-8 w-28" />
                </div>
                <div className="space-y-6 px-4 py-6 md:px-6 md:py-9">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-6 w-60" />
                  <Skeleton className="h-28 w-full" />
                </div>
              </div>
              <div className="border-b border-line bg-paper xl:border-b-0">
                <div className="border-b border-line bg-canvas px-4 py-2.5 md:px-6">
                  <div className="flex items-center justify-between gap-4">
                    <Skeleton className="h-8 w-44" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
                <div className="grid min-h-0 flex-1 grid-cols-2 gap-4 p-6">
                  <Skeleton className="h-44 w-full" />
                  <Skeleton className="h-40 w-full" />
                  <Skeleton className="col-span-2 h-52 w-[70%]" />
                </div>
              </div>
            </main>
            <div className="grid shrink-0 grid-cols-5 border-t border-line bg-paper">
              <Skeleton className="h-20 w-full rounded-none border-0" />
              <Skeleton className="h-20 w-full rounded-none border-x border-line" />
              <Skeleton className="h-20 w-full rounded-none border-0" />
              <Skeleton className="h-20 w-full rounded-none border-x border-line" />
              <Skeleton className="h-20 w-full rounded-none border-0" />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function Home() {
  const rootRef = useRef<HTMLDivElement>(null)
  useHomeMotion(rootRef)

  return (
    <>
      <div className="md:hidden">
        <MobileHome />
      </div>
      <div className="hidden md:block">
        <div className="h-dvh bg-wall p-1.5 md:p-3">
          <div
            ref={rootRef}
            data-motion-pending="false"
            data-motion-ready="false"
            className="mx-auto flex h-full max-w-[1760px] flex-col overflow-hidden rounded-[18px] border border-line bg-paper page-grid"
          >
            <WindowHeader items={navItems} />

            <main className="grid min-h-0 flex-1 overflow-y-auto border-b border-line animate-[page-in_300ms_ease-out] motion-reduce:animate-none xl:grid-cols-[minmax(20rem,28rem)_minmax(0,1fr)] xl:overflow-hidden 2xl:grid-cols-[480px_minmax(0,1fr)]">
              <OverviewPane />
              <CanvasPane />
            </main>

            <StatusBar />
          </div>
        </div>
      </div>
    </>
  )
}
