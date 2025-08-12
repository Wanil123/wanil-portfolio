import * as React from 'react'
import { cn } from '@/lib/utils'

type Variant = 'default' | 'secondary'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: Variant
}

const variants: Record<Variant, string> = {
  default: 'bg-violet-600 text-white',
  secondary: 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100',
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return <span className={cn('inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium', variants[variant], className)} {...props} />
}
