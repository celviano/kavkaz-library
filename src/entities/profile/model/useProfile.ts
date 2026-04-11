'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { fetchProfile, fetchSellerStats } from '@/shared/lib/supabase/queries/profiles'
import { updateProfileAction } from '@/features/auth/actions/auth.actions'
import type { UpdateProfileData } from '@/features/auth/actions/auth.actions'

export const PROFILE_QUERY_KEY = (userId: string) => ['profile', userId]

export function useProfile(userId: string | null) {
  return useQuery({
    queryKey: PROFILE_QUERY_KEY(userId ?? ''),
    queryFn:  () => fetchProfile(userId!),
    enabled:  Boolean(userId),
    staleTime: 60_000,
  })
}

export function useUpdateProfile(userId: string) {
  const qc     = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: (data: UpdateProfileData) => updateProfileAction(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PROFILE_QUERY_KEY(userId) })
      router.push('/profile')
      router.refresh()
    },
  })
}

export function useSellerStats(sellerId: string | null) {
  return useQuery({
    queryKey: ['seller-stats', sellerId],
    queryFn:  () => fetchSellerStats(sellerId!),
    enabled:  Boolean(sellerId),
    staleTime: 60_000,
  })
}
