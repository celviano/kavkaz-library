import { memo } from 'react'
import { BookCard } from '@/entities/book'
import type { Book } from '@/entities/book'

interface BookGridProps {
  books: Book[]
  className?: string
}

export const BookGrid = memo<BookGridProps>(({ books, className }) => {
  if (books.length === 0) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex flex-col items-center justify-center py-28 text-center gap-4"
      >
        <svg width="48" height="38" viewBox="0 0 48 38" fill="none" className="opacity-20">
          <path d="M6 34L20 6L34 34H6Z" fill="var(--color-accent)" />
          <path d="M24 34L35 12L46 34H24Z" fill="var(--color-accent)" opacity="0.5" />
        </svg>
        <p className="text-ash font-medium">Книги не найдены</p>
        <p className="text-dim text-sm">Попробуйте изменить фильтры или поисковый запрос</p>
      </div>
    )
  }

  return (
    <ul
      className={`grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 ${className ?? ''}`}
      aria-label={`Список книг: ${books.length} шт.`}
    >
      {books.map((book) => (
        <li key={book.id} className="h-full">
          <BookCard book={book} className="h-full" />
        </li>
      ))}
    </ul>
  )
})

BookGrid.displayName = 'BookGrid'
