'use server'

import { redirect } from 'next/navigation'

import { createClient } from '@/shared/lib/supabase/server'

export async function loginAction(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) redirect(`/auth/login?error=${encodeURIComponent(error.message)}`)
  redirect('/')
}

export async function signUpAction(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const name = formData.get('name') as string
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: name, display_name: name },
      emailRedirectTo: `${baseUrl}/auth/confirm?next=/`,
    },
  })
  if (error) redirect(`/auth/sign-up?error=${encodeURIComponent(error.message)}`)
  redirect('/auth/sign-up-success')
}

export async function forgotPasswordAction(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${baseUrl}/auth/confirm?type=recovery&next=/auth/update-password`,
  })
  if (error) redirect(`/auth/forgot-password?error=${encodeURIComponent(error.message)}`)
  redirect('/auth/forgot-password?success=true')
}

export async function updatePasswordAction(formData: FormData) {
  const supabase = await createClient()
  const password = formData.get('password') as string
  const { error } = await supabase.auth.updateUser({ password })
  if (error) redirect(`/auth/update-password?error=${encodeURIComponent(error.message)}`)
  redirect('/')
}

export async function logoutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}

// ─── Profile update — no redirect, navigation handled by useMutation.onSuccess ─

export interface UpdateProfileData {
  firstName: string
  lastName: string
  displayName: string
  bornYear: string
  bio: string
  city: string
  country: string
  website: string
  avatarUrl: string
}

export async function updateProfileAction(data: UpdateProfileData): Promise<void> {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()
  if (authError || !user) throw new Error('Необходима авторизация')

  const { error } = await supabase.from('profiles').upsert({
    id: user.id,
    first_name: data.firstName || null,
    last_name: data.lastName || null,
    display_name: data.displayName || null,
    born_year: data.bornYear ? parseInt(data.bornYear, 10) : null,
    bio: data.bio || null,
    city: data.city || null,
    country: data.country || null,
    website: data.website || null,
    avatar_url: data.avatarUrl || null,
    updated_at: new Date().toISOString(),
  })

  if (error) throw new Error(error.message)
}
