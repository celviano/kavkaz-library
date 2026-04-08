import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/shared/lib/supabase/server'
import { fetchProfile } from '@/shared/lib/supabase/queries/profiles'
import { ProfileEditForm } from '@/pages/profile'

export const metadata: Metadata = { title: 'Редактировать профиль', robots: { index: false } }

export default async function Page() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const profile = await fetchProfile(user.id)

  return <ProfileEditForm user={user} profile={profile} />
}
