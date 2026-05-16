'use client'

import { useProfile } from '@/entities/profile'
import { isAdmin, isBuyer, isSeller } from '@/entities/profile'

import { useCurrentUser } from './useCurrentUser'

export function useCurrentRole() {
  const { user, loading: userLoading } = useCurrentUser()
  const { data: profile, isLoading: profileLoading } = useProfile(user?.id ?? null)

  return {
    profile,
    role: profile?.role ?? 'user',
    isAdmin: isAdmin(profile ?? null),
    isSeller: isSeller(profile ?? null),
    isBuyer: isBuyer(profile ?? null),
    isLoading: userLoading || profileLoading,
  } as const
}
