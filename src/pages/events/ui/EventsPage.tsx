'use client'

import { memo, useState, useMemo } from 'react'
import { Container } from '@/shared/ui/Container'
import { PageHeading } from '@/shared/ui/PageHeading'
import { EmptyState } from '@/shared/ui/EmptyState'
import { EventCard } from '@/entities/event'
import { MOCK_EVENTS } from '@/entities/event'
import { EventFilter } from '@/features/event-filter'
import type { EventType } from '@/entities/event'

type FilterValue = EventType | 'all' | 'upcoming' | 'online'

// ─── Grid ─────────────────────────────────────────────────────────────────────

function EventsGrid({ events }: { events: typeof MOCK_EVENTS }) {
  if (events.length === 0) {
    return (
      <EmptyState
        icon={
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#7D7060"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        }
        title="Событий не найдено"
        description="Попробуйте изменить фильтр"
      />
    )
  }

  return (
    <ul
      className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      aria-label={`Список событий: ${events.length}`}
    >
      {events.map((event) => (
        <li key={event.id}>
          <EventCard event={event} />
        </li>
      ))}
    </ul>
  )
}

// ─── Announce banner ──────────────────────────────────────────────────────────

function AnnounceBanner() {
  const next = MOCK_EVENTS.filter((e) => e.startsAt > new Date()).sort(
    (a, b) => a.startsAt.getTime() - b.startsAt.getTime(),
  )[0]

  if (!next) return null

  return (
    <div className="relative overflow-hidden rounded-2xl bg-dark px-6 md:px-10 py-8 mb-12">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute left-0 top-0 w-64 h-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/20 blur-[60px]" />
        <div className="absolute right-0 bottom-0 w-48 h-48 translate-x-1/3 translate-y-1/3 rounded-full bg-accent/15 blur-[50px]" />
      </div>
      <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-medium tracking-[2px] uppercase text-accent3 mb-1">
            Ближайшее событие
          </p>
          <p
            className="font-display font-semibold text-bg leading-snug"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
            }}
          >
            {next.title}
          </p>
          <p className="text-bg/50 text-sm mt-1">
            {next.startsAt.toLocaleDateString('ru-RU', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
            {next.location && ` · ${next.location}`}
          </p>
        </div>
        <span
          className={`flex-shrink-0 text-sm font-medium px-4 py-2 rounded-xl border ${
            next.isFree
              ? 'bg-accent text-bg border-accent'
              : 'bg-bg/10 text-bg border-bg/20'
          }`}
        >
          {next.isFree
            ? 'Бесплатно'
            : new Intl.NumberFormat('ru-RU', {
                style: 'currency',
                currency: next.currency,
                maximumFractionDigits: 0,
              }).format(next.price ?? 0)}
        </span>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export const EventsPage = memo(() => {
  const [filter, setFilter] = useState<FilterValue>('upcoming')
  const now = new Date()

  const filtered = useMemo(() => {
    return MOCK_EVENTS.filter((event) => {
      if (filter === 'upcoming') return event.startsAt > now
      if (filter === 'online') return event.isOnline
      if (filter === 'all') return true
      return event.type === filter
    }).sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime())
  }, [filter, now])

  return (
    <main id="main-content">
      <section className="py-12">
        <Container>
          <div className="mb-10">
            <PageHeading
              eyebrow="Жизнь библиотеки"
              title="События"
              subtitle="Лекции, встречи, выставки и экскурсии об истории и культуре Кавказа"
            />
          </div>

          <AnnounceBanner />

          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <EventFilter selected={filter} onChange={setFilter} />
              <p className="text-xs text-ash" role="status" aria-live="polite">
                {filtered.length === 0
                  ? 'Нет событий'
                  : `${filtered.length} ${filtered.length === 1 ? 'событие' : filtered.length < 5 ? 'события' : 'событий'}`}
              </p>
            </div>

            <EventsGrid events={filtered} />
          </div>
        </Container>
      </section>
    </main>
  )
})

EventsPage.displayName = 'EventsPage'
