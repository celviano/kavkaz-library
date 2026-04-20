'use client'

import { memo, useId, useRef } from 'react'
import { cn } from '@/shared/lib/cn'
interface BookSearchProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

export const BookSearch = memo<BookSearchProps>(({ value, onChange, className }) => {
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className={cn('relative', className)}>
      <label htmlFor={inputId} className="sr-only">
        Поиск по названию или автору
      </label>
      <svg
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ash"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M10.5 10.5L14 14"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
      <input
        ref={inputRef}
        id={inputId}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Поиск по названию или автору..."
        className={cn(
          'w-full h-11 rounded-xl pl-11 pr-10',
          'bg-surface border border-surface2',
          'text-sm text-ink placeholder:text-dim',
          'transition-all duration-150',
          'hover:border-surface3',
          'focus:outline-none focus:border-accent/50 focus:bg-bg focus:ring-2 focus:ring-accent/10',
        )}
        aria-label="Поиск книг"
        autoComplete="off"
        spellCheck={false}
      />
      {value.length > 0 && (
        <button
          type="button"
          onClick={() => {
            onChange('')
            inputRef.current?.focus()
          }}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full text-ash hover:text-ink hover:bg-surface2 transition-colors cursor-pointer"
          aria-label="Очистить поиск"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  )
})

BookSearch.displayName = 'BookSearch'
