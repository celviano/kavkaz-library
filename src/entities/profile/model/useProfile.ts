'use client'

import { useRouter } from 'next/navigation'

import type { UpdateProfileData } from '@/features/auth/actions/auth.actions'
import { updateProfileAction } from '@/features/auth/actions/auth.actions'
import { fetchProfile, fetchSellerStats } from '@/shared/lib/supabase/queries/profiles'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const PROFILE_QUERY_KEY = (userId: string) => ['profile', userId]

export function useProfile(userId: string | null) {
  return useQuery({
    queryKey: PROFILE_QUERY_KEY(userId ?? ''),
    queryFn: () => fetchProfile(userId!),
    enabled: Boolean(userId),
    staleTime: 60_000,
  })
}

export function useUpdateProfile(userId: string) {
  const qc = useQueryClient()
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
    queryFn: () => fetchSellerStats(sellerId!),
    enabled: Boolean(sellerId),
    staleTime: 60_000,
  })
}
