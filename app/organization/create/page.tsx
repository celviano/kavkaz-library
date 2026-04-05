import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/shared/lib/supabase/server'
import { CreateOrganizationForm } from '@/pages/organization'

export const metadata: Metadata = { title: 'Создать организацию' }

export default async function Page() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')
  return <CreateOrganizationForm />
}
