'use client'

import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/shared/lib/supabase/queries/queryKeys'
import { fetchBooks, fetchFeaturedBooks, fetchBookById, fetchSimilarBooks } from '@/shared/lib/supabase/queries/books'
import type { BookCategory } from './types'

export function useBooks(params: {
  category?: BookCategory | 'all'
  search?: string
  page?: number
  pageSize?: number
} = {}) {
  return useQuery({
    queryKey: queryKeys.books.list(params),
    queryFn: () => fetchBooks(params),
  })
}

export function useFeaturedBooks() {
  return useQuery({
    queryKey: queryKeys.books.featured,
    queryFn: fetchFeaturedBooks,
  })
}

export function useBook(id: string) {
  return useQuery({
    queryKey: queryKeys.books.detail(id),
    queryFn: () => fetchBookById(id),
    enabled: Boolean(id),
  })
}

export function useSimilarBooks(bookId: string, category: BookCategory) {
  return useQuery({
    queryKey: queryKeys.books.similar(bookId, category),
    queryFn: () => fetchSimilarBooks(bookId, category),
    enabled: Boolean(bookId),
  })
}

export function useCategoryCounts() {
  return useQuery({
    queryKey: ['books', 'category-counts'],
    queryFn: () => import('@/shared/lib/supabase/queries/books').then(m => m.fetchCategoryCounts()),
    staleTime: 5 * 60 * 1000,
  })
}
