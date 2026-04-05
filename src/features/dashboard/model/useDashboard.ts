'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchMyBooks, updateBookStatus } from '@/shared/lib/supabase/queries/books'
import { fetchMyOrders, updateOrderStatus } from '@/shared/lib/supabase/queries/orders'
import type { BookStatus } from '@/entities/book/model/types'
import type { OrderStatus } from '@/shared/lib/supabase/queries/orders'

export function useMyBooks(ownerId: string | null) {
  return useQuery({
    queryKey: ['dashboard', 'books', ownerId],
    queryFn:  () => fetchMyBooks(ownerId!),
    enabled:  Boolean(ownerId),
  })
}

export function useMyOrders(sellerId: string | null) {
  return useQuery({
    queryKey: ['dashboard', 'orders', sellerId],
    queryFn:  () => fetchMyOrders(sellerId!),
    enabled:  Boolean(sellerId),
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
