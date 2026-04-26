'use client'

import { cn } from '@/shared/lib/cn'

interface FilterOption<T extends string> {
  value: T
  label: string
  count?: number
}

interface FilterChipsProps<T extends string> {
  options: FilterOption<T>[]
  selected: T
  onChange: (value: T) => void
  className?: string
}

export function FilterChips<T extends string>({
  options,
  selected,
  onChange,
  className,
}: FilterChipsProps<T>) {
  return (
    <div
      className={cn(
        'flex gap-2 overflow-x-auto pb-1 md:flex-wrap md:overflow-x-visible md:pb-0 no-scrollbar',
        className,
      )}
      role="list"
    >
      {options.map(({ value, label, count }) => (
        <button
          key={value}
          type="button"
          role="listitem"
          onClick={() => onChange(value)}
          aria-pressed={selected === value}
          className={cn(
            'h-8 px-4 rounded-full text-xs font-medium border transition-all cursor-pointer shrink-0',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
            selected === value
              ? 'bg-accent text-bg border-accent shadow-accent-sm'
              : 'bg-bg text-ash border-surface2 hover:border-surface3 hover:text-ink hover:bg-surface',
          )}
        >
          {label}
          {count != null && (
            <span className="ml-1.5 opacity-60">{count}</span>
          )}
        </button>
      ))}
    </div>
  )
}
