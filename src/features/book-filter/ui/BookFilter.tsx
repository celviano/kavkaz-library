'use client'

import { memo } from 'react'
import { FilterChips } from '@/shared/ui/FilterChips'
import { CATEGORIES, CATEGORY_LABELS } from '@/shared/config/constants'
import type { BookCategory } from '@/entities/book'

interface BookFilterProps {
  selected: BookCategory | 'all'
  onChange: (value: BookCategory | 'all') => void
  className?: string
}

export const BookFilter = memo<BookFilterProps>(({ selected, onChange, className }) => {
  const options = [
    { value: 'all' as const, label: 'Все' },
    ...CATEGORIES.map((cat) => ({ value: cat, label: CATEGORY_LABELS[cat] })),
  ]

  return (
    <nav aria-label="Фильтр по категориям" className={className}>
      <FilterChips options={options} selected={selected} onChange={onChange} />
    </nav>
  )
})

BookFilter.displayName = 'BookFilter'
