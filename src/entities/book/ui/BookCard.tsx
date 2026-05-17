'use client'

import { memo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { FavoriteButton } from '@/features/favorites'
import { CATEGORY_LABELS } from '@/shared/config/constants'
import { cn } from '@/shared/lib/cn'
import { Badge } from '@/shared/ui/Badge'
import { EbookBadge } from '@/shared/ui/EbookBadge'

import type { Book } from '../model/types'

interface BookCardProps {
  book: Book
  className?: string
}

function AvailabilityBadge({ book }: { book: Book }) {
  const inStock = book.available && book.copiesLeft > 0 && Boolean(book.ownerId)

  if (inStock) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-accent/10 text-accent border border-accent/20">
        <span
          className="w-1.5 h-1.5 rounded-full bg-accent shrink-0"
          aria-hidden="true"
        />
        В наличии
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-surface2 text-dim border border-surface3">
      <span
        className="w-1.5 h-1.5 rounded-full bg-surface3 shrink-0"
        aria-hidden="true"
      />
      Нет в наличии
    </span>
  )
}

export const BookCard = memo<BookCardProps>(({ book, className }) => {
  const { id, title, author, year, category, coverUrl, pages, language } = book
  const [imgError, setImgError] = useState(false)
  const showImage = Boolean(coverUrl) && !imgError

  return (
    <Link
      href={`/book/${id}`}
      className={cn(
        'group relative flex flex-col h-full',
        'bg-surface rounded-2xl border border-surface2',
        'overflow-hidden',
        'transition-all duration-300',
        'hover:border-accent/30 hover:shadow-accent hover:-translate-y-1',
        'shadow-card',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
        className,
      )}
      aria-label={`${title} — ${author}, ${year} год`}
    >
      <div className="relative aspect-3/4 overflow-hidden bg-surface2">
        {showImage && (
          <Image
            src={coverUrl!}
            alt={`Обложка книги «${title}»`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 940px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04] z-10 relative"
            onError={() => setImgError(true)}
          />
        )}

        {!showImage && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center bg-surface2"
            aria-hidden="true"
          >
            <span
              className="font-display font-bold text-accent/[0.07] select-none leading-none absolute"
              style={{ fontFamily: 'var(--font-display)', fontSize: '5rem' }}
            >
              {year}
            </span>
            <svg
              width="36"
              height="28"
              viewBox="0 0 36 28"
              fill="none"
              className="opacity-[0.18]"
            >
              <path d="M4 26L13 6L22 26H4Z" fill="var(--color-accent)" />
              <path d="M16 26L24 10L32 26H16Z" fill="var(--color-accent)" opacity="0.5" />
              <path d="M13 6L16 12H10L13 6Z" fill="var(--color-bg)" opacity="0.6" />
            </svg>
          </div>
        )}

        <span className="absolute bottom-2.5 right-3 text-[10px] font-mono text-ash/80 z-20">
          {year}
        </span>

        <div className="absolute top-2.5 right-2.5 z-20">
          <FavoriteButton bookId={id} />
        </div>
      </div>

      <div className="flex flex-col gap-2.5 p-4 flex-1">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <Badge category={category} label={CATEGORY_LABELS[category]} />
          <div className="flex items-center gap-1.5">
            {book.bookType === 'ebook' && (
              <EbookBadge
                format={
                  (book.ebookFormat as import('@/entities/ebook/model/types').EbookFormat) ??
                  undefined
                }
              />
            )}
            {book.bookType !== 'ebook' && <AvailabilityBadge book={book} />}
          </div>
        </div>

        <h3
          className="text-ink text-sm font-medium leading-snug line-clamp-2 group-hover:text-accent transition-colors duration-200"
          style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem' }}
        >
          {title}
        </h3>

        <p className="text-ash text-xs leading-snug">{author}</p>

        <div className="mt-auto pt-3 flex items-center justify-between border-t border-surface2/60">
          <span className="text-[11px] text-dim">{year} г.</span>
          <div className="flex items-center gap-3">
            {pages > 0 && <span className="text-[11px] text-ash">{pages} стр.</span>}
            <span className="text-[11px] text-dim">{language}</span>
          </div>
        </div>
      </div>
    </Link>
  )
})

BookCard.displayName = 'BookCard'
