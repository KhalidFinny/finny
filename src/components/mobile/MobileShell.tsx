import type { ReactNode } from 'react'
import MobileHeader from '@/components/mobile/MobileHeader'

export default function MobileShell({
  children,
  label,
}: {
  children: ReactNode
  label?: string
}) {
  return (
    <div className="min-h-dvh bg-wall">
      <MobileHeader />
      {label ? (
        <div className="border-b border-line bg-canvas px-4 py-2.5">
          <p className="text-sm font-medium uppercase tracking-[0.14em] text-brand">{label}</p>
        </div>
      ) : null}
      <main className="px-4 py-6">{children}</main>
      <footer className="border-t border-line bg-paper px-4 py-4 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-graphite">
          Khalid Atthoriq · Est. 2024 · Malang, ID
        </p>
      </footer>
    </div>
  )
}
