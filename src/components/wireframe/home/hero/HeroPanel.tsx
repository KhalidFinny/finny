import type { ReactNode } from 'react'

// Shared shell for the left-pane hero variants: the panel surface, its header
// band, and the identity-over-facts vertical rhythm. Variants supply the body.
export default function HeroPanel({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <aside className="flex min-h-0 flex-col border-b border-panel-line bg-panel xl:border-b-0 xl:border-r">
      <div className="border-b border-panel-line bg-panel-band px-4 py-2.5 md:px-6">
        <p className="ui-sticker-label">{label}</p>
      </div>

      <div className="flex min-h-0 flex-1 flex-col justify-between gap-8 overflow-y-auto px-4 py-6 md:px-7 md:py-7">
        {children}
      </div>
    </aside>
  )
}
