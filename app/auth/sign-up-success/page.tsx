import Link from 'next/link'
import { Container } from '@/shared/ui/Container'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Подтвердите почту', robots: { index: false } }

export default function SignUpSuccessPage() {
  return (
    <main id="main-content" className="flex-1 flex items-center justify-center py-24">
      <Container>
        <div className="max-w-md mx-auto text-center flex flex-col items-center gap-6">
          {/* Icon */}
          <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke="#2a5c45" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <h1
              className="font-display font-semibold text-ink mb-2"
              style={{ fontFamily: 'var(--font-display)', fontSize: '1.7rem' }}
            >
              Проверьте почту
            </h1>
            <p className="text-ash text-sm leading-relaxed">
              Мы отправили письмо с ссылкой для подтверждения.
              Перейдите по ней, чтобы завершить регистрацию.
            </p>
          </div>
          <Link
            href="/auth/login"
            className="text-sm text-accent hover:text-accent2 transition-colors"
          >
            Вернуться ко входу
          </Link>
        </div>
      </Container>
    </main>
  )
}
