import { type FC, type ReactNode } from 'react'
import Link from 'next/link'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  actionLabel?: string
  actionHref?: string
}

export const EmptyState: FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
}) => (
  <div className="flex flex-col items-center gap-5 py-24 text-center">
    {icon && (
      <div className="w-14 h-14 rounded-2xl bg-surface border border-surface2 flex items-center justify-center">
        {icon}
      </div>
    )}
    <div>
      <p className="text-ink font-medium mb-1">{title}</p>
      {description && <p className="text-ash text-sm">{description}</p>}
    </div>
    {actionLabel && actionHref && (
      <Link
        href={actionHref}
        className="inline-flex items-center justify-center h-10 px-6 rounded-xl text-sm font-medium bg-accent text-bg hover:bg-accent2 transition-all"
      >
        {actionLabel}
      </Link>
    )}
  </div>
)
