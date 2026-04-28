'use client'

import { memo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/shared/lib/cn'
import { EmptyState } from '@/shared/ui/EmptyState'
import { FilterChips } from '@/shared/ui/FilterChips'
import { STATUS_LABELS, STATUS_COLORS } from '@/entities/book/model/types'
import { useMyBooks, useUpdateBookStatus } from '@/features/dashboard/model/useDashboard'
import type { BookStatus } from '@/entities/book/model/types'

const STATUS_FILTERS: { value: BookStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Все' },
  { value: 'active', label: 'Активные' },
  { value: 'pending', label: 'На модерации' },
  { value: 'draft', label: 'Черновики' },
  { value: 'sold', label: 'Проданные' },
  { value: 'archived', label: 'Архив' },
]

interface MyBooksTabProps {
  userId: string
}

export const MyBooksTab = memo<MyBooksTabProps>(({ userId }) => {
  const [filter, setFilter] = useState<BookStatus | 'all'>('all')
  const { data: books = [], isLoading } = useMyBooks(userId)
  const { mutate: changeStatus, isPending } = useUpdateBookStatus(userId)

  const filtered = filter === 'all' ? books : books.filter((b) => b.status === filter)

  const filterOptions = STATUS_FILTERS.map(({ value, label }) => ({
    value,
    label,
    count: value !== 'all' ? books.filter((b) => b.status === value).length : undefined,
  }))

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-20 rounded-2xl bg-surface animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Filter chips */}
      <FilterChips
        options={filterOptions}
        selected={filter}
        onChange={(v) => setFilter(v as BookStatus | 'all')}
      />

      {filtered.length === 0 ? (
        <EmptyState
          title="Книг нет"
          description={
            filter === 'all'
              ? 'Добавьте первую книгу'
              : `Нет книг со статусом "${STATUS_LABELS[filter as BookStatus]}"`
          }
          actionLabel={filter === 'all' ? 'Добавить книгу' : undefined}
          actionHref={filter === 'all' ? '/add-book' : undefined}
        />
      ) : (
        <ul className="flex flex-col gap-3">
          {filtered.map((book) => (
            <li key={book.id}>
              <div className="flex flex-col md:flex-row md:items-start gap-4 bg-surface border border-surface2 rounded-2xl p-4">
                {/* Cover */}
                <div className="w-12 h-16 rounded-lg bg-surface2 overflow-hidden shrink-0 relative">
                  {book.coverUrl ? (
                    <Image
                      src={book.coverUrl}
                      alt={book.title}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="var(--color-dim)"
                        strokeWidth="1.5"
                      >
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 flex flex-col gap-1 sm:min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={cn(
                        'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border',
                        STATUS_COLORS[book.status],
                      )}
                    >
                      {STATUS_LABELS[book.status]}
                    </span>
                    {book.status === 'pending' && (
                      <span className="text-[10px] text-dim">
                        Ожидает проверки администратором
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-ink truncate">{book.title}</p>
                  <p className="text-xs text-ash">
                    {book.author}, {book.year}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto sm:shrink-0">
                  <Link
                    href={`/book/${book.id}`}
                    className="h-8 px-3 rounded-lg text-xs border border-steel2/40 text-steel2 hover:bg-steel/30 hover:border-steel2/60 transition-colors inline-flex items-center"
                  >
                    Просмотр
                  </Link>

                  {book.status === 'active' && (
                    <button
                      type="button"
                      onClick={() => changeStatus({ bookId: book.id, status: 'sold' })}
                      disabled={isPending}
                      className="h-8 px-3 rounded-lg text-xs border border-gold/40 text-gold hover:bg-gold/8 hover:border-gold/60 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      Продана
                    </button>
                  )}

                  {(book.status === 'active' || book.status === 'draft') && (
                    <button
                      type="button"
                      onClick={() =>
                        changeStatus({ bookId: book.id, status: 'archived' })
                      }
                      disabled={isPending}
                      className="h-8 px-3 rounded-lg text-xs border border-surface2 text-dim hover:text-ash hover:bg-surface2 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      Архив
                    </button>
                  )}

                  {book.status === 'archived' && (
                    <button
                      type="button"
                      onClick={() => changeStatus({ bookId: book.id, status: 'active' })}
                      disabled={isPending}
                      className="h-8 px-3 rounded-lg text-xs border border-accent/30 text-accent hover:bg-accent/8 hover:border-accent/50 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      Восстановить
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
})

MyBooksTab.displayName = 'MyBooksTab'
