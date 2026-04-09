'use client'

import { memo, useEffect } from 'react'
import Link from 'next/link'

interface AuthGateModalProps {
  onClose: () => void
}

export const AuthGateModal = memo<AuthGateModalProps>(({ onClose }) => {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={onClose} aria-hidden="true"/>

      <div
        className="relative z-10 w-full sm:max-w-sm bg-bg rounded-t-3xl sm:rounded-3xl border border-surface2 shadow-accent p-8 flex flex-col items-center gap-6 text-center"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-gate-title"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-ash hover:text-ink hover:bg-surface2 transition-colors cursor-pointer"
          aria-label="Закрыть"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2a5c45" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </div>

        <div>
          <h2 id="auth-gate-title" className="text-ink font-semibold text-lg mb-1.5">
            Войдите в аккаунт
          </h2>
          <p className="text-ash text-sm leading-relaxed">
            Для оформления заказа необходимо авторизоваться или зарегистрироваться
          </p>
        </div>

        <div className="flex flex-col gap-3 w-full">
          <Link
            href="/auth/login"
            className="w-full h-11 rounded-xl text-sm font-medium bg-accent text-bg border border-accent hover:bg-accent2 hover:border-accent2 transition-all flex items-center justify-center shadow-accent-sm hover:shadow-accent"
          >
            Войти
          </Link>
          <Link
            href="/auth/sign-up"
            className="w-full h-11 rounded-xl text-sm font-medium border border-surface2 text-ash hover:text-ink hover:bg-surface hover:border-surface3 transition-all flex items-center justify-center"
          >
            Зарегистрироваться
          </Link>
        </div>
      </div>
    </div>
  )
})

AuthGateModal.displayName = 'AuthGateModal'
