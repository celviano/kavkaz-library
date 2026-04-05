'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Container } from '@/shared/ui/Container'

interface ErrorProps {
  error:  Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log to monitoring service if needed
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('[GlobalError]', error)
    }
  }, [error])

  return (
    <main id="main-content" className="flex-1 flex items-center justify-center py-24">
      <Container>
        <div className="max-w-md mx-auto text-center flex flex-col items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-surface border border-surface2 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
                stroke="#7D7060" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
              />
              <line x1="12" y1="9" x2="12" y2="13" stroke="#7D7060" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="12" y1="17" x2="12.01" y2="17" stroke="#7D7060" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>

          <div>
            <h1
              className="font-display font-semibold text-ink mb-2"
              style={{ fontFamily: 'var(--font-display)', fontSize: '1.7rem' }}
            >
              Что-то пошло не так
            </h1>
            <p className="text-ash text-sm leading-relaxed">
              Произошла непредвиденная ошибка. Попробуйте обновить страницу.
            </p>
            {error.digest && (
              <p className="text-dim text-xs mt-2 font-mono">
                Код: {error.digest}
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={reset}
              className="inline-flex items-center justify-center h-10 px-6 rounded-xl text-sm font-medium bg-accent text-bg hover:bg-accent2 transition-all cursor-pointer"
            >
              Попробовать снова
            </button>
            <Link
              href="/"
              className="inline-flex items-center justify-center h-10 px-6 rounded-xl text-sm font-medium border border-surface2 text-ash hover:text-ink hover:bg-surface transition-all"
            >
              На главную
            </Link>
          </div>
        </div>
      </Container>
    </main>
  )
}
