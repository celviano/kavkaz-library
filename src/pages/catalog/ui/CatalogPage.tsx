'use client'

import { memo, useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Container } from '@/shared/ui/Container'
import { PageHeading } from '@/shared/ui/PageHeading'
import { Pagination } from '@/shared/ui/Pagination'
import { BookGrid } from '@/widgets/book-grid'
import { BookSearch } from '@/features/book-search'
import { BookFilter } from '@/features/book-filter'
import { BookCardSkeleton } from '@/shared/ui/Skeleton'
import { useBooks } from '@/entities/book'
import type { BookCategory } from '@/entities/book'

const PAGE_SIZE = 12

export const CatalogPage = memo(() => {
  const searchParams = useSearchParams()

  // Read state from URL
  const pageParam     = searchParams?.get('page')
  const categoryParam = searchParams?.get('category') as BookCategory | null
  const searchParam   = searchParams?.get('q') ?? ''

  const [search,   setSearch]   = useState(searchParam)
  const [category, setCategory] = useState<BookCategory | 'all'>(categoryParam ?? 'all')
  const [page,     setPage]     = useState(parseInt(pageParam ?? '1', 10))

  // Sync URL → state when searchParams change (browser back/forward)
  useEffect(() => {
    setSearch(searchParams?.get('q') ?? '')
    setCategory((searchParams?.get('category') as BookCategory | null) ?? 'all')
    setPage(parseInt(searchParams?.get('page') ?? '1', 10))
  }, [searchParams])

  // Reset to page 1 when filter/search changes
  function handleSearchChange(value: string) {
    setSearch(value)
    setPage(1)
  }

  function handleCategoryChange(value: BookCategory | 'all') {
    setCategory(value)
    setPage(1)
  }

  const { data, isLoading, error } = useBooks({
    category,
    search,
    page,
    pageSize: PAGE_SIZE,
  })

  const books      = data?.books      ?? []
  const total      = data?.total      ?? 0
  const totalPages = data?.totalPages ?? 1

  return (
    <main id="main-content">
      <section aria-labelledby="catalog-heading" className="py-12">
        <Container>
          <div className="flex flex-col gap-8">

            <PageHeading
              eyebrow="Каталог"
              title="Каталог книг"
              subtitle={!isLoading ? `${total} изданий о Кавказе и народах Закавказья` : undefined}
              id="catalog-heading"
            />

            <div className="flex flex-col gap-4">
              <BookSearch value={search} onChange={handleSearchChange} />
              <BookFilter selected={category} onChange={handleCategoryChange} />
            </div>

            <p
              className="text-sm text-ash -mt-2"
              role="status"
              aria-live="polite"
              aria-atomic="true"
            >
              {isLoading ? 'Загрузка...' : (
                books.length === total
                  ? `Показано все ${books.length} книг`
                  : `Показано ${books.length} из ${total}`
              )}
            </p>

            {isLoading && (
              <div className="grid gap-5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {Array.from({ length: PAGE_SIZE }).map((_, i) => <BookCardSkeleton key={i} />)}
              </div>
            )}

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-600">
                Не удалось загрузить книги. Попробуйте обновить страницу.
              </div>
            )}

            {!isLoading && !error && <BookGrid books={books} />}

            {!isLoading && totalPages > 1 && (
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                className="mt-4"
              />
            )}

          </div>
        </Container>
      </section>
    </main>
  )
})

CatalogPage.displayName = 'CatalogPage'
