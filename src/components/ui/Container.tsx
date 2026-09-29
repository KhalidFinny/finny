import type { ReactNode } from 'react'
import { cn } from '@/components/ui/cn'

export default function Container({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={cn('px-6 md:px-12 lg:px-24', className)}>{children}</div>
}
