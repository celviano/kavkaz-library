'use client'

import { BookOpen } from 'lucide-react'
import { type FC } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { EmptyState } from '@/shared/ui/EmptyState'
import type { Book } from '@/entities/book'

interface SellerBooksPreviewProps {
  books: Book[]
}

export const SellerBooksPreview: FC<SellerBooksPreviewProps> = ({ books }) => {
  const active = books.filter((b) => b.status === 'active').slice(0, 3)

  return (
    <section aria-labelledby="seller-books-heading">
      <div className="flex items-end justify-between mb-4">
        <div>
          <p className="text-[11px] font-medium tracking-[2px] uppercase text-accent mb-1">Витрина</p>
          <h2
            id="seller-books-heading"
            className="font-display font-semibold text-ink"
            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.2rem, 2vw, 1.5rem)' }}
          >
            Книги в продаже
          </h2>
        </div>
        <Link
          href="/dashboard"
          className="text-sm text-ash hover:text-ink transition-colors inline-flex items-center gap-1 group"
        >
          Кабинет
          <span className="group-hover:translate-x-0.5 transition-transform" aria-hidden="true">→</span>
        </Link>
      </div>

      {active.length === 0 ? (
        <EmptyState
          title="Нет активных книг"
          description="Добавьте книгу чтобы она появилась в каталоге"
          actionLabel="Добавить книгу"
          actionHref="/add-book"
        />
      ) : (
        <div className="grid grid-cols-3 gap-3">
          {active.map((book) => (
            <Link key={book.id} href={`/book/${book.id}`} className="group">
              <div className="bg-surface border border-surface2 rounded-2xl overflow-hidden hover:border-accent/30 transition-colors">
                <div className="aspect-[3/4] bg-surface2 relative overflow-hidden">
                  {book.coverUrl ? (
                    <Image
                      src={book.coverUrl}
                      alt={book.title}
                      fill
                      sizes="(max-width: 768px) 33vw, 200px"
                      className="object-cover group-hover:scale-[1.03] transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen size={24} strokeWidth={1.5} className="text-dim"/>
                    </div>
                  )}
                </div>
                <div className="px-3 py-2.5">
                  <p className="text-xs font-medium text-ink line-clamp-2 leading-snug mb-1">{book.title}</p>
                  {book.price != null && (
                    <p className="text-xs font-semibold text-accent">
                      {new Intl.NumberFormat('ru-RU', { style: 'currency', currency: book.currency, maximumFractionDigits: 0 }).format(book.price)}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}
