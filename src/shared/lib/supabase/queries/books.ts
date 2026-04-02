import { createClient } from '@/shared/lib/supabase/client'
import { mapBookRow } from '@/entities/book/model/types'
import type { BookRow, Book, BookCategory } from '@/entities/book/model/types'

export interface BooksQueryParams {
  category?: BookCategory | 'all'
  search?: string
  page?: number
  pageSize?: number
}

export interface BooksQueryResult {
  books: Book[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export async function fetchBooks(params: BooksQueryParams = {}): Promise<BooksQueryResult> {
  const supabase = createClient()
  const { category, search, page = 1, pageSize = 12 } = params
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = supabase
    .from('books')
    .select('*', { count: 'exact' })
    .order('year', { ascending: false })
    .range(from, to)

  if (category && category !== 'all') {
    query = query.eq('category', category)
  }

  if (search && search.trim().length > 0) {
    query = query.or(
      `title.ilike.%${search.trim()}%,author.ilike.%${search.trim()}%`,
    )
  }

  const { data, error, count } = await query

  if (error) throw new Error(error.message)

  const total = count ?? 0
  return {
    books: (data as BookRow[]).map(mapBookRow),
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  }
}

export async function fetchBookById(id: string): Promise<Book | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null
  return mapBookRow(data as BookRow)
}

export async function fetchFeaturedBooks(): Promise<Book[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .eq('is_featured', true)
    .order('year', { ascending: false })
    .limit(4)

  if (error) throw new Error(error.message)
  return (data as BookRow[]).map(mapBookRow)
}

export async function fetchSimilarBooks(bookId: string, category: BookCategory): Promise<Book[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .eq('category', category)
    .neq('id', bookId)
    .limit(4)

  if (error) throw new Error(error.message)
  return (data as BookRow[]).map(mapBookRow)
}

export async function fetchCategoryCounts(): Promise<Record<string, number>> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('books')
    .select('category')

  if (error) throw new Error(error.message)

  const counts: Record<string, number> = {}
  for (const row of data as { category: string }[]) {
    counts[row.category] = (counts[row.category] ?? 0) + 1
  }
  return counts
}
