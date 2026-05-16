import type { Book, BookCategory, BookRow, BookStatus } from '@/entities/book/model/types'
import { mapBookRow } from '@/entities/book/model/types'
import { createClient } from '@/shared/lib/supabase/client'

export interface BooksQueryParams {
  category?: BookCategory | 'all'
  search?: string
  page?: number
  pageSize?: number
  bookType?: 'physical' | 'ebook'
}

export interface BooksQueryResult {
  books: Book[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export async function fetchBooksCount(): Promise<number> {
  const supabase = createClient()
  const { count, error } = await supabase
    .from('books')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active')
  if (error) throw new Error(error.message)
  return count ?? 0
}

// Public catalog — only active books
export async function fetchBooks(
  params: BooksQueryParams = {},
): Promise<BooksQueryResult> {
  const supabase = createClient()
  const { category, search, page = 1, pageSize = 12, bookType } = params
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = supabase
    .from('books')
    .select('*', { count: 'exact' })
    .eq('status', 'active')
    .order('year', { ascending: false })
    .range(from, to)

  if (category && category !== 'all') {
    query = query.eq('category', category)
  }
  if (search && search.trim().length > 0) {
    query = query.or(`title.ilike.%${search.trim()}%,author.ilike.%${search.trim()}%`)
  }
  if (bookType === 'physical') {
    query = query.or('book_type.eq.physical,book_type.is.null')
  }
  if (bookType === 'ebook') {
    query = query.eq('book_type', 'ebook')
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
  const { data, error } = await supabase.from('books').select('*').eq('id', id).single()

  if (error) return null
  return mapBookRow(data as BookRow)
}

export async function fetchFeaturedBooks(): Promise<Book[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .eq('is_featured', true)
    .eq('status', 'active')
    .order('year', { ascending: false })
    .limit(4)

  if (error) throw new Error(error.message)
  return (data as BookRow[]).map(mapBookRow)
}

export async function fetchSimilarBooks(
  bookId: string,
  category: BookCategory,
): Promise<Book[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .eq('category', category)
    .eq('status', 'active')
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
    .eq('status', 'active')

  if (error) throw new Error(error.message)
  const counts: Record<string, number> = {}
  for (const row of data as { category: string }[]) {
    counts[row.category] = (counts[row.category] ?? 0) + 1
  }
  return counts
}

// Dashboard — owner's own books (all statuses)
export async function fetchMyBooks(ownerId: string): Promise<Book[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .eq('owner_id', ownerId)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return (data as BookRow[]).map(mapBookRow)
}

// Admin — all pending books for moderation
export async function fetchPendingBooks(): Promise<Book[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: true })

  if (error) throw new Error(error.message)
  return (data as BookRow[]).map(mapBookRow)
}

// Change book status (owner or admin)
export async function updateBookStatus(
  bookId: string,
  status: BookStatus,
): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.from('books').update({ status }).eq('id', bookId)

  if (error) throw new Error(error.message)
}

function extractStoragePath(url: string, bucket: string): string | null {
  const marker = `/object/public/${bucket}/`
  const idx = url.indexOf(marker)
  if (idx === -1) return null
  return url.slice(idx + marker.length)
}

// Hard-delete a book and its storage files
export async function deleteBook(
  bookId: string,
  opts: { coverUrl?: string | null; images?: string[] | null; ebookFileUrl?: string | null },
): Promise<void> {
  const supabase = createClient()

  if (opts.coverUrl) {
    const path = extractStoragePath(opts.coverUrl, 'book-covers')
    if (path) await supabase.storage.from('book-covers').remove([path])
  }

  if (opts.images && opts.images.length > 0) {
    const paths = opts.images
      .map((u) => extractStoragePath(u, 'book-images'))
      .filter(Boolean) as string[]
    if (paths.length > 0) await supabase.storage.from('book-images').remove(paths)
  }

  if (opts.ebookFileUrl) {
    const path = extractStoragePath(opts.ebookFileUrl, 'ebooks')
    if (path) await supabase.storage.from('ebooks').remove([path])
  }

  const { error } = await supabase.from('books').delete().eq('id', bookId)
  if (error) throw new Error(error.message)
}

// Public seller page — only active books by owner
export async function fetchSellerBooks(ownerId: string): Promise<Book[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .eq('owner_id', ownerId)
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return (data as BookRow[]).map(mapBookRow)
}
