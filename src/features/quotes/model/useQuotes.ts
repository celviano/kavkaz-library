'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchDailyQuote,
  fetchMyQuotes,
  fetchAllQuotes,
  fetchPendingQuotes,
  submitQuote,
  updateQuoteStatus,
} from '@/shared/lib/supabase/queries/quotes'

// Цитата дня для главной страницы
export function useDailyQuote() {
  return useQuery({
    queryKey: ['quotes', 'daily'],
    queryFn:  fetchDailyQuote,
    staleTime: 1000 * 60 * 60, // 1 час
  })
}

// Мои цитаты (кабинет пользователя)
export function useMyQuotes(userId: string | null) {
  return useQuery({
    queryKey: ['quotes', 'my', userId],
    queryFn:  () => fetchMyQuotes(userId!),
    enabled:  Boolean(userId),
  })
}

// Все цитаты (для админа)
export function useAllQuotes() {
  return useQuery({
    queryKey: ['quotes', 'all'],
    queryFn:  fetchAllQuotes,
  })
}

// Цитаты на модерации (для админа)
export function usePendingQuotes() {
  return useQuery({
    queryKey: ['quotes', 'pending'],
    queryFn:  fetchPendingQuotes,
  })
}

// Добавить цитату
export function useSubmitQuote(userId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (params: { text: string; author: string; source: string }) =>
      submitQuote({ ...params, userId }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['quotes', 'my', userId] })
    },
  })
}

// Изменить статус цитаты (апрув / отклонение)
export function useUpdateQuoteStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ quoteId, status }: { quoteId: string; status: 'approved' | 'rejected' }) =>
      updateQuoteStatus(quoteId, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['quotes'] })
    },
  })
}
