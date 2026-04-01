import type { Metadata } from 'next'
import { SignUpForm } from '@/features/auth'

export const metadata: Metadata = { title: 'Регистрация' }

interface Props {
  searchParams: Promise<{ error?: string }>
}

export default async function SignUpPage({ searchParams }: Props) {
  const { error } = await searchParams
  return (
    <main id="main-content" className="flex-1 flex items-center justify-center py-16 px-4">
      <SignUpForm error={error} />
    </main>
  )
}
