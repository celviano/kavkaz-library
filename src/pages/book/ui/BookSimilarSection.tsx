import Link from 'next/link'
import { BookGrid } from '@/widgets/book-grid'
import type { Book } from '@/entities/book'

interface BookSimilarSectionProps {
  category: string
  books: Book[]
}

export function BookSimilarSection({ category, books }: BookSimilarSectionProps) {
  if (books.length === 0) return null

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
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.4rem, 2.5vw, 1.9rem)',
            }}
          >
            Похожие книги
          </h2>
        </div>
        <Link
          href={`/catalog?category=${category}`}
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
      <BookGrid books={books} />
    </section>
  )
}
