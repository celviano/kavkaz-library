import { type FC } from 'react'
import { cn } from '@/shared/lib/cn'

interface ErrorBannerProps {
  message:    string | null | undefined
  className?: string
}

export const ErrorBanner: FC<ErrorBannerProps> = ({ message, className }) => {
  if (!message) return null
  return (
    <div
      role="alert"
      className={cn(
        'rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600',
        className,
      )}
    >
      {message}
    </div>
  )
}
