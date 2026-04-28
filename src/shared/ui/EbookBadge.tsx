import { memo } from 'react'
import { cn } from '@/shared/lib/cn'
import { EBOOK_FORMAT_LABELS } from '@/entities/ebook/model/types'
import type { EbookFormat } from '@/entities/ebook/model/types'

interface EbookBadgeProps {
  format?:    EbookFormat
  className?: string
}

export const EbookBadge = memo<EbookBadgeProps>(({ format, className }) => {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium',
        'bg-blue-50 text-blue-600 border border-blue-200',
        className,
      )}
    >
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
        <rect x="5" y="2" width="14" height="20" rx="2"/>
        <line x1="9" y1="7" x2="15" y2="7"/>
        <line x1="9" y1="11" x2="15" y2="11"/>
      </svg>
      {format ? EBOOK_FORMAT_LABELS[format] : 'Электронная'}
    </span>
  )
})

EbookBadge.displayName = 'EbookBadge'
