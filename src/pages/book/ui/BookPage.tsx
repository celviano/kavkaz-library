'use client'

import { memo } from 'react'
import Link from 'next/link'
import { Container } from '@/shared/ui/Container'
import { Badge } from '@/shared/ui/Badge'
import { Breadcrumb } from '@/shared/ui/Breadcrumb'
import { EmptyState } from '@/shared/ui/EmptyState'
import { BookGrid } from '@/widgets/book-grid'
import { BookSlider } from '@/widgets/book-slider'
import { BookMetaGrid } from '@/widgets/book-meta'
import { BookPurchaseBlock } from '@/widgets/book-purchase'
import { CATEGORY_LABELS } from '@/shared/config/constants'
import { useBook, useSimilarBooks } from '@/entities/book'
import { FavoriteButton } from '@/features/favorites'

interface BookPageProps {
  bookId: string
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function BookPageSkeleton() {
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

// ─── Similar section ──────────────────────────────────────────────────────────

interface SimilarSectionProps {
  category: string
  books: ReturnType<typeof useSimilarBooks>['data']
}

function SimilarSection({ category, books }: SimilarSectionProps) {
  if (!books || books.length === 0) return null

  return (
    <section aria-labelledby="similar-heading" className="border-t border-surface2 pt-14">
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-[11px] font-medium tracking-[2px] uppercase text-accent mb-2">
            Из того же раздела
          </p>
          <h2
            id="similar-heading"
            className="font-display font-semibold text-ink"
            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem, 2.5vw, 1.9rem)' }}
          >
            Похожие книги
          </h2>
        </div>
        <Link
          href={`/catalog?category=${category}`}
          className="text-sm text-ash hover:text-ink transition-colors hidden sm:inline-flex items-center gap-1 group"
        >
          Все в разделе
          <span className="group-hover:translate-x-0.5 transition-transform" aria-hidden="true">→</span>
        </Link>
      </div>
      <BookGrid books={books} />
    </section>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export const BookPage = memo<BookPageProps>(({ bookId }) => {
  const { data: book, isLoading, error } = useBook(bookId)
  const { data: similar = [] } = useSimilarBooks(bookId, book?.category ?? 'history')

  if (isLoading) return <BookPageSkeleton />

  if (error || !book) {
    return (
      <main id="main-content" className="flex-1 flex items-center justify-center py-24">
        <Container>
          <EmptyState
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="#7D7060" strokeWidth="1.5" />
                <path d="M12 8v4M12 16h.01" stroke="#7D7060" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            }
            title="Книга не найдена"
            description="Возможно, она была удалена или перемещена."
            actionLabel="В каталог"
            actionHref="/catalog"
          />
        </Container>
      </main>
    )
  }

  const categoryLabel = CATEGORY_LABELS[book.category]

  return (
    <main id="main-content">
      <section className="py-10">
        <Container>
          <Breadcrumb
            items={[
              { label: 'Главная', href: '/' },
              { label: 'Каталог', href: '/catalog' },
              { label: categoryLabel, href: `/catalog?category=${book.category}` },
              { label: book.title },
            ]}
          />

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-12 xl:gap-20 mb-16">
            <div className="min-w-0 w-full">
              <BookSlider
                title={book.title}
                year={book.year}
                category={categoryLabel}
                coverUrl={book.coverUrl}
                images={book.images}
              />
            </div>

            <div className="flex flex-col gap-7">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <Badge category={book.category} label={categoryLabel} />
                  <FavoriteButton bookId={book.id} />
                </div>
                <h1
                  className="font-display font-semibold text-ink leading-tight"
                  style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.7rem, 3.5vw, 2.5rem)' }}
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

              <BookMetaGrid book={book} />

              {book.description && (
                <div>
                  <p className="text-[11px] font-medium tracking-[2px] uppercase text-accent mb-3">О книге</p>
                  <p className="text-ash text-base leading-relaxed">{book.description}</p>
                </div>
              )}

              {book.tags.length > 0 && (
                <div>
                  <p className="text-[11px] font-medium tracking-[2px] uppercase text-accent mb-3">Темы</p>
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

              <BookPurchaseBlock book={book} />
            </div>
          </div>

          <SimilarSection category={book.category} books={similar} />
        </Container>
      </section>
    </main>
  )
})

BookPage.displayName = 'BookPage'
