const FIELD_START = new Date('2024-01-01')

export default function StatusBar() {
  const yearsInField = Math.max(
    0,
    new Date().getFullYear() - FIELD_START.getFullYear(),
  )

  const items = [
    { label: 'Years in the field', value: `${yearsInField}`, tone: 'ink' },
    { label: 'Projects', value: '10+', tone: 'ink' },
    { label: 'Sleepless nights', value: '100+', tone: 'ink' },
    { label: 'Learning', value: '∞', tone: 'brand' },
    { label: 'Clarkson note', value: 'How hard can it be?', tone: 'quote' },
  ] as const

  return (
    <footer className="grid shrink-0 border-t border-line bg-paper grid-cols-2 md:grid-cols-5">
      {items.map((item) => (
        <div
          key={item.label}
          data-hover="lift"
          className="motion-enter motion-step-5 motion-ui border-b border-line px-4 py-3 last:col-span-2 last:border-b-0 md:border-b-0 md:border-r md:px-6 md:py-4 md:last:col-span-1"
        >
          <p className="text-sm font-medium uppercase tracking-[0.14em] text-brand">
            {item.label}
          </p>
          <p
            className={`mt-2.5 text-2xl leading-tight md:text-[1.8rem] ${
              item.tone === 'brand'
                ? 'text-brand'
                : item.tone === 'quote'
                  ? 'font-serif italic text-ink'
                  : 'text-ink'
            }`}
          >
            {item.value}
          </p>
        </div>
      ))}
    </footer>
  )
}
