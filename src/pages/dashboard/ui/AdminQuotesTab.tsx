'use client'

import { memo, useState } from 'react'

import { useAllQuotes, useUpdateQuoteStatus } from '@/features/quotes/model/useQuotes'
import { AddQuoteModal } from '@/features/quotes/ui/AddQuoteModal'
import { QuoteAdminMenu } from '@/features/quotes/ui/QuoteAdminMenu'
import { useCurrentUser } from '@/shared/hooks/useCurrentUser'
import { cn } from '@/shared/lib/cn'
import type { Quote } from '@/shared/lib/supabase/queries/quotes'
import {
  QUOTE_STATUS_COLORS,
  QUOTE_STATUS_LABELS,
} from '@/shared/lib/supabase/queries/quotes'
import { EmptyState } from '@/shared/ui/EmptyState'

function QuoteCard({ quote, onEdit }: { quote: Quote; onEdit: (q: Quote) => void }) {
  const { mutate: updateStatus, isPending } = useUpdateQuoteStatus()

  return (
    <div className="relative bg-bg border border-surface2 rounded-2xl p-5 flex flex-col gap-3 shadow-card">
      {/* Kebab menu — top-right corner */}
      <div className="absolute top-3 right-3">
        <QuoteAdminMenu quote={quote} onEdit={() => onEdit(quote)} />
      </div>

      {/* Quote text */}
      <p className="text-sm text-ink leading-relaxed italic pr-10">«{quote.text}»</p>

      {/* Author & source */}
      <div className="flex items-center gap-2 text-xs text-ash">
        <span className="font-medium text-accent">{quote.author}</span>
        <span className="text-dim">·</span>
        <span>{quote.source}</span>
      </div>

      {/* Bottom row */}
      <div className="flex items-center justify-between gap-3 pt-2 border-t border-surface2 flex-wrap">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'inline-flex items-center h-6 px-2.5 rounded-full text-[11px] font-medium border',
              QUOTE_STATUS_COLORS[quote.status],
            )}
          >
            {QUOTE_STATUS_LABELS[quote.status]}
          </span>
          <span className="text-[11px] text-dim">
            {new Date(quote.createdAt).toLocaleDateString('ru-RU')}
          </span>
        </div>

        {/* Если на рассмотрении — кнопки апрув/отклонить */}
        {quote.status === 'pending' && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isPending}
              onClick={() => updateStatus({ quoteId: quote.id, status: 'rejected' })}
              className="h-8 px-3 rounded-lg text-xs font-medium border border-red-200 text-red-500 hover:bg-red-50 transition-all disabled:opacity-50"
            >
              Отклонить
            </button>
            <button
              type="button"
              disabled={isPending}
              onClick={() => updateStatus({ quoteId: quote.id, status: 'approved' })}
              className="h-8 px-3 rounded-lg text-xs font-medium bg-accent text-bg border border-accent hover:bg-accent2 transition-all disabled:opacity-50"
            >
              {isPending ? (
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full border-2 border-bg/30 border-t-bg animate-spin" />
                  ...
                </span>
              ) : (
                'Одобрить'
              )}
            </button>
          </div>
        )}

        {/* Если одобрена — показать дату очереди */}
        {quote.status === 'approved' && quote.queueDate && (
          <p className="text-[11px] text-ash">
            Показ:{' '}
            <span className="font-medium text-ink">
              {new Date(quote.queueDate).toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
          </p>
        )}
      </div>
    </div>
  )
}

export const AdminQuotesTab = memo(() => {
  const { data: quotes = [], isLoading } = useAllQuotes()
  const { user } = useCurrentUser()
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null)

  const pending = quotes.filter((q) => q.status === 'pending')
  const approved = quotes.filter((q) => q.status === 'approved')
  const rejected = quotes.filter((q) => q.status === 'rejected')
  const archived = quotes.filter((q) => q.status === 'archived')

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-28 rounded-2xl bg-surface border border-surface2 animate-pulse"
          />
        ))}
      </div>
    )
  }

  if (quotes.length === 0) {
    return (
      <EmptyState
        title="Нет цитат"
        description="Пользователи ещё не предложили ни одной цитаты"
      />
    )
  }

  return (
    <>
      <div className="flex flex-col gap-8">
        {/* На рассмотрении */}
        {pending.length > 0 && (
          <div>
            <h3 className="text-[11px] font-medium tracking-[2px] uppercase text-gold mb-3">
              На рассмотрении · {pending.length}
            </h3>
            <div className="flex flex-col gap-3">
              {pending.map((q) => (
                <QuoteCard key={q.id} quote={q} onEdit={setEditingQuote} />
              ))}
            </div>
          </div>
        )}

        {/* Одобренные */}
        {approved.length > 0 && (
          <div>
            <h3 className="text-[11px] font-medium tracking-[2px] uppercase text-accent mb-3">
              Одобрены · {approved.length}
            </h3>
            <div className="flex flex-col gap-3">
              {approved.map((q) => (
                <QuoteCard key={q.id} quote={q} onEdit={setEditingQuote} />
              ))}
            </div>
          </div>
        )}

        {/* Отклонённые */}
        {rejected.length > 0 && (
          <div>
            <h3 className="text-[11px] font-medium tracking-[2px] uppercase text-dim mb-3">
              Отклонены · {rejected.length}
            </h3>
            <div className="flex flex-col gap-3">
              {rejected.map((q) => (
                <QuoteCard key={q.id} quote={q} onEdit={setEditingQuote} />
              ))}
            </div>
          </div>
        )}

        {/* Архивированные */}
        {archived.length > 0 && (
          <div>
            <h3 className="text-[11px] font-medium tracking-[2px] uppercase text-ash mb-3">
              Архив · {archived.length}
            </h3>
            <div className="flex flex-col gap-3">
              {archived.map((q) => (
                <QuoteCard key={q.id} quote={q} onEdit={setEditingQuote} />
              ))}
            </div>
          </div>
        )}
      </div>

      {editingQuote && user && (
        <AddQuoteModal
          userId={user.id}
          quote={editingQuote}
          onClose={() => setEditingQuote(null)}
        />
      )}
    </>
  )
})

AdminQuotesTab.displayName = 'AdminQuotesTab'
