import Link from 'next/link'
import { Container } from '@/shared/ui/Container'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Ошибка авторизации' }

interface Props {
  searchParams: Promise<{ error?: string }>
}

export default async function AuthErrorPage({ searchParams }: Props) {
  const { error } = await searchParams

  return (
    <main id="main-content" className="flex-1 flex items-center justify-center py-24">
      <Container>
        <div className="max-w-md mx-auto text-center flex flex-col items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-surface border border-surface2 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#7D7060" strokeWidth="1.5"/>
              <path d="M12 8v4M12 16h.01" stroke="#7D7060" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <h1
              className="font-display font-semibold text-ink mb-2"
              style={{ fontFamily: 'var(--font-display)', fontSize: '1.7rem' }}
            >
              Ошибка авторизации
            </h1>
            <p className="text-ash text-sm leading-relaxed">
              {error ?? 'Что-то пошло не так. Попробуйте ещё раз.'}
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center h-10 px-6 rounded-xl text-sm font-medium bg-accent text-bg hover:bg-accent2 transition-colors"
            >
              Войти
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center h-10 px-6 rounded-xl text-sm font-medium border border-surface2 text-ash hover:text-ink hover:bg-surface transition-colors"
            >
              На главную
            </Link>
          </div>
        </div>
      </Container>
    </main>
  )
}
