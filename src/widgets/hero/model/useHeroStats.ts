'use client'

import { CATEGORIES } from '@/shared/config/constants'
import { fetchBooksCount } from '@/shared/lib/supabase/queries/books'
import { fetchUserCount } from '@/shared/lib/supabase/queries/profiles'
import { useQuery } from '@tanstack/react-query'

export function useHeroStats() {
  const { data: bookCount } = useQuery({
    queryKey: ['hero', 'book-count'],
    queryFn: fetchBooksCount,
    staleTime: 5 * 60 * 1000,
  })

  const { data: userCount } = useQuery({
    queryKey: ['hero', 'user-count'],
    queryFn: fetchUserCount,
    staleTime: 5 * 60 * 1000,
  })

  return {
    bookCount: bookCount ?? null,
    categoryCount: CATEGORIES.length,
    userCount: userCount ?? null,
  }
}
