'use client'

import { memo, useState, useMemo } from 'react'
import { BookGrid } from '@/widgets/book-grid'
import { BookSearch } from '@/features/book-search'
import { BookFilter } from '@/features/book-filter'
import { Container } from '@/shared/ui/Container'
import { useBooks } from '@/entities/book'
import type { BookCategory } from '@/entities/book'

export const CatalogPage = memo(() => {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<BookCategory | 'all'>('all')

  const { data, isLoading, error } = useBooks({ category, search })
  const books = data?.books ?? []

  return (
    <main id="main-content">
      <section aria-labelledby="catalog-heading" className="py-12">
        <Container>
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-1">
              <p className="text-[11px] font-medium tracking-[2px] uppercase text-accent">
                Каталог
              </p>
              <h1
                id="catalog-heading"
                className="font-display font-semibold text-ink leading-tight"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2rem, 4vw, 3rem)',
                }}
              >
                Все книги
              </h1>
              {!isLoading && (
                <p className="text-ash text-base mt-1">
                  {data?.total ?? 0} изданий по истории Кавказа и Закавказья
                </p>
              )}
            </div>

            <div className="flex flex-col gap-4">
              <BookSearch value={search} onChange={setSearch} />
              <BookFilter selected={category} onChange={setCategory} />
            </div>

            {isLoading && (
              <div className="grid gap-5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-2xl bg-surface border border-surface2 overflow-hidden animate-pulse"
                  >
                    <div className="aspect-[3/4] bg-surface2" />
                    <div className="p-4 flex flex-col gap-2">
                      <div className="h-4 bg-surface2 rounded-full w-1/2" />
                      <div className="h-3 bg-surface2 rounded-full w-3/4" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-600">
                Не удалось загрузить книги. Попробуйте обновить страницу.
              </div>
            )}

            {!isLoading && !error && (
              <>
                <p className="text-sm text-ash -mt-2" role="status" aria-live="polite">
                  {books.length === (data?.total ?? 0)
                    ? `Показано все ${books.length} книг`
                    : `Найдено: ${books.length} из ${data?.total ?? 0}`}
                </p>
                <BookGrid books={books} />
              </>
            )}
          </div>
        </Container>
      </section>
    </main>
  )
})

CatalogPage.displayName = 'CatalogPage'
