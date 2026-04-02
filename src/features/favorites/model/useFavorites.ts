'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/shared/lib/supabase/queries/queryKeys'
import {
  fetchFavoriteIds,
  fetchFavoriteBooks,
  addFavorite,
  removeFavorite,
} from '@/shared/lib/supabase/queries/favorites'

export function useFavoriteIds(userId: string | null) {
  return useQuery({
    queryKey: queryKeys.favorites.ids(userId ?? ''),
    queryFn: () => fetchFavoriteIds(userId!),
    enabled: Boolean(userId),
    staleTime: 30 * 1000,
  })
}

export function useFavoriteBooks(userId: string | null) {
  return useQuery({
    queryKey: queryKeys.favorites.books(userId ?? ''),
    queryFn: () => fetchFavoriteBooks(userId!),
    enabled: Boolean(userId),
  })
}

export function useToggleFavorite(userId: string | null) {
  const queryClient = useQueryClient()
  const idsKey = queryKeys.favorites.ids(userId ?? '')
  const booksKey = queryKeys.favorites.books(userId ?? '')

  return useMutation({
    mutationFn: async ({ bookId, isFav }: { bookId: string; isFav: boolean }) => {
      if (!userId) throw new Error('Необходима авторизация')
      if (isFav) {
        await removeFavorite(userId, bookId)
      } else {
        await addFavorite(userId, bookId)
      }
    },

    // Optimistic update — мгновенная реакция UI
    onMutate: async ({ bookId, isFav }) => {
      await queryClient.cancelQueries({ queryKey: idsKey })
      const prev = queryClient.getQueryData<string[]>(idsKey) ?? []
      queryClient.setQueryData<string[]>(
        idsKey,
        isFav ? prev.filter((id) => id !== bookId) : [...prev, bookId],
      )
      return { prev }
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(idsKey, ctx.prev)
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: idsKey })
      queryClient.invalidateQueries({ queryKey: booksKey })
    },
  })
}
