import { memo } from 'react'
import Link from 'next/link'
import { Hero } from '@/widgets/hero'
import { AboutPreview } from '@/widgets/about-preview'
import { BookGrid } from '@/widgets/book-grid'
import { Container } from '@/shared/ui/Container'
import { Badge } from '@/shared/ui/Badge'
import {
  MOCK_BOOKS,
  FEATURED_BOOK_IDS,
  CATEGORIES,
  CATEGORY_LABELS,
} from '@/shared/config/constants'
import { QuoteBanner } from '@/widgets/quote-banner'

export const HomePage = memo(() => {
  const featuredBooks = MOCK_BOOKS.filter((b) => FEATURED_BOOK_IDS.includes(b.id))

  return (
    <main id="main-content">
      <Hero />
      <AboutPreview />
      <QuoteBanner />
      {/* Featured books */}
      <section
        aria-labelledby="featured-heading"
        className="py-20 border-t border-surface2"
      >
        <Container>
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[11px] font-medium tracking-[2px] uppercase text-accent mb-2">
                Рекомендуем
              </p>
              <h2
                id="featured-heading"
                className="font-display font-semibold text-ink leading-tight"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
                }}
              >
                Избранные книги
              </h2>
            </div>
            <Link
              href="/catalog"
              className="text-sm text-ash hover:text-ink transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent rounded hidden sm:inline-flex items-center gap-1"
            >
              Весь каталог
              <span aria-hidden="true">→</span>
            </Link>
          </div>
          <BookGrid books={featuredBooks} />
          <div className="mt-8 flex justify-center sm:hidden">
            <Link
              href="/catalog"
              className="inline-flex items-center justify-center h-10 px-6 rounded-lg text-sm font-medium bg-transparent text-accent border border-accent/40 hover:bg-accent/8 transition-all"
            >
              Весь каталог →
            </Link>
          </div>
        </Container>
      </section>

      {/* Categories */}
      <section
        aria-labelledby="categories-heading"
        className="py-20 border-t border-surface2 bg-surface/40"
      >
        <Container>
          <div className="mb-10">
            <p className="text-[11px] font-medium tracking-[2px] uppercase text-accent mb-2">
              Разделы
            </p>
            <h2
              id="categories-heading"
              className="font-display font-semibold text-ink"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
              }}
            >
              Категории
            </h2>
          </div>

          <ul
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
            role="list"
            aria-label="Список категорий"
          >
            {CATEGORIES.map((cat) => {
              const count = MOCK_BOOKS.filter((b) => b.category === cat).length
              return (
                <li key={cat}>
                  <Link
                    href={`/catalog?category=${cat}`}
                    className="flex flex-col gap-3 p-5 rounded-2xl bg-bg border border-surface2 hover:border-accent/30 hover:shadow-accent-sm transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent group shadow-card"
                    aria-label={`${CATEGORY_LABELS[cat]}: ${count} книг`}
                  >
                    <Badge category={cat} label={CATEGORY_LABELS[cat]} />
                    <span
                      className="font-display font-semibold text-accent"
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.75rem',
                        lineHeight: 1,
                      }}
                    >
                      {count}
                    </span>
                    <span className="text-[11px] text-ash uppercase tracking-wider">
                      {count === 1 ? 'книга' : count < 5 ? 'книги' : 'книг'}
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </Container>
      </section>

      {/* CTA */}
      <section aria-labelledby="cta-heading" className="py-20 border-t border-surface2">
        <Container>
          <div className="relative overflow-hidden rounded-3xl bg-dark px-8 md:px-16 py-16 text-center">
            <div className="pointer-events-none absolute inset-0" aria-hidden="true">
              <div className="absolute left-0 top-0 w-96 h-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/20 blur-[80px]" />
              <div className="absolute right-0 bottom-0 w-72 h-72 translate-x-1/3 translate-y-1/3 rounded-full bg-accent/15 blur-[60px]" />
            </div>
            <div className="relative flex flex-col items-center gap-5 max-w-2xl mx-auto">
              <h2
                id="cta-heading"
                className="font-display font-semibold text-bg"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.6rem, 3.5vw, 2.5rem)',
                }}
              >
                Изучайте историю <em className="text-accent3 not-italic">Кавказа</em>
              </h2>
              <p className="text-bg/55 text-base leading-relaxed max-w-lg">
                Редкие исторические документы, атласы и мемуары очевидцев — свидетельства
                великой эпохи Кавказской войны и освоения региона.
              </p>
              <Link
                href="/catalog"
                className="inline-flex items-center justify-center h-12 px-8 rounded-xl text-base font-medium bg-accent text-bg border border-accent hover:bg-accent2 shadow-accent-sm hover:shadow-accent transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent3"
              >
                Перейти в каталог
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </main>
  )
})

HomePage.displayName = 'HomePage'
