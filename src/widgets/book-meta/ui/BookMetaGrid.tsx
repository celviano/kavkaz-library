import { type FC } from 'react'
import type { Book } from '@/entities/book'

interface MetaCell {
  label: string
  value: string
  accent?: boolean
}

interface BookMetaGridProps {
  book: Book
}

export const BookMetaGrid: FC<BookMetaGridProps> = ({ book }) => {
  const cells: MetaCell[] = [
    { label: 'Год издания',   value: String(book.year) },
    { label: 'Страниц',       value: book.pages ? String(book.pages) : '—' },
    { label: 'Язык',          value: book.language },
    { label: 'Издательство',  value: book.publisherName ?? '—' },
    { label: 'Место издания', value: book.publisherCity ?? '—' },
    { label: 'Состояние',     value: book.available ? 'Доступна' : 'Недоступна', accent: book.available },
  ]

  return (
    <div>
      <p className="text-[11px] font-medium tracking-[2px] uppercase text-accent mb-3">
        Сведения об издании
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-px bg-surface2 rounded-2xl overflow-hidden">
        {cells.map(({ label, value, accent }) => (
          <div key={label} className="bg-bg px-4 py-3.5 flex flex-col gap-1">
            <span className="text-[10px] text-dim uppercase tracking-wider">{label}</span>
            <span className={`text-sm font-medium ${accent ? 'text-accent' : 'text-ink'}`}>
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
