import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { BookPage } from '@/pages/book'
import { MOCK_BOOKS } from '@/shared/config/constants'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const book = MOCK_BOOKS.find((b) => b.id === id)
  if (!book) return { title: 'Книга не найдена' }
  return {
    title: `${book.title} — ${book.author}`,
    description: book.description,
  }
}

export function generateStaticParams() {
  return MOCK_BOOKS.map((b) => ({ id: b.id }))
}

export default async function Page({ params }: Props) {
  const { id } = await params
  const book = MOCK_BOOKS.find((b) => b.id === id)
  if (!book) notFound()
  return <BookPage bookId={id} />
}
