import { type FC, type ReactNode, type ButtonHTMLAttributes } from 'react'
import { cn } from '@/shared/lib/cn'

type ButtonVariant = 'primary' | 'outline' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  children: ReactNode
  className?: string
}

const VARIANTS: Record<ButtonVariant, string> = {
  primary: [
    'bg-accent text-bg font-medium',
    'border border-accent',
    'hover:bg-accent2 hover:border-accent2',
    'shadow-accent-sm hover:shadow-accent',
    'transition-all duration-200',
  ].join(' '),
  outline: [
    'bg-transparent text-accent font-medium',
    'border border-accent/50',
    'hover:bg-accent/8 hover:border-accent',
    'transition-all duration-200',
  ].join(' '),
  ghost: [
    'bg-transparent text-ash font-normal',
    'border border-transparent',
    'hover:text-ink hover:bg-surface2',
    'transition-all duration-150',
  ].join(' '),
}

const SIZES: Record<ButtonSize, string> = {
  sm: 'h-8  px-4  text-xs  rounded-lg gap-1.5',
  md: 'h-10 px-6  text-sm  rounded-lg gap-2',
  lg: 'h-12 px-8  text-base rounded-xl gap-2',
}

export const Button: FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className,
  ...rest
}) => {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center',
        'cursor-pointer select-none whitespace-nowrap',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'active:scale-[0.98] transition-transform duration-100',
        SIZES[size],
        VARIANTS[variant],
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  )
}
