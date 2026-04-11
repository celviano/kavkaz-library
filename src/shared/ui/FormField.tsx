import { type FC, type ReactNode, useId } from 'react'
import { cn } from '@/shared/lib/cn'

export interface FormFieldProps {
  label:     string
  required?: boolean
  hint?:     string
  error?:    string
  children:  ReactNode
  className?: string
}

export const FormField: FC<FormFieldProps> = ({
  label,
  required,
  hint,
  error,
  children,
  className,
}) => {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label className="text-sm font-medium text-ink">
        {label}
        {required && <span className="text-red-400 ml-0.5" aria-hidden="true">*</span>}
      </label>

      {children}

      {error && (
        <p className="flex items-center gap-1.5 text-xs text-red-500" role="alert">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {error}
        </p>
      )}

      {hint && !error && (
        <p className="text-xs text-dim">{hint}</p>
      )}
    </div>
  )
}
