'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchProfile, updateProfile, fetchSellerStats } from '@/shared/lib/supabase/queries/profiles'
import type { UpdateProfileData } from '@/shared/lib/supabase/queries/profiles'

export const PROFILE_QUERY_KEY = (userId: string) => ['profile', userId]

export function useProfile(userId: string | null) {
  return useQuery({
    queryKey: PROFILE_QUERY_KEY(userId ?? ''),
    queryFn:  () => fetchProfile(userId!),
    enabled:  Boolean(userId),
    staleTime: 60 * 1000,
  })
}

export function useUpdateProfile(userId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateProfileData) => updateProfile(userId, data),
    onSuccess: (updated) => {
      queryClient.setQueryData(PROFILE_QUERY_KEY(userId), updated)
    },
  })
}

export function useSellerStats(sellerId: string | null) {
  return useQuery({
    queryKey: ['seller-stats', sellerId],
    queryFn:  () => fetchSellerStats(sellerId!),
    enabled:  Boolean(sellerId),
    staleTime: 60 * 1000,
  })
}
