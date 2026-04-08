import type { Metadata } from 'next'
import { LoginForm } from '@/features/auth'

export const metadata: Metadata = { title: 'Вход', robots: { index: false } }

interface Props {
  searchParams: Promise<{ error?: string }>
}

export default async function LoginPage({ searchParams }: Props) {
  const { error } = await searchParams
  return (
    <main id="main-content" className="flex-1 flex items-center justify-center py-16 px-4">
      <LoginForm error={error} />
    </main>
  )
}
