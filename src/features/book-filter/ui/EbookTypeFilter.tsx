'use client'

import { memo } from 'react'
import { cn } from '@/shared/lib/cn'

export type BookTypeFilter = 'all' | 'physical' | 'ebook'

interface EbookTypeFilterProps {
  value:    BookTypeFilter
  onChange: (value: BookTypeFilter) => void
  className?: string
}

const OPTIONS: { value: BookTypeFilter; label: string; icon: React.ReactNode }[] = [
  {
    value: 'all',
    label: 'Все книги',
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
      </svg>
    ),
  },
  {
    value: 'physical',
    label: 'Бумажные',
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
      </svg>
    ),
  },
  {
    value: 'ebook',
    label: 'Электронные',
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <rect x="5" y="2" width="14" height="20" rx="2"/>
        <line x1="9" y1="7" x2="15" y2="7"/>
        <line x1="9" y1="11" x2="15" y2="11"/>
        <line x1="9" y1="15" x2="12" y2="15"/>
      </svg>
    ),
  },
]

export const EbookTypeFilter = memo<EbookTypeFilterProps>(({ value, onChange, className }) => {
  return (
    <nav aria-label="Фильтр по типу книги" className={className}>
      <div className="flex flex-wrap gap-2">
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              'cursor-pointer inline-flex items-center gap-1.5 h-8 px-3 rounded-full text-xs font-medium border transition-all',
              value === opt.value
                ? 'bg-ink text-bg border-ink'
                : 'bg-bg text-ash border-surface2 hover:border-ink/30 hover:text-ink',
            )}
          >
            {opt.icon}
            {opt.label}
          </button>
        ))}
      </div>
    </nav>
  )
})

EbookTypeFilter.displayName = 'EbookTypeFilter'
