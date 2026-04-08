'use client'

import { useAuthContext } from '@/app/providers/AuthProvider'
import type { User } from '@supabase/supabase-js'

export function useCurrentUser() {
  return useAuthContext()
}

export function useCurrentUserName(user: User | null): string | null {
  return (
    user?.user_metadata?.display_name ??
    user?.user_metadata?.full_name ??
    user?.user_metadata?.name ??
    user?.email?.split('@')[0] ??
    null
  )
}

export function useCurrentUserImage(user: User | null): string | null {
  return user?.user_metadata?.avatar_url ?? null
}
