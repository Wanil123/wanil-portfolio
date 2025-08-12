import * as React from 'react'
import { cn } from '@/lib/utils'

type Variant = 'default' | 'secondary' | 'outline' | 'ghost'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  asChild?: boolean
  className?: string
}

const base =
  'inline-flex items-center justify-center whitespace-nowrap rounded-2xl px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-white dark:ring-offset-slate-900 shadow-sm'

const variants: Record<Variant, string> = {
  default: 'bg-violet-600 text-white hover:bg-violet-700',
  secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700',
  outline: 'border border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800',
  ghost: 'hover:bg-slate-100 dark:hover:bg-slate-800',
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', asChild = false, children, ...props }, ref) => {
    const cls = cn(base, variants[variant], className)
    if (asChild && React.isValidElement(children)) {
      // clone the only child (e.g., <a>) and inject classes
      return React.cloneElement(children as React.ReactElement<any>, {
        className: cn((children as React.ReactElement<any>).props.className, cls),
      })
    }
    return (
      <button ref={ref} className={cls} {...props}>
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'
