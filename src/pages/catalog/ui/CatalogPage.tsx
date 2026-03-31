'use client'

import { memo, useState, useMemo } from 'react'
import { BookGrid } from '@/widgets/book-grid'
import { BookSearch } from '@/features/book-search'
import { BookFilter } from '@/features/book-filter'
import { Container } from '@/shared/ui/Container'
import { MOCK_BOOKS } from '@/shared/config/constants'
import type { BookCategory } from '@/entities/book'

export const CatalogPage = memo(() => {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<BookCategory | 'all'>('all')

  const filteredBooks = useMemo(() => {
    return MOCK_BOOKS.filter((book) => {
      const matchesCategory = category === 'all' || book.category === category
      const q = search.toLowerCase().trim()
      const matchesSearch =
        q === '' ||
        book.title.toLowerCase().includes(q) ||
        book.author.toLowerCase().includes(q)
      return matchesCategory && matchesSearch
    })
  }, [search, category])

  return (
    <main id="main-content">
      <section aria-labelledby="catalog-heading" className="py-14">
        <Container>
          {/* Page header */}
          <div className="mb-10">
            <p className="text-[11px] font-medium tracking-[2px] uppercase text-accent mb-2">
              Каталог
            </p>
            <h1
              id="catalog-heading"
              className="font-display font-semibold text-ink leading-tight mb-2"
              style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)' }}
            >
              Все книги
            </h1>
            <p className="text-ash text-base">
              {MOCK_BOOKS.length} изданий по истории Кавказа и Закавказья
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-col gap-4 mb-6">
            <BookSearch value={search} onChange={setSearch} />
            <BookFilter selected={category} onChange={setCategory} />
          </div>

          {/* Results count */}
          <p
            className="text-sm text-ash mb-8"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            {filteredBooks.length === MOCK_BOOKS.length
              ? `Показано все ${filteredBooks.length} книг`
              : `Найдено: ${filteredBooks.length} из ${MOCK_BOOKS.length}`}
          </p>

          {/* Grid */}
          <BookGrid books={filteredBooks} />
        </Container>
      </section>
    </main>
  )
})

CatalogPage.displayName = 'CatalogPage'
