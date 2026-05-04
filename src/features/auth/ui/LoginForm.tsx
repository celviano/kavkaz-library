'use client'

import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AuthCard } from './AuthCard'
import { AuthInput } from './AuthInput'
import { OAuthButton } from './OAuthButton'
import { AuthDivider } from './AuthDivider'
import { ErrorBanner } from '@/shared/ui/ErrorBanner'
import { loginAction } from '../actions/auth.actions'
import { loginSchema } from '@/shared/lib/zod/schemas'
import type { LoginValues } from '@/shared/lib/zod/schemas'

export function LoginForm({ error }: { error?: string }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(_: LoginValues, e?: React.BaseSyntheticEvent) {
    const formData = new FormData(e?.target as HTMLFormElement)
    await loginAction(formData)
  }

  return (
    <AuthCard title="Добро пожаловать" subtitle="Войдите в свой аккаунт">
      <div className="flex flex-col gap-4">
        <OAuthButton provider="google" />
        <AuthDivider />
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <AuthInput
            label="Email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            error={errors.email?.message}
            {...register('email')}
          />
          <AuthInput
            label="Пароль"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            error={errors.password?.message}
            {...register('password')}
          />

          {error && <ErrorBanner message={decodeURIComponent(error)} />}

          <div className="flex justify-end -mt-1">
            <Link href="/auth/forgot-password" className="text-xs text-ash hover:text-accent transition-colors">
              Забыли пароль?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="h-11 w-full rounded-xl bg-accent text-bg text-sm font-medium border border-accent hover:bg-accent2 hover:border-accent2 transition-all duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-60"
          >
            {isSubmitting ? 'Входим...' : 'Войти'}
          </button>
        </form>
        <p className="text-center text-sm text-ash">
          Нет аккаунта?{' '}
          <Link href="/auth/sign-up" className="text-accent hover:text-accent2 font-medium transition-colors">
            Зарегистрироваться
          </Link>
        </p>
      </div>
    </AuthCard>
  )
}
