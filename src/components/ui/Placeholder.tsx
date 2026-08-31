import { cn } from '@/components/ui/cn'

export default function Placeholder({
  label,
  className,
}: {
  label: string
  className?: string
}) {
  return (
    <div
      role="img"
      aria-label={`${label} — image placeholder`}
      className={cn('flex items-center justify-center bg-paper', className)}
    >
      <span className="ui-label ui-label-muted">{label}</span>
    </div>
  )
}
