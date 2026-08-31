type StateLine = {
  label: string
  value: string
}

export default function CurrentStateCard({ lines }: { lines: readonly StateLine[] }) {
  return (
    <div className="overflow-hidden rounded-[14px] border border-line bg-paper">
      <div className="border-b border-line px-5 py-2.5">
        <p className="ui-sticker-label">
          Current state
        </p>
      </div>

      <ul className="max-h-[38vh] divide-y divide-line overflow-y-auto overscroll-contain">
        {lines.map((line) => (
          <li
            key={line.label}
            className="flex items-baseline justify-between gap-5 px-5 py-2"
          >
            <span className="shrink-0 font-mono text-xs uppercase tracking-[0.18em] text-graphite">
              {line.label}
            </span>
            <span className="min-w-0 text-right text-sm leading-snug text-ink">
              {line.value}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
