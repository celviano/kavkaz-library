import type { Book } from '@/entities/book'

interface BookDescriptionProps {
  book: Book
}

export function BookDescription({ book }: BookDescriptionProps) {
  if (!book.description && book.tags.length === 0) return null

  return (
    <>
      {book.description && (
        <div>
          <p className="text-[11px] font-medium tracking-[2px] uppercase text-accent mb-3">
            О книге
          </p>
          <p className="text-ash text-base leading-relaxed">{book.description}</p>
        </div>
      )}

      {book.tags.length > 0 && (
        <div>
          <p className="text-[11px] font-medium tracking-[2px] uppercase text-accent mb-3">
            Темы
          </p>
          <div className="flex flex-wrap gap-2">
            {book.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1.5 rounded-full text-xs border border-surface2 bg-bg text-ash"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
