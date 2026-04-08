import type { Metadata } from 'next'
import { ForgotPasswordForm } from '@/features/auth'

export const metadata: Metadata = { title: 'Сброс пароля', robots: { index: false } }

interface Props {
  searchParams: Promise<{ error?: string; success?: string }>
}

export default async function ForgotPasswordPage({ searchParams }: Props) {
  const { error, success } = await searchParams
  return (
    <main id="main-content" className="flex-1 flex items-center justify-center py-16 px-4">
      <ForgotPasswordForm error={error} success={success === 'true'} />
    </main>
  )
}
