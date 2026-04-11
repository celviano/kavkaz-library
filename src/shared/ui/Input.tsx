import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/shared/lib/cn'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          'h-11 w-full rounded-xl border bg-bg px-4 text-sm text-ink',
          'placeholder:text-dim outline-none',
          'transition-all duration-150',
          error
            ? 'border-red-400 hover:border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-400/20'
            : 'border-surface2 hover:border-surface3 focus:border-accent/50 focus:ring-2 focus:ring-accent/10',
          className,
        )}
        aria-invalid={error ? 'true' : undefined}
        {...props}
      />
    )
  },
)

Input.displayName = 'Input'
