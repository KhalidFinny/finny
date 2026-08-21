import { createFileRoute } from '@tanstack/react-router'
import { useRef } from 'react'
import CanvasPane from '@/components/wireframe/home/CanvasPane'
import OverviewPane from '@/components/wireframe/home/OverviewPane'
import StatusBar from '@/components/wireframe/home/StatusBar'
import MobileHome from '@/components/mobile/MobileHome'
import WindowHeader from '@/components/wireframe/home/WindowHeader'
import { navItems } from '@/components/wireframe/home/data'
import useHomeMotion from '@/components/wireframe/home/useHomeMotion'

export const Route = createFileRoute('/')({
  component: Home,
})

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

        <main className="grid min-h-0 flex-1 overflow-y-auto border-b border-line md:grid-cols-[480px_minmax(0,1fr)] md:overflow-hidden animate-[page-in_300ms_ease-out] motion-reduce:animate-none">
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
