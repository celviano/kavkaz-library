'use client'

import { memo } from 'react'
import Link from 'next/link'
import { Container } from '@/shared/ui/Container'
import { Badge } from '@/shared/ui/Badge'
import { BookGrid } from '@/widgets/book-grid'
import { BookSlider } from '@/widgets/book-slider'
import { CATEGORY_LABELS } from '@/shared/config/constants'
import { useBook, useSimilarBooks } from '@/entities/book'
import { FavoriteButton } from '@/features/favorites'
import { CONDITION_LABELS } from '@/entities/book/model/types'

interface BookPageProps {
  bookId: string
}

export const BookPage = memo<BookPageProps>(({ bookId }) => {
  const { data: book, isLoading, error } = useBook(bookId)
  const { data: similar = [] } = useSimilarBooks(bookId, book?.category ?? 'history')

  if (isLoading) {
    return (
      <main id="main-content">
        <section className="py-10">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-12 xl:gap-20">
              <div className="aspect-[3/4] rounded-2xl bg-surface animate-pulse" />
              <div className="flex flex-col gap-5">
                <div className="h-5 w-24 bg-surface rounded-full animate-pulse" />
                <div className="h-10 w-3/4 bg-surface rounded-xl animate-pulse" />
                <div className="h-5 w-1/2 bg-surface rounded-full animate-pulse" />
                <div className="h-px bg-surface2" />
                <div className="grid grid-cols-3 gap-px bg-surface2 rounded-2xl overflow-hidden">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="bg-bg px-4 py-3.5 h-16 animate-pulse" />
                  ))}
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-surface rounded-full w-full animate-pulse" />
                  <div className="h-3 bg-surface rounded-full w-4/5 animate-pulse" />
                  <div className="h-3 bg-surface rounded-full w-3/5 animate-pulse" />
                </div>
              </div>
            </div>
          </Container>
        </section>
      </main>
    )
  }

  if (error || !book) {
    return (
      <main id="main-content" className="flex-1 flex items-center justify-center py-24">
        <Container>
          <div className="max-w-md mx-auto text-center flex flex-col items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-surface border border-surface2 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="#7D7060" strokeWidth="1.5" />
                <path
                  d="M12 8v4M12 16h.01"
                  stroke="#7D7060"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <h1
              className="font-display font-semibold text-ink"
              style={{ fontFamily: 'var(--font-display)', fontSize: '1.7rem' }}
            >
              Книга не найдена
            </h1>
            <p className="text-ash text-sm">Возможно, она была удалена или перемещена.</p>
            <Link
              href="/catalog"
              className="inline-flex items-center justify-center h-10 px-6 rounded-xl text-sm font-medium bg-accent text-bg hover:bg-accent2 transition-all"
            >
              В каталог
            </Link>
          </div>
        </Container>
      </main>
    )
  }

  const categoryLabel = CATEGORY_LABELS[book.category]

  return (
    <main id="main-content">
      <section className="py-10">
        <Container>
          {/* Breadcrumb */}
          <nav aria-label="Навигация по разделам" className="mb-10">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-ash">
              <li>
                <Link
                  href="/"
                  className="hover:text-accent transition-colors focus-visible:outline-accent rounded"
                >
                  Главная
                </Link>
              </li>
              <li aria-hidden="true" className="text-surface3">
                ›
              </li>
              <li>
                <Link
                  href="/catalog"
                  className="hover:text-accent transition-colors focus-visible:outline-accent rounded"
                >
                  Каталог
                </Link>
              </li>
              <li aria-hidden="true" className="text-surface3">
                ›
              </li>
              <li>
                <Link
                  href={`/catalog?category=${book.category}`}
                  className="hover:text-accent transition-colors focus-visible:outline-accent rounded"
                >
                  {categoryLabel}
                </Link>
              </li>
              <li aria-hidden="true" className="text-surface3">
                ›
              </li>
              <li className="text-text line-clamp-1">{book.title}</li>
            </ol>
          </nav>

          {/* Main grid */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-12 xl:gap-20 mb-16">
            <BookSlider title={book.title} year={book.year} category={categoryLabel} />

            <div className="flex flex-col gap-7">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <Badge category={book.category} label={categoryLabel} />
                  <FavoriteButton bookId={book.id} />
                </div>
                <h1
                  className="font-display font-semibold text-ink leading-tight"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(1.7rem, 3.5vw, 2.5rem)',
                  }}
                >
                  {book.title}
                </h1>
                <p
                  className="font-display italic text-ash"
                  style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem' }}
                >
                  {book.author}
                </p>
              </div>

              <hr className="border-surface2" />

              {/* Meta grid */}
              <div>
                <p className="text-[11px] font-medium tracking-[2px] uppercase text-accent mb-3">
                  Сведения об издании
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-px bg-surface2 rounded-2xl overflow-hidden">
                  {[
                    { label: 'Год издания', value: String(book.year) },
                    { label: 'Страниц', value: book.pages ? String(book.pages) : '—' },
                    { label: 'Язык', value: book.language },
                    { label: 'Издательство', value: book.publisherName ?? '—' },
                    { label: 'Место издания', value: book.publisherCity ?? '—' },
                    {
                      label: 'Состояние',
                      value: book.available ? 'Доступна' : 'Недоступна',
                      accent: book.available,
                    },
                  ].map(({ label, value, accent }) => (
                    <div key={label} className="bg-bg px-4 py-3.5 flex flex-col gap-1">
                      <span className="text-[10px] text-dim uppercase tracking-wider">
                        {label}
                      </span>
                      <span
                        className={`text-sm font-medium ${accent ? 'text-accent' : 'text-ink'}`}
                      >
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              {book.description && (
                <div>
                  <p className="text-[11px] font-medium tracking-[2px] uppercase text-accent mb-3">
                    О книге
                  </p>
                  <p className="text-ash text-base leading-relaxed">{book.description}</p>
                </div>
              )}

              {/* Tags */}
              {book.tags.length > 0 && (
                <div>
                  <p className="text-[11px] font-medium tracking-[2px] uppercase text-accent mb-3">
                    Темы
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {book.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1.5 rounded-full text-xs border border-surface2 bg-bg text-ash"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <hr className="border-surface2" />

              {/* Availability */}
              {/* Purchase block */}
              <div className="flex flex-col gap-4 bg-surface rounded-2xl border border-surface2 px-5 py-5">
                {/* Price row */}
                {book.price ? (
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] text-dim uppercase tracking-wider">
                        Цена
                      </span>
                      <span
                        className="font-display font-semibold text-ink"
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: '1.8rem',
                          lineHeight: 1,
                        }}
                      >
                        {new Intl.NumberFormat('ru-RU', {
                          style: 'currency',
                          currency: book.currency,
                          maximumFractionDigits: 0,
                        }).format(book.price)}
                      </span>
                    </div>

                    {/* Copies left badge */}
                    {book.copiesLeft > 0 && (
                      <div className="flex flex-col items-end gap-0.5">
                        <span className="text-[10px] text-dim uppercase tracking-wider">
                          В наличии
                        </span>
                        <span className="text-sm font-medium text-ink">
                          {book.copiesLeft}{' '}
                          {book.copiesLeft === 1
                            ? 'экз.'
                            : book.copiesLeft < 5
                              ? 'экз.'
                              : 'экз.'}
                        </span>
                      </div>
                    )}
                  </div>
                ) : null}

                {/* Divider if price exists */}
                {book.price && <hr className="border-surface2" />}

                {/* Condition + status row */}
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-4">
                    {/* Availability dot */}
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full flex-shrink-0 ${
                          book.available && book.copiesLeft > 0
                            ? 'bg-[#27a560] shadow-[0_0_0_3px_rgba(39,165,96,0.15)]'
                            : 'bg-surface3'
                        }`}
                        aria-hidden="true"
                      />
                      <span className="text-sm text-ash">
                        {book.available && book.copiesLeft > 0
                          ? 'В наличии'
                          : 'Нет в наличии'}
                      </span>
                    </div>

                    {/* Condition badge */}
                    {book.condition && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-surface2 text-ash border border-surface3">
                        {CONDITION_LABELS[book.condition]}
                      </span>
                    )}
                  </div>

                  {/* Edition */}
                  {book.edition && (
                    <span className="text-[11px] text-dim">{book.edition}</span>
                  )}
                </div>

                {/* CTA button */}
                {book.available && book.copiesLeft > 0 ? (
                  <button
                    type="button"
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
            </div>
          </div>

          {/* Similar */}
          {similar.length > 0 && (
            <section
              aria-labelledby="similar-heading"
              className="border-t border-surface2 pt-14"
            >
              <div className="flex items-end justify-between mb-8">
                <div>
                  <p className="text-[11px] font-medium tracking-[2px] uppercase text-accent mb-2">
                    Из того же раздела
                  </p>
                  <h2
                    id="similar-heading"
                    className="font-display font-semibold text-ink"
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'clamp(1.4rem, 2.5vw, 1.9rem)',
                    }}
                  >
                    Похожие книги
                  </h2>
                </div>
                <Link
                  href={`/catalog?category=${book.category}`}
                  className="text-sm text-ash hover:text-ink transition-colors hidden sm:inline-flex items-center gap-1 group"
                >
                  Все в разделе
                  <span
                    className="group-hover:translate-x-0.5 transition-transform"
                    aria-hidden="true"
                  >
                    →
                  </span>
                </Link>
              </div>
              <BookGrid books={similar} />
            </section>
          )}
        </Container>
      </section>
    </main>
  )
})

BookPage.displayName = 'BookPage'
