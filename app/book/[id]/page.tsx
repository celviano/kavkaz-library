import type { Metadata } from 'next'
import { BookPage } from '@/pages/book'
import { fetchBookById } from '@/shared/lib/supabase/queries/books'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const book = await fetchBookById(id)
  if (!book) return { title: 'Книга не найдена' }
  return {
    title: `${book.title} — ${book.author}`,
    description: book.description,
  }
}

export default async function Page({ params }: Props) {
  const { id } = await params
  return <BookPage bookId={id} />
}
