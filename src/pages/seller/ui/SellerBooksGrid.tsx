'use client'

import { memo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { EmptyState } from '@/shared/ui/EmptyState'
import { BookCardSkeleton } from '@/shared/ui/Skeleton'
import { BookGrid } from '@/widgets/book-grid'
import { fetchSellerBooks } from '@/shared/lib/supabase/queries/books'

interface SellerBooksGridProps {
  sellerId: string
}

export const SellerBooksGrid = memo<SellerBooksGridProps>(({ sellerId }) => {
  const { data: books = [], isLoading, error } = useQuery({
    queryKey: ['seller-books', sellerId],
    queryFn:  () => fetchSellerBooks(sellerId),
    staleTime: 60 * 1000,
  })

  if (isLoading) {
    return (
      <div className="grid gap-5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => <BookCardSkeleton key={i} />)}
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-600">
        Не удалось загрузить книги
      </div>
    )
  }

  if (books.length === 0) {
    return (
      <EmptyState
        title="Книг нет"
        description="Продавец пока не добавил ни одной книги"
        actionLabel="Перейти в каталог"
        actionHref="/catalog"
      />
    )
  }

  return <BookGrid books={books} />
})

SellerBooksGrid.displayName = 'SellerBooksGrid'
