import type { ReactNode } from 'react'
import MobileHeader from '@/components/mobile/MobileHeader'
import PageHeaderBand from '@/components/site/PageHeaderBand'
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
        <PageHeaderBand className="md:px-4" innerClassName="justify-start">
          <p className="ui-sticker-label">{label}</p>
        </PageHeaderBand>
      ) : null}
      <main className="px-4 py-6">{children}</main>
      <footer className="border-t border-line bg-paper px-4 py-4 text-center">
        <p className="ui-label ui-label-muted">
          Khalid Atthoriq · Est. 2024 · Malang, ID
        </p>
      </footer>
    </div>
  )
}
