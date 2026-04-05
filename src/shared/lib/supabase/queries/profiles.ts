import { createClient } from '@/shared/lib/supabase/client'
import { mapProfileRow } from '@/entities/profile/model/types'
import type { ProfileRow, Profile } from '@/entities/profile/model/types'

export async function fetchProfile(userId: string): Promise<Profile | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) return null
  return mapProfileRow(data as ProfileRow)
}

export async function fetchSellerStats(sellerId: string): Promise<{
  totalBooks:  number
  activeBooks: number
  soldBooks:   number
}> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('books')
    .select('status')
    .eq('owner_id', sellerId)

  if (error) return { totalBooks: 0, activeBooks: 0, soldBooks: 0 }

  const rows = data as { status: string }[]
  return {
    totalBooks:  rows.length,
    activeBooks: rows.filter((r) => r.status === 'active').length,
    soldBooks:   rows.filter((r) => r.status === 'sold').length,
  }
}

export interface UpdateProfileData {
  displayName?: string
  firstName?:   string
  lastName?:    string
  bio?:         string
  city?:        string
  country?:     string
  website?:     string
  bornYear?:    number | null
  avatarUrl?:   string | null
}

export async function updateProfile(userId: string, data: UpdateProfileData): Promise<Profile> {
  const supabase = createClient()
  const { data: updated, error } = await supabase
    .from('profiles')
    .upsert({
      id:           userId,
      display_name: data.displayName ?? null,
      first_name:   data.firstName   ?? null,
      last_name:    data.lastName    ?? null,
      bio:          data.bio         ?? null,
      city:         data.city        ?? null,
      country:      data.country     ?? null,
      website:      data.website     ?? null,
      born_year:    data.bornYear    ?? null,
      avatar_url:   data.avatarUrl   ?? null,
      updated_at:   new Date().toISOString(),
    })
    .select('*')
    .single()

  if (error) throw new Error(error.message)
  return mapProfileRow(updated as ProfileRow)
}
