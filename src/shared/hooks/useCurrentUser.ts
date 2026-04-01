'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/shared/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

export function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  return { user, loading }
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
