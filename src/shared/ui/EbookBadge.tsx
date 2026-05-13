import { memo } from 'react'

import type { EbookFormat } from '@/entities/ebook/model/types'
import { EBOOK_FORMAT_LABELS } from '@/entities/ebook/model/types'
import { cn } from '@/shared/lib/cn'

const FORMAT_COLORS: Record<EbookFormat, string> = {
  pdf: 'bg-red-50 text-red-600 border-red-200',
  epub: 'bg-accent/10 text-accent border-accent/20',
  djvu: 'bg-gold/10 text-gold border-gold/20',
  txt: 'bg-surface2 text-ash border-surface3',
  mobi: 'bg-orange-50 text-orange-600 border-orange-200',
}

interface EbookBadgeProps {
  format?: EbookFormat
  className?: string
}

export const EbookBadge = memo<EbookBadgeProps>(({ format, className }) => {
  const colors = format ? FORMAT_COLORS[format] : 'bg-surface2 text-ash border-surface3'

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border',
        colors,
        className,
      )}
    >
      <svg
        width="10"
        height="10"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <rect x="5" y="2" width="14" height="20" rx="2" />
        <line x1="9" y1="7" x2="15" y2="7" />
        <line x1="9" y1="11" x2="15" y2="11" />
      </svg>
      {format ? EBOOK_FORMAT_LABELS[format] : 'Электронная'}
    </span>
  )
})

EbookBadge.displayName = 'EbookBadge'
