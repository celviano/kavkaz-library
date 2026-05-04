'use client'

import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AuthCard } from './AuthCard'
import { AuthInput } from './AuthInput'
import { OAuthButton } from './OAuthButton'
import { AuthDivider } from './AuthDivider'
import { ErrorBanner } from '@/shared/ui/ErrorBanner'
import { signUpAction } from '../actions/auth.actions'
import { signUpSchema } from '@/shared/lib/zod/schemas'
import type { SignUpValues } from '@/shared/lib/zod/schemas'

export function SignUpForm({ error }: { error?: string }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
  })

  async function onSubmit(_: SignUpValues, e?: React.BaseSyntheticEvent) {
    const formData = new FormData(e?.target as HTMLFormElement)
    await signUpAction(formData)
  }

  return (
    <AuthCard title="Создать аккаунт" subtitle="Присоединяйтесь к библиотеке">
      <div className="flex flex-col gap-4">
        <OAuthButton provider="google" label="Зарегистрироваться через Google" />
        <AuthDivider />
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <AuthInput
            label="Имя"
            type="text"
            placeholder="Ваше имя"
            autoComplete="name"
            error={errors.name?.message}
            {...register('name')}
          />
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
            placeholder="Минимум 6 символов"
            autoComplete="new-password"
            error={errors.password?.message}
            {...register('password')}
          />

          {error && <ErrorBanner message={decodeURIComponent(error)} />}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-1 h-11 w-full rounded-xl bg-accent text-bg text-sm font-medium border border-accent hover:bg-accent2 hover:border-accent2 transition-all duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-60"
          >
            {isSubmitting ? 'Создаём аккаунт...' : 'Зарегистрироваться'}
          </button>
        </form>
        <p className="text-center text-sm text-ash">
          Уже есть аккаунт?{' '}
          <Link href="/auth/login" className="text-accent hover:text-accent2 font-medium transition-colors">
            Войти
          </Link>
        </p>
      </div>
    </AuthCard>
  )
}
