'use client'

import { memo } from 'react'
import Link from 'next/link'
import { Container } from '@/shared/ui/Container'
import { SectionHeading } from '@/shared/ui/SectionHeading'
import { BookCardSkeleton } from '@/shared/ui/Skeleton'
import { BookGrid } from '@/widgets/book-grid'
import { useFeaturedBooks } from '@/entities/book'

export const FeaturedBooks = memo(() => {
  const { data: books = [], isLoading } = useFeaturedBooks()

  return (
    <section aria-labelledby="featured-heading" className="py-20 border-t border-surface2">
      <Container>
        <div className="flex items-end justify-between mb-10">
          <SectionHeading eyebrow="Рекомендуем" title="Избранные книги" id="featured-heading" />
          <Link
            href="/catalog"
            className="text-sm text-ash hover:text-ink transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent rounded hidden sm:inline-flex items-center gap-1"
          >
            Весь каталог <span aria-hidden="true">→</span>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid gap-5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => <BookCardSkeleton key={i} />)}
          </div>
        ) : (
          <BookGrid books={books} />
        )}

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
  )
})

FeaturedBooks.displayName = 'FeaturedBooks'
