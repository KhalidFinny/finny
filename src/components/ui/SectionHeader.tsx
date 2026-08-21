import { cn } from '@/components/ui/cn'

export default function SectionHeader({
  label,
  title,
  className,
  titleClassName,
}: {
  label: string
  title?: string
  className?: string
  titleClassName?: string
}) {
  return (
    <div className={cn(className)}>
      <p className="font-mono text-xs uppercase tracking-[0.25em] text-graphite md:text-sm">
        {label}
      </p>
      {title && (
        <h2
          className={cn(
            'mt-2 font-serif text-3xl leading-tight text-ink md:text-5xl',
            titleClassName,
          )}
        >
          {title}
        </h2>
      )}
    </div>
  )
}
