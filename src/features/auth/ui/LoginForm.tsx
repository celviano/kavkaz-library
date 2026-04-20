'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AuthCard } from './AuthCard'
import { AuthInput } from './AuthInput'
import { OAuthButton } from './OAuthButton'
import { AuthDivider } from './AuthDivider'
import { ErrorBanner } from '@/shared/ui/ErrorBanner'
import { loginAction } from '../actions/auth.actions'
import { useFormValidation } from '@/shared/hooks/useFormValidation'
import { rules } from '@/shared/lib/validation'

interface LoginValues {
  email: string
  password: string
}

const LOGIN_RULES = {
  email: [rules.required('Введите email'), rules.email()],
  password: [rules.required('Введите пароль')],
}

export function LoginForm({ error }: { error?: string }) {
  const [values, setValues] = useState<LoginValues>({ email: '', password: '' })
  const { getFieldError, touchField, validateAll } = useFormValidation<LoginValues>({
    rules: LOGIN_RULES,
  })

  function handleChange(field: keyof LoginValues, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }))
    touchField(field, value)
  }

  async function handleSubmit(formData: FormData) {
    if (!validateAll(values)) return
    await loginAction(formData)
  }

  return (
    <AuthCard title="Добро пожаловать" subtitle="Войдите в свой аккаунт">
      <div className="flex flex-col gap-4">
        <OAuthButton provider="google" />
        <AuthDivider />
        <form action={handleSubmit} className="flex flex-col gap-4">
          <AuthInput
            label="Email"
            name="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            value={values.email}
            onChange={(e) => handleChange('email', e.target.value)}
            error={getFieldError('email')}
            required
          />
          <AuthInput
            label="Пароль"
            name="password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            value={values.password}
            onChange={(e) => handleChange('password', e.target.value)}
            error={getFieldError('password')}
            required
          />

          {error && <ErrorBanner message={decodeURIComponent(error)} />}

          <div className="flex justify-end -mt-1">
            <Link
              href="/auth/forgot-password"
              className="text-xs text-ash hover:text-accent transition-colors"
            >
              Забыли пароль?
            </Link>
          </div>
          <button
            type="submit"
            className="h-11 w-full rounded-xl bg-accent text-bg text-sm font-medium border border-accent hover:bg-accent2 hover:border-accent2 transition-all duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Войти
          </button>
        </form>
        <p className="text-center text-sm text-ash">
          Нет аккаунта?{' '}
          <Link
            href="/auth/sign-up"
            className="text-accent hover:text-accent2 font-medium transition-colors"
          >
            Зарегистрироваться
          </Link>
        </p>
      </div>
    </AuthCard>
  )
}
