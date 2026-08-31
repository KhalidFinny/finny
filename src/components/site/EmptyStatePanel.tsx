import type { ReactNode } from 'react'

export default function EmptyStatePanel({
  label,
  title,
  description,
  aside,
}: {
  label: string
  title: string
  description: string
  aside?: ReactNode
}) {
  return (
    <section className="rounded-[14px] border border-line bg-paper px-5 py-6 md:px-6 md:py-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-[42rem]">
          <p className="ui-sticker-label">{label}</p>
          <h3 className="mt-4 font-serif text-2xl leading-tight text-ink md:text-[2rem]">
            {title}
          </h3>
          <p className="mt-3 max-w-[52ch] text-base leading-relaxed text-graphite">
            {description}
          </p>
        </div>
        {aside ? <div className="ui-label ui-label-muted">{aside}</div> : null}
      </div>
    </section>
  )
}
