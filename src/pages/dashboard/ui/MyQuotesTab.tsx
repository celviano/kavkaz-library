'use client'

import { memo } from 'react'
import { cn } from '@/shared/lib/cn'
import { EmptyState } from '@/shared/ui/EmptyState'
import { QUOTE_STATUS_LABELS, QUOTE_STATUS_COLORS } from '@/shared/lib/supabase/queries/quotes'
import { useMyQuotes } from '@/features/quotes/model/useQuotes'

interface MyQuotesTabProps {
  userId: string
}

function formatQueueDate(date: Date): string {
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
}

export const MyQuotesTab = memo<MyQuotesTabProps>(({ userId }) => {
  const { data: quotes = [], isLoading } = useMyQuotes(userId)

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="h-28 rounded-2xl bg-surface border border-surface2 animate-pulse" />
        ))}
      </div>
    )
  }

  if (quotes.length === 0) {
    return (
      <EmptyState
        title="У вас пока нет цитат"
        description="Предложите цитату о Кавказе — она появится на главной странице после проверки"
      />
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {quotes.map((quote) => (
        <div
          key={quote.id}
          className="bg-bg border border-surface2 rounded-2xl p-5 flex flex-col gap-3 shadow-card"
        >
          {/* Quote text */}
          <p className="text-sm text-ink leading-relaxed italic">
            «{quote.text}»
          </p>

          {/* Author & source */}
          <div className="flex items-center gap-2 text-xs text-ash">
            <span className="font-medium text-accent">{quote.author}</span>
            <span className="text-dim">·</span>
            <span>{quote.source}</span>
          </div>

          {/* Status row */}
          <div className="flex items-center justify-between gap-3 pt-2 border-t border-surface2">
            <span
              className={cn(
                'inline-flex items-center h-6 px-2.5 rounded-full text-[11px] font-medium border',
                QUOTE_STATUS_COLORS[quote.status],
              )}
            >
              {QUOTE_STATUS_LABELS[quote.status]}
            </span>

            {/* Если одобрена — показать дату показа */}
            {quote.status === 'approved' && quote.queueDate && (
              <p className="text-[11px] text-ash leading-snug text-right">
                <span className="text-accent font-medium">Ваша цитата принята.</span>{' '}
                Вы сможете увидеть её{' '}
                <span className="font-medium text-ink">{formatQueueDate(quote.queueDate)}</span>
              </p>
            )}

            {/* Если на рассмотрении */}
            {quote.status === 'pending' && (
              <p className="text-[11px] text-dim">
                Отправлена {new Date(quote.createdAt).toLocaleDateString('ru-RU')}
              </p>
            )}

            {/* Если отклонена */}
            {quote.status === 'rejected' && (
              <p className="text-[11px] text-dim">
                К сожалению, цитата не прошла модерацию
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
})

MyQuotesTab.displayName = 'MyQuotesTab'
