import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { cn } from '@/components/ui/cn'

type PageHeaderBandProps = ComponentPropsWithoutRef<'div'> & {
  children: ReactNode
  innerClassName?: string
}

export default function PageHeaderBand({
  children,
  className,
  innerClassName,
  ...props
}: PageHeaderBandProps) {
  return (
    <div {...props} className={cn('border-b border-line bg-canvas px-4 py-2.5 md:px-6', className)}>
      <div className={cn('flex min-h-11 flex-wrap items-center justify-between gap-3', innerClassName)}>
        {children}
      </div>
    </div>
  )
}
