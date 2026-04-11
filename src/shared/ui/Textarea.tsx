import { forwardRef, type TextareaHTMLAttributes } from 'react'
import { cn } from '@/shared/lib/cn'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          'w-full rounded-xl border bg-bg px-4 py-3 text-sm text-ink',
          'placeholder:text-dim outline-none resize-none',
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

Textarea.displayName = 'Textarea'
