import { cn } from '@/shared/lib/cn'
import { EVENT_TYPE_LABELS } from '../model/types'
import type { Event, EventType } from '../model/types'
import { type FC } from 'react'

const TYPE_COLORS: Record<EventType, string> = {
  lecture: 'bg-accent/10 text-accent border-accent/20',
  meeting: 'bg-gold/10 text-gold border-gold/20',
  exhibition: 'bg-steel2/10 text-steel2 border-steel2/20',
  tour: 'bg-dim/10 text-ash border-dim/20',
  other: 'bg-surface2 text-ash border-surface3',
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
}

interface EventCardProps {
  event: Event
  className?: string
}

export const EventCard: FC<EventCardProps> = ({ event, className }) => {
  const isPast = event.startsAt < new Date()

  return (
    <article
      className={cn(
        'flex flex-col bg-surface rounded-2xl border border-surface2 overflow-hidden',
        'transition-all duration-300 shadow-card',
        isPast
          ? 'opacity-60'
          : 'hover:border-accent/30 hover:shadow-accent hover:-translate-y-1',
        className,
      )}
      aria-label={event.title}
    >
      {/* Cover / placeholder */}
      <div className="relative h-44 bg-surface2 overflow-hidden flex items-center justify-center">
        {event.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={event.coverUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <>
            <svg
              className="absolute inset-0 w-full h-full opacity-[0.04]"
              preserveAspectRatio="xMidYMid slice"
              aria-hidden="true"
            >
              <defs>
                <pattern
                  id={`evt-pat-${event.id}`}
                  x="0"
                  y="0"
                  width="60"
                  height="60"
                  patternUnits="userSpaceOnUse"
                >
                  <polygon
                    points="30,4 56,30 30,56 4,30"
                    fill="none"
                    stroke="#2a5c45"
                    strokeWidth="1"
                  />
                  <polygon
                    points="30,14 46,30 30,46 14,30"
                    fill="none"
                    stroke="#8B6914"
                    strokeWidth="0.7"
                  />
                  <circle cx="30" cy="30" r="3" fill="#2a5c45" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill={`url(#evt-pat-${event.id})`} />
            </svg>
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#2a5c45"
              strokeWidth="1.2"
              strokeLinecap="round"
              className="opacity-20"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </>
        )}

        {/* Type badge */}
        <span
          className={cn(
            'absolute top-3 left-3 inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium border',
            TYPE_COLORS[event.type],
          )}
        >
          {EVENT_TYPE_LABELS[event.type]}
        </span>

        {/* Online badge */}
        {event.isOnline && (
          <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium bg-dark/70 text-bg border border-bg/10 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-accent3" aria-hidden="true" />
            Онлайн
          </span>
        )}

        {/* Past overlay */}
        {isPast && (
          <div className="absolute inset-0 bg-bg/50 flex items-center justify-center">
            <span className="text-xs text-ash font-medium tracking-widest uppercase">
              Завершено
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col gap-3 p-5 flex-1">
        {/* Date & time */}
        <div className="flex items-center gap-2 text-xs text-dim">
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span>
            {formatDate(event.startsAt)}, {formatTime(event.startsAt)}
          </span>
        </div>

        <h3
          className="font-display font-semibold text-ink leading-snug line-clamp-2"
          style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem' }}
        >
          {event.title}
        </h3>

        <p className="text-ash text-sm leading-relaxed line-clamp-3 flex-1">
          {event.description}
        </p>

        {/* Footer */}
        <div className="pt-3 border-t border-surface2/60 flex items-center justify-between gap-3">
          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs text-dim min-w-0">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              aria-hidden="true"
              className="flex-shrink-0"
            >
              <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span className="truncate">
              {event.isOnline ? 'Онлайн' : (event.location ?? 'Место уточняется')}
            </span>
          </div>

          {/* Price */}
          <span
            className={cn(
              'flex-shrink-0 text-xs font-medium px-2.5 py-1 rounded-full border',
              event.isFree
                ? 'text-accent bg-accent/8 border-accent/20'
                : 'text-ink bg-surface border-surface2',
            )}
          >
            {event.isFree
              ? 'Бесплатно'
              : new Intl.NumberFormat('ru-RU', {
                  style: 'currency',
                  currency: event.currency,
                  maximumFractionDigits: 0,
                }).format(event.price ?? 0)}
          </span>
        </div>
      </div>
    </article>
  )
}
