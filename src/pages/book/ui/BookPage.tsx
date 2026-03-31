import { memo } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Container } from '@/shared/ui/Container'
import { Badge } from '@/shared/ui/Badge'
import { BookGrid } from '@/widgets/book-grid'
import { BookSlider } from '@/widgets/book-slider'
import {
  MOCK_BOOKS,
  CATEGORY_LABELS,
  BOOK_TAGS,
  BOOK_PUBLISHER,
} from '@/shared/config/constants'
import type { Book } from '@/entities/book'

interface BookPageProps {
  bookId: string
}

function getSimilarBooks(book: Book): Book[] {
  return MOCK_BOOKS
    .filter((b) => b.id !== book.id && b.category === book.category)
    .slice(0, 4)
}

export const BookPage = memo<BookPageProps>(({ bookId }) => {
  const book = MOCK_BOOKS.find((b) => b.id === bookId)

  if (!book) notFound()

  const similar = getSimilarBooks(book)
  const tags = BOOK_TAGS[book.id] ?? []
  const publisher = BOOK_PUBLISHER[book.id]
  const categoryLabel = CATEGORY_LABELS[book.category]

  return (
    <main id="main-content">
      <section className="py-10">
        <Container>

          {/* Breadcrumb */}
          <nav aria-label="Навигация по разделам" className="mb-10">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-ash">
              <li>
                <Link href="/" className="hover:text-accent transition-colors focus-visible:outline-accent rounded">
                  Главная
                </Link>
              </li>
              <li aria-hidden="true" className="text-surface3">›</li>
              <li>
                <Link href="/catalog" className="hover:text-accent transition-colors focus-visible:outline-accent rounded">
                  Каталог
                </Link>
              </li>
              <li aria-hidden="true" className="text-surface3">›</li>
              <li>
                <Link
                  href={`/catalog?category=${book.category}`}
                  className="hover:text-accent transition-colors focus-visible:outline-accent rounded"
                >
                  {categoryLabel}
                </Link>
              </li>
              <li aria-hidden="true" className="text-surface3">›</li>
              <li className="text-text line-clamp-1">{book.title}</li>
            </ol>
          </nav>

          {/* Main grid: slider + info */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-12 xl:gap-20 mb-16">

            {/* Slider */}
            <BookSlider
              title={book.title}
              year={book.year}
              category={categoryLabel}
            />

            {/* Info */}
            <div className="flex flex-col gap-7">

              {/* Category + title */}
              <div className="flex flex-col gap-3">
                <Badge category={book.category} label={categoryLabel} />
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

              {/* Meta grid */}
              <div>
                <p className="text-[11px] font-medium tracking-[2px] uppercase text-accent mb-3">
                  Сведения об издании
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-px bg-surface2 rounded-2xl overflow-hidden">
                  {[
                    { label: 'Год издания',   value: String(book.year) },
                    { label: 'Страниц',       value: String(book.pages) },
                    { label: 'Язык',          value: book.language },
                    { label: 'Издательство',  value: publisher?.name ?? '—' },
                    { label: 'Место издания', value: publisher?.city ?? '—' },
                    { label: 'Состояние',     value: book.available ? 'Доступна' : 'Недоступна', accent: book.available },
                  ].map(({ label, value, accent }) => (
                    <div key={label} className="bg-bg px-4 py-3.5 flex flex-col gap-1">
                      <span className="text-[10px] text-dim uppercase tracking-wider">{label}</span>
                      <span className={`text-sm font-medium ${accent ? 'text-accent' : 'text-ink'}`}>
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <p className="text-[11px] font-medium tracking-[2px] uppercase text-accent mb-3">
                  О книге
                </p>
                <p className="text-ash text-base leading-relaxed">{book.description}</p>
              </div>

              {/* Tags */}
              {tags.length > 0 && (
                <div>
                  <p className="text-[11px] font-medium tracking-[2px] uppercase text-accent mb-3">
                    Темы
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
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

              {/* Availability block */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-surface rounded-2xl border border-surface2 px-5 py-4">
                <div className="flex items-center gap-3">
                  <span
                    className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                      book.available
                        ? 'bg-[#27a560] shadow-[0_0_0_3px_rgba(39,165,96,0.15)]'
                        : 'bg-surface3'
                    }`}
                    aria-hidden="true"
                  />
                  <div>
                    <p className="text-sm font-medium text-ink">
                      {book.available ? 'Доступна для ознакомления' : 'Временно недоступна'}
                    </p>
                    <p className="text-xs text-ash mt-0.5">
                      {book.available
                        ? 'Вы можете запросить книгу или ознакомиться с описанием'
                        : 'Следите за обновлениями каталога'}
                    </p>
                  </div>
                </div>
                {book.available && (
                  <button
                    type="button"
                    className="inline-flex items-center justify-center h-9 px-5 rounded-xl text-sm font-medium bg-accent text-bg border border-accent hover:bg-accent2 transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent whitespace-nowrap"
                  >
                    Запросить доступ
                  </button>
                )}
              </div>

            </div>
          </div>

          {/* Similar books */}
          {similar.length > 0 && (
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
                  href={`/catalog?category=${book.category}`}
                  className="text-sm text-ash hover:text-ink transition-colors focus-visible:outline-accent rounded hidden sm:inline-flex items-center gap-1 group"
                >
                  Все в разделе
                  <span className="group-hover:translate-x-0.5 transition-transform" aria-hidden="true">→</span>
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
