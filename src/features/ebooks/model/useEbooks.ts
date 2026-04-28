'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchEbooks,
  fetchEbookById,
  fetchMyEbooks,
  fetchAllEbooks,
  fetchPendingEbooks,
  updateEbookStatus,
  incrementDownloadCount,
  getEbookDownloadUrl,
} from '@/shared/lib/supabase/queries/ebooks'
import type { EbooksQueryParams } from '@/shared/lib/supabase/queries/ebooks'

export function useEbooks(params: EbooksQueryParams = {}) {
  return useQuery({
    queryKey: ['ebooks', params],
    queryFn:  () => fetchEbooks(params),
  })
}

export function useEbook(id: string | null) {
  return useQuery({
    queryKey: ['ebooks', 'detail', id],
    queryFn:  () => fetchEbookById(id!),
    enabled:  Boolean(id),
  })
}

export function useMyEbooks(userId: string | null) {
  return useQuery({
    queryKey: ['ebooks', 'my', userId],
    queryFn:  () => fetchMyEbooks(userId!),
    enabled:  Boolean(userId),
  })
}

export function useAllEbooks() {
  return useQuery({
    queryKey: ['ebooks', 'all'],
    queryFn:  fetchAllEbooks,
  })
}

export function usePendingEbooks() {
  return useQuery({
    queryKey: ['ebooks', 'pending'],
    queryFn:  fetchPendingEbooks,
  })
}

export function useUpdateEbookStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ ebookId, status, reason }: {
      ebookId: string
      status:  'approved' | 'rejected'
      reason?: string
    }) => updateEbookStatus(ebookId, status, reason),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['ebooks'] })
    },
  })
}

export function useDownloadEbook() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ ebookId, fileUrl, fileName }: {
      ebookId:  string
      fileUrl:  string
      fileName: string
    }) => {
      // Получаем signed URL
      const url = await getEbookDownloadUrl(fileUrl)

      // Скачиваем файл
      const response = await fetch(url)
      if (!response.ok) throw new Error('Ошибка скачивания файла')

      const blob = await response.blob()

      // Триггерим скачивание в браузере
      const objectUrl = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = objectUrl
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(objectUrl)

      // Инкрементируем счётчик
      await incrementDownloadCount(ebookId)
    },
    onSuccess: (_, { ebookId }) => {
      qc.invalidateQueries({ queryKey: ['ebooks', 'detail', ebookId] })
    },
  })
}
