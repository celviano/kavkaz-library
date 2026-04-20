import { createClient } from '@/shared/lib/supabase/client'
import { mapBookRow } from '@/entities/book/model/types'
import type { BookRow, Book } from '@/entities/book/model/types'

export async function fetchFavoriteIds(userId: string): Promise<string[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('favorites')
    .select('book_id')
    .eq('user_id', userId)

  if (error) throw new Error(error.message)
  return (data ?? []).map((r: { book_id: string }) => r.book_id)
}

export async function fetchFavoriteBooks(userId: string): Promise<Book[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('favorites')
    .select('books(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)

  return ((data ?? []) as unknown as { books: BookRow | null }[])
    .map((r) => r.books)
    .filter((b): b is BookRow => b !== null)
    .map(mapBookRow)
}

export async function addFavorite(userId: string, bookId: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase
    .from('favorites')
    .insert({ user_id: userId, book_id: bookId })

  if (error && error.code !== '23505') throw new Error(error.message)
}

export async function removeFavorite(userId: string, bookId: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('book_id', bookId)

  if (error) throw new Error(error.message)
}
