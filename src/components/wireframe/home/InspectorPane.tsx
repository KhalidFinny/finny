type StatusItem = {
  index: string
  label: string
  target: string
}

export default function InspectorPane({ items }: { items: readonly StatusItem[] }) {
  return (
    <aside className="min-h-0">
      <div className="border-b border-neutral-300 bg-neutral-50 px-4 py-2.5 md:px-5">
        <p className="text-sm font-medium uppercase tracking-[0.14em] text-neutral-500 md:text-sm">
          Inspector
        </p>
      </div>

      <div className="space-y-3 px-4 py-5 md:px-5 md:py-6">
        <div className="overflow-hidden rounded-[14px] border border-neutral-300 bg-white">
          <div className="flex items-center justify-between gap-4 border-b border-neutral-300 px-4 py-2.5 text-sm font-medium uppercase tracking-[0.14em] text-neutral-700 md:text-sm">
            <span>Currently testing</span>
            <span>· ×</span>
          </div>
          <div className="px-4 py-2.5">
            {items.map((item) => (
              <div
                key={item.index}
                className="grid grid-cols-[34px_1fr_auto] items-center gap-3 border-b border-neutral-200 py-2.5 last:border-b-0"
              >
                <span className="text-sm font-medium uppercase tracking-[0.14em] text-neutral-500 md:text-sm">
                  {item.index}
                </span>
                <span className="text-sm text-neutral-800 md:text-[14px]">{item.label}</span>
                <span className="text-sm font-medium uppercase tracking-[0.14em] text-neutral-400 md:text-sm">
                  {item.target}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-[14px] border border-neutral-300 bg-white">
          <div className="flex items-center justify-between gap-4 border-b border-neutral-300 px-4 py-2.5 text-sm font-medium uppercase tracking-[0.14em] text-neutral-500 md:text-sm">
            <span>Latest log entry</span>
            <span>Today</span>
          </div>
          <div className="px-4 py-4">
            <h2 className="text-xl font-medium text-neutral-900 md:text-2xl">Entry title placeholder</h2>
            <p className="mt-3 text-sm leading-relaxed text-neutral-700 md:text-[14px]">
              Short log summary. This block should capture whatever is current, recent, or alive.
            </p>
            <div className="mt-4 text-sm font-medium uppercase tracking-[0.14em] text-neutral-700 md:text-sm">
              Read log →
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
