import Link from 'next/link'
import { AuthCard } from './AuthCard'
import { AuthInput } from './AuthInput'
import { signUpAction } from '../actions/auth.actions'

interface SignUpFormProps {
  error?: string
}

export function SignUpForm({ error }: SignUpFormProps) {
  return (
    <AuthCard
      title="Создать аккаунт"
      subtitle="Присоединяйтесь к библиотеке"
    >
      <form action={signUpAction} className="flex flex-col gap-4">
        <AuthInput
          label="Имя"
          name="name"
          type="text"
          placeholder="Ваше имя"
          autoComplete="name"
          required
        />
        <AuthInput
          label="Email"
          name="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
        />
        <AuthInput
          label="Пароль"
          name="password"
          type="password"
          placeholder="Минимум 6 символов"
          autoComplete="new-password"
          minLength={6}
          required
        />

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {decodeURIComponent(error)}
          </div>
        )}

        <button
          type="submit"
          className="mt-1 h-11 w-full rounded-xl bg-accent text-bg text-sm font-medium border border-accent hover:bg-accent2 hover:border-accent2 transition-all duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Зарегистрироваться
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ash">
        Уже есть аккаунт?{' '}
        <Link href="/auth/login" className="text-accent hover:text-accent2 font-medium transition-colors">
          Войти
        </Link>
      </p>
    </AuthCard>
  )
}
