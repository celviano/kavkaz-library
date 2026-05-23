'use client'

import type { BookStatus } from '@/entities/book/model/types'
import {
  deleteBook,
  fetchMyBooks,
  updateBookStatus,
} from '@/shared/lib/supabase/queries/books'
import type { OrderStatus } from '@/shared/lib/supabase/queries/orders'
import {
  cancelBuyerOrder,
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

export function useDeleteBook(ownerId?: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      bookId,
      coverUrl,
      images,
      ebookFileUrl,
    }: {
      bookId: string
      coverUrl?: string | null
      images?: string[] | null
      ebookFileUrl?: string | null
    }) => deleteBook(bookId, { coverUrl, images, ebookFileUrl }),
    onSuccess: (_, { bookId }) => {
      if (ownerId) qc.invalidateQueries({ queryKey: ['dashboard', 'books', ownerId] })
      qc.invalidateQueries({ queryKey: ['books'] })
      qc.removeQueries({ queryKey: ['books', 'detail', bookId] })
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

export function useCancelMyOrder(buyerId: string | null) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (orderId: string) => cancelBuyerOrder(orderId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['sent-orders', buyerId] })
    },
  })
}
