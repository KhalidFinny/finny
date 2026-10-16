import WindowHeader from '@/components/wireframe/home/WindowHeader'
import { navItems } from '@/components/wireframe/home/data'
import useHomeMotion from '@/components/wireframe/home/useHomeMotion'

export default function BlankWindow() {
  const motionReady = useHomeMotion()

  return (
    <div className="h-screen bg-wall p-1.5 md:p-3">
      <div
        data-motion-pending="false"
        data-motion-ready={motionReady ? 'true' : 'false'}
        className="mx-auto flex h-full max-w-[1760px] flex-col overflow-hidden rounded-[18px] border border-line bg-paper page-grid"
      >
        <WindowHeader items={navItems} />
        <main className="flex-1 animate-[page-in_300ms_ease-out] motion-reduce:animate-none" />
      </div>
    </div>
  )
}
