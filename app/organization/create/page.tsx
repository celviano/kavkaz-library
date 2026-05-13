import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { CreateOrganizationForm } from '@/pages/organization'
import { createClient } from '@/shared/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Создать организацию',
  robots: { index: false },
}

export default async function Page() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')
  return <CreateOrganizationForm />
}
