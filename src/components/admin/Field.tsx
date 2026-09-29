import type { ReactNode } from 'react'
import { labelCls } from '@/components/admin/styles'

export default function Field({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <label className="block">
      <span className={labelCls}>{label}</span>
      {children}
    </label>
  )
}
