import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/shared/lib/supabase/server'
import { AddBookForm } from '@/features/add-book'

export const metadata: Metadata = { title: 'Добавить книгу', robots: { index: false } }

interface PageProps {
  searchParams: Promise<{ type?: string }>
}

export default async function Page(props: PageProps) {
  const searchParams = await props.searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const initialBookType = (searchParams.type === 'ebook' || searchParams.type === 'physical') 
    ? searchParams.type 
    : 'physical'

  return <AddBookForm initialBookType={initialBookType} />
}
