'use client'

import type { BookStatus } from '@/entities/book/model/types'
import { fetchMyBooks, updateBookStatus } from '@/shared/lib/supabase/queries/books'
import type { OrderStatus } from '@/shared/lib/supabase/queries/orders'
import {
  fetchMyOrders,
  fetchSentOrders,
  updateOrderStatus,
} from '@/shared/lib/supabase/queries/orders'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export function useMyBooks(ownerId: string | null) {
  return useQuery({
    queryKey: ['dashboard', 'books', ownerId],
    queryFn: () => fetchMyBooks(ownerId!),
    enabled: Boolean(ownerId),
  })
}

export function useMyOrders(sellerId: string | null) {
  return useQuery({
    queryKey: ['dashboard', 'orders', sellerId],
    queryFn: () => fetchMyOrders(sellerId!),
    enabled: Boolean(sellerId),
  })
}

export function useUpdateBookStatus(ownerId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ bookId, status }: { bookId: string; status: BookStatus }) =>
      updateBookStatus(bookId, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['dashboard', 'books', ownerId] })
    },
  })
}

export function useUpdateOrderStatus(sellerId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: OrderStatus }) =>
      updateOrderStatus(orderId, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['dashboard', 'orders', sellerId] })
    },
  })
}

export function useSentOrders(buyerId: string | null) {
  return useQuery({
    queryKey: ['sent-orders', buyerId],
    queryFn: () => fetchSentOrders(buyerId!),
    enabled: Boolean(buyerId),
  })
}
