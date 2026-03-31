'use client'

import { memo } from 'react'
import { cn } from '@/shared/lib/cn'
import { CATEGORIES, CATEGORY_LABELS } from '@/shared/config/constants'
import type { BookCategory } from '@/entities/book'

interface BookFilterProps {
  selected: BookCategory | 'all'
  onChange: (value: BookCategory | 'all') => void
  className?: string
}

export const BookFilter = memo<BookFilterProps>(({ selected, onChange, className }) => {
  const allOptions: Array<{ value: BookCategory | 'all'; label: string }> = [
    { value: 'all', label: 'Все' },
    ...CATEGORIES.map((cat) => ({ value: cat, label: CATEGORY_LABELS[cat] })),
  ]

  return (
    <nav aria-label="Фильтр по категориям" className={className}>
      <ul className="flex flex-wrap gap-2" role="list">
        {allOptions.map(({ value, label }) => {
          const isActive = selected === value
          return (
            <li key={value}>
              <button
                type="button"
                onClick={() => onChange(value)}
                aria-pressed={isActive}
                className={cn(
                  'h-8 px-4 rounded-full text-xs font-medium',
                  'border transition-all duration-150 cursor-pointer',
                  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
                  isActive
                    ? 'bg-accent text-bg border-accent shadow-accent-sm'
                    : 'bg-bg text-ash border-surface2 hover:border-surface3 hover:text-ink hover:bg-surface',
                )}
              >
                {label}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
})

BookFilter.displayName = 'BookFilter'
