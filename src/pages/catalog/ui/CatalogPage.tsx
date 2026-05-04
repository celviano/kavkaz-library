'use client'

import { memo, useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Container } from '@/shared/ui/Container'
import { PageHeading } from '@/shared/ui/PageHeading'
import { Pagination } from '@/shared/ui/Pagination'
import { BookGrid } from '@/widgets/book-grid'
import { BookSearch } from '@/features/book-search'
import { BookFilter } from '@/features/book-filter'
import { EbookTypeFilter } from '@/features/book-filter/ui/EbookTypeFilter'
import { BookCardSkeleton } from '@/shared/ui/Skeleton'
import { useBooks } from '@/entities/book'
import type { BookCategory } from '@/entities/book'
import type { BookTypeFilter } from '@/features/book-filter/ui/EbookTypeFilter'

const PAGE_SIZE = 12

export const CatalogPage = memo(() => {
  const searchParams = useSearchParams()

  const pageParam     = searchParams?.get('page')
  const categoryParam = searchParams?.get('category') as BookCategory | null
  const searchParam   = searchParams?.get('q') ?? ''
  const typeParam     = searchParams?.get('type') as BookTypeFilter | null

  const [search,    setSearch]    = useState(searchParam)
  const [category,  setCategory]  = useState<BookCategory | 'all'>(categoryParam ?? 'all')
  const [page,      setPage]      = useState(parseInt(pageParam ?? '1', 10))
  const [bookType,  setBookType]  = useState<BookTypeFilter>(typeParam ?? 'all')

  useEffect(() => {
    setSearch(searchParams?.get('q') ?? '')
    setCategory((searchParams?.get('category') as BookCategory | null) ?? 'all')
    setPage(parseInt(searchParams?.get('page') ?? '1', 10))
    setBookType((searchParams?.get('type') as BookTypeFilter | null) ?? 'all')
  }, [searchParams])

  function handleSearchChange(value: string)          { setSearch(value);   setPage(1) }
  function handleCategoryChange(value: BookCategory | 'all') { setCategory(value); setPage(1) }
  function handleTypeChange(value: BookTypeFilter)    { setBookType(value); setPage(1) }

  const { data, isLoading, error } = useBooks({
    category,
    search,
    page,
    pageSize: PAGE_SIZE,
    bookType: bookType === 'all' ? undefined : bookType,
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

            <div className="flex flex-col gap-3">
              <BookSearch value={search} onChange={handleSearchChange} />
              {/* Фильтр типа — над категориями */}
              <EbookTypeFilter value={bookType} onChange={handleTypeChange} />
              <BookFilter selected={category} onChange={handleCategoryChange} />
            </div>

            <p className="text-sm text-ash -mt-2" role="status" aria-live="polite" aria-atomic="true">
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
              <Pagination currentPage={page} totalPages={totalPages} className="mt-4" />
            )}

          </div>
        </Container>
      </section>
    </main>
  )
})

CatalogPage.displayName = 'CatalogPage'
