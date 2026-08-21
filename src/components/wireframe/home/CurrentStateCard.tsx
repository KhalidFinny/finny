type StateLine = {
  label: string
  value: string
}

export default function CurrentStateCard({ lines }: { lines: readonly StateLine[] }) {
  return (
    <div data-hover="lift" className="motion-ui-soft overflow-hidden rounded-[14px] border border-line bg-canvas">
      <div className="border-b border-line bg-paper px-4 py-2.5 text-sm font-medium uppercase tracking-[0.14em] text-brand">
        Current state
      </div>

      <ul className="space-y-2.5 px-4 py-3.5">
        {lines.map((line) => (
          <li key={line.label} className="flex gap-3 text-[15px] leading-snug text-ink md:text-base">
            <span aria-hidden="true" className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
            <span>{line.value}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
