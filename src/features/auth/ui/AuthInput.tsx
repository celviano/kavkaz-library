import { type InputHTMLAttributes, type FC } from 'react'
import { cn } from '@/shared/lib/cn'

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export const AuthInput: FC<AuthInputProps> = ({ label, error, className, name, ...rest }) => {
  const id = `field-${name}`
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
      </label>
      <input
        id={id}
        name={name}
        className={cn(
          'h-11 w-full rounded-xl border bg-bg px-4 text-sm text-ink',
          'placeholder:text-dim outline-none',
          'transition-all duration-150',
          error
            ? 'border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-400/20'
            : 'border-surface2 hover:border-surface3 focus:border-accent/50 focus:ring-2 focus:ring-accent/10',
          className,
        )}
        {...rest}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
