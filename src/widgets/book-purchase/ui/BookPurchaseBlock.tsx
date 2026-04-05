'use client'

import { memo, useState } from 'react'
import { CONDITION_LABELS } from '@/entities/book/model/types'
import { RequestModal } from '@/features/book-request'
import type { Book } from '@/entities/book'

interface BookPurchaseBlockProps {
  book: Book
}

export const BookPurchaseBlock = memo<BookPurchaseBlockProps>(({ book }) => {
  const inStock = book.available && book.copiesLeft > 0
  const [modalOpen, setModalOpen] = useState(false)

  // Don't show purchase block if book is not active
  if (book.status !== 'active') {
    return (
      <div className="flex items-center gap-3 bg-surface rounded-2xl border border-surface2 px-5 py-4">
        <span className="w-2 h-2 rounded-full bg-surface3 flex-shrink-0" aria-hidden="true" />
        <p className="text-sm text-ash">
          {book.status === 'sold'     && 'Эта книга уже продана'}
          {book.status === 'pending'  && 'Книга на модерации'}
          {book.status === 'archived' && 'Книга в архиве'}
          {book.status === 'draft'    && 'Книга не опубликована'}
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-col gap-4 bg-surface rounded-2xl border border-surface2 px-5 py-5">
        {book.price != null && (
          <>
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-dim uppercase tracking-wider">Цена</span>
                <span
                  className="font-display font-semibold text-ink"
                  style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', lineHeight: 1 }}
                >
                  {book.priceType === 'negotiable'
                    ? 'Договорная'
                    : book.priceType === 'exchange'
                    ? 'Обмен'
                    : new Intl.NumberFormat('ru-RU', {
                        style: 'currency',
                        currency: book.currency,
                        maximumFractionDigits: 0,
                      }).format(book.price)}
                </span>
              </div>
              {book.copiesLeft > 0 && (
                <div className="flex flex-col items-end gap-0.5">
                  <span className="text-[10px] text-dim uppercase tracking-wider">В наличии</span>
                  <span className="text-sm font-medium text-ink">{book.copiesLeft} экз.</span>
                </div>
              )}
            </div>
            <hr className="border-surface2" />
          </>
        )}

        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  inStock
                    ? 'bg-[#27a560] shadow-[0_0_0_3px_rgba(39,165,96,0.15)]'
                    : 'bg-surface3'
                }`}
                aria-hidden="true"
              />
              <span className="text-sm text-ash">{inStock ? 'В наличии' : 'Нет в наличии'}</span>
            </div>
            {book.condition && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-surface2 text-ash border border-surface3">
                {CONDITION_LABELS[book.condition]}
              </span>
            )}
          </div>
          {book.edition && <span className="text-[11px] text-dim">{book.edition}</span>}
        </div>

        {inStock && book.ownerId ? (
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="w-full h-12 rounded-xl text-base font-medium bg-accent text-bg border border-accent hover:bg-accent2 hover:border-accent2 transition-all duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent shadow-accent-sm hover:shadow-accent"
          >
            Приобрести
          </button>
        ) : (
          <button
            type="button"
            disabled
            className="w-full h-12 rounded-xl text-base font-medium bg-surface2 text-ash border border-surface2 cursor-not-allowed"
          >
            Нет в наличии
          </button>
        )}
      </div>

      {modalOpen && book.ownerId && (
        <RequestModal
          bookId={book.id}
          bookTitle={book.title}
          sellerId={book.ownerId}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  )
})

BookPurchaseBlock.displayName = 'BookPurchaseBlock'
