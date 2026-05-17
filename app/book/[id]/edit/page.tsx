import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { EditBookForm } from '@/pages/book-edit'
import { fetchBookById } from '@/shared/lib/supabase/queries/books'
import { fetchEbookById } from '@/shared/lib/supabase/queries/ebooks'
import { createClient } from '@/shared/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Редактирование книги',
  robots: { index: false },
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profileRow } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const book = await fetchBookById(id)
  if (!book) redirect('/catalog')

  const isOwner = book.ownerId === user.id
  const isAdmin = profileRow?.role === 'admin'

  if (!isAdmin && !isOwner) redirect(`/book/${id}`)

  const ebook = book.bookType === 'ebook' ? await fetchEbookById(id) : null

  return <EditBookForm book={book} ebook={ebook} />
}
