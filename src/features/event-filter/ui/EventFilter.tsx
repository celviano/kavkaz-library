'use client'

import { memo } from 'react'
import { cn } from '@/shared/lib/cn'
import { EVENT_TYPE_LABELS } from '@/entities/event'
import type { EventType } from '@/entities/event'

type FilterValue = EventType | 'all' | 'upcoming' | 'online'

interface EventFilterProps {
  selected: FilterValue
  onChange: (value: FilterValue) => void
  className?: string
}

const FILTERS: { value: FilterValue; label: string }[] = [
  { value: 'all',       label: 'Все' },
  { value: 'upcoming',  label: 'Предстоящие' },
  { value: 'online',    label: 'Онлайн' },
  { value: 'lecture',   label: EVENT_TYPE_LABELS.lecture },
  { value: 'meeting',   label: EVENT_TYPE_LABELS.meeting },
  { value: 'exhibition',label: EVENT_TYPE_LABELS.exhibition },
  { value: 'tour',      label: EVENT_TYPE_LABELS.tour },
]

export const EventFilter = memo<EventFilterProps>(({ selected, onChange, className }) => (
  <nav aria-label="Фильтр событий" className={className}>
    <ul className="flex flex-wrap gap-2" role="list">
      {FILTERS.map(({ value, label }) => {
        const isActive = selected === value
        return (
          <li key={value}>
            <button
              type="button"
              onClick={() => onChange(value)}
              aria-pressed={isActive}
              className={cn(
                'h-8 px-4 rounded-full text-xs font-medium border transition-all duration-150 cursor-pointer',
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
))

EventFilter.displayName = 'EventFilter'
