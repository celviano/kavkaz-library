'use client'

import { memo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { cn } from '@/shared/lib/cn'

export type BookType = 'physical' | 'ebook'

interface BookTypeToggleProps {
  value:    BookType
  onChange: (value: BookType) => void
}

export const BookTypeToggle = memo<BookTypeToggleProps>(({ value, onChange }) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleChange = (newType: BookType) => {
    onChange(newType)
    // Обновляем URL с query параметром
    const params = new URLSearchParams(searchParams)
    params.set('type', newType)
    router.push(`/add-book?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-[11px] font-medium tracking-[2px] uppercase text-ash">
        Тип издания
      </p>
      <div className="flex gap-1 bg-surface border border-surface2 rounded-xl p-1 w-fit">
        <button
          type="button"
          onClick={() => handleChange('physical')}
          className={cn(
            'flex items-center gap-2 h-9 px-5 rounded-lg text-sm font-medium transition-all',
            value === 'physical'
              ? 'bg-bg text-ink shadow-card'
              : 'text-ash hover:text-ink',
          )}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
          </svg>
          Бумажная
        </button>
        <button
          type="button"
          onClick={() => handleChange('ebook')}
          className={cn(
            'flex items-center gap-2 h-9 px-5 rounded-lg text-sm font-medium transition-all',
            value === 'ebook'
              ? 'bg-bg text-ink shadow-card'
              : 'text-ash hover:text-ink',
          )}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <rect x="5" y="2" width="14" height="20" rx="2"/>
            <line x1="9" y1="7" x2="15" y2="7"/>
            <line x1="9" y1="11" x2="15" y2="11"/>
            <line x1="9" y1="15" x2="12" y2="15"/>
          </svg>
          Электронная
        </button>
      </div>

      {value === 'ebook' && (
        <p className="text-xs text-ash">
          Электронные книги предоставляются бесплатно — блок продажи не нужен
        </p>
      )}
    </div>
  )
})

BookTypeToggle.displayName = 'BookTypeToggle'
