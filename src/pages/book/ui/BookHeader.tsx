import { Badge } from '@/shared/ui/Badge'
import { EbookBadge } from '@/shared/ui/EbookBadge'
import { FavoriteButton } from '@/features/favorites'
import { CATEGORY_LABELS } from '@/shared/config/constants'
import type { Book } from '@/entities/book'
import type { EbookFormat } from '@/entities/ebook/model/types'

interface BookHeaderProps {
  book: Book
}

export function BookHeader({ book }: BookHeaderProps) {
  const categoryLabel = CATEGORY_LABELS[book.category]

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge category={book.category} label={categoryLabel} />
          {book.bookType === 'ebook' && (
            <EbookBadge format={(book.ebookFormat as EbookFormat) ?? undefined} />
          )}
        </div>
        <FavoriteButton bookId={book.id} />
      </div>

      <h1
        className="font-display font-semibold text-ink leading-tight"
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.7rem, 3.5vw, 2.5rem)',
        }}
      >
        {book.title}
      </h1>

      <p
        className="font-display italic text-ash"
        style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem' }}
      >
        {book.author}
      </p>
    </div>
  )
}
