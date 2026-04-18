import { AlertCircle } from 'lucide-react'
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
          <AlertCircle size={12} strokeWidth={2} aria-hidden="true"/>
          {error}
        </p>
      )}

      {hint && !error && (
        <p className="text-xs text-dim">{hint}</p>
      )}
    </div>
  )
}
