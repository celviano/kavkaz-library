import type { Metadata } from 'next'
import { BookPage } from '@/pages/book'
import { fetchBookById } from '@/shared/lib/supabase/queries/books'
import { JsonLd } from '@/shared/ui/JsonLd'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://caucasuslibrary.ru'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const book = await fetchBookById(id)
  if (!book) return { title: 'Книга не найдена' }

  const ogImage = book.coverUrl
    ? { url: book.coverUrl, width: 800, height: 600, alt: book.title }
    : { url: '/og-image.png', width: 1200, height: 630, alt: 'CaucasusLibrary' }

  return {
    title:       `${book.title} — ${book.author}`,
    description: book.description ?? undefined,
    openGraph: {
      type:        'book',
      title:       `${book.title} — ${book.author}`,
      description: book.description ?? '',
      url:         `${BASE_URL}/book/${id}`,
      images:      [ogImage],
    },
    twitter: {
      card:        'summary_large_image',
      title:       `${book.title} — ${book.author}`,
      description: book.description ?? '',
      images:      [ogImage.url],
    },
  }
}

export default async function Page({ params }: Props) {
  const { id } = await params
  const book = await fetchBookById(id)

  return (
    <>
      {book && (
        <JsonLd
          data={{
            '@context':   'https://schema.org',
            '@type':      'Book',
            name:         book.title,
            author:       { '@type': 'Person', name: book.author },
            description:  book.description ?? undefined,
            image:        book.coverUrl ?? undefined,
            datePublished: book.year?.toString() ?? undefined,
            inLanguage:   book.language ?? undefined,
            url:          `${BASE_URL}/book/${id}`,
            offers: book.price != null
              ? {
                  '@type':       'Offer',
                  price:         book.price,
                  priceCurrency: book.currency ?? 'RUB',
                  availability:  'https://schema.org/InStock',
                }
              : undefined,
          }}
        />
      )}
      <BookPage bookId={id} />
    </>
  )
}
