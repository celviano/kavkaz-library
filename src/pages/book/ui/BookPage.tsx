'use client'

import { memo } from 'react'
import { Container } from '@/shared/ui/Container'
import { Breadcrumb } from '@/shared/ui/Breadcrumb'
import { BookSlider } from '@/widgets/book-slider'
import { BookMetaGrid } from '@/widgets/book-meta'
import { CATEGORY_LABELS } from '@/shared/config/constants'
import { useBook, useSimilarBooks } from '@/entities/book'
import { BookPageSkeleton } from './BookPageSkeleton'
import { BookPageError } from './BookPageError'
import { BookHeader } from './BookHeader'
import { BookDescription } from './BookDescription'
import { BookSellerSection } from './BookSellerSection'
import { BookSimilarSection } from './BookSimilarSection'

interface BookPageProps {
  bookId: string
}

export const BookPage = memo<BookPageProps>(({ bookId }) => {
  const { data: book, isLoading, error } = useBook(bookId)
  const { data: similar = [] } = useSimilarBooks(bookId, book?.category ?? 'history')

  if (isLoading) return <BookPageSkeleton />
  if (error || !book) return <BookPageError />

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
              <BookHeader book={book} />
              <hr className="border-surface2" />
              <BookMetaGrid book={book} />
              <BookDescription book={book} />
              <hr className="border-surface2" />
              <BookSellerSection book={book} />
            </div>
          </div>

          <BookSimilarSection category={book.category} books={similar} />
        </Container>
      </section>
    </main>
  )
})

BookPage.displayName = 'BookPage'
