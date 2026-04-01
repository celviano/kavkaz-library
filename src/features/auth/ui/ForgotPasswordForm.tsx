import Link from 'next/link'
import { AuthCard } from './AuthCard'
import { AuthInput } from './AuthInput'
import { forgotPasswordAction } from '../actions/auth.actions'

interface ForgotPasswordFormProps {
  error?: string
  success?: boolean
}

export function ForgotPasswordForm({ error, success }: ForgotPasswordFormProps) {
  if (success) {
    return (
      <AuthCard title="Письмо отправлено">
        <div className="flex flex-col items-center gap-5 text-center py-2">
          <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke="#2a5c45" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <p className="text-sm text-ash leading-relaxed">
            Проверьте почту — мы отправили ссылку для сброса пароля.
          </p>
          <Link href="/auth/login" className="text-sm text-accent hover:text-accent2 font-medium transition-colors">
            ← Вернуться ко входу
          </Link>
        </div>
      </AuthCard>
    )
  }

  return (
    <AuthCard
      title="Сброс пароля"
      subtitle="Укажите email и мы отправим ссылку"
    >
      <form action={forgotPasswordAction} className="flex flex-col gap-4">
        <AuthInput
          label="Email"
          name="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
        />

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {decodeURIComponent(error)}
          </div>
        )}

        <button
          type="submit"
          className="mt-1 h-11 w-full rounded-xl bg-accent text-bg text-sm font-medium border border-accent hover:bg-accent2 transition-all duration-200 cursor-pointer"
        >
          Отправить ссылку
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ash">
        <Link href="/auth/login" className="text-accent hover:text-accent2 font-medium transition-colors">
          ← Вернуться ко входу
        </Link>
      </p>
    </AuthCard>
  )
}
