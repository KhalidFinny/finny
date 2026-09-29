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
      <p className="text-sm font-medium uppercase tracking-[0.14em] text-brand">
        {label}
      </p>
      {title && (
        <h2
          className={cn(
            'mt-2 font-sans text-[clamp(1.875rem,4vw,3.5rem)] font-medium leading-tight tracking-[-0.02em] text-ink',
            titleClassName,
          )}
        >
          {title}
        </h2>
      )}
    </div>
  )
}
