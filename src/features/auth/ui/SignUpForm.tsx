'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AuthCard } from './AuthCard'
import { AuthInput } from './AuthInput'
import { signUpAction } from '../actions/auth.actions'
import { useFormValidation } from '@/shared/hooks/useFormValidation'
import { rules } from '@/shared/lib/validation'

interface SignUpFormProps {
  error?: string
}

interface SignUpValues {
  name:     string
  email:    string
  password: string
}

const SIGNUP_RULES = {
  name:     [rules.required('Введите имя'), rules.minLength(2)],
  email:    [rules.required('Введите email'), rules.email()],
  password: [rules.required('Введите пароль'), rules.minLength(6, 'Минимум 6 символов')],
}

export function SignUpForm({ error }: SignUpFormProps) {
  const [values, setValues] = useState<SignUpValues>({ name: '', email: '', password: '' })
  const { getFieldError, touchField, validateAll } = useFormValidation<SignUpValues>({
    rules: SIGNUP_RULES,
  })

  function handleChange(field: keyof SignUpValues, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }))
    touchField(field, value)
  }

  async function handleSubmit(formData: FormData) {
    if (!validateAll(values)) return
    await signUpAction(formData)
  }

  return (
    <AuthCard title="Создать аккаунт" subtitle="Присоединяйтесь к библиотеке">
      <form action={handleSubmit} className="flex flex-col gap-4">
        <AuthInput
          label="Имя"
          name="name"
          type="text"
          placeholder="Ваше имя"
          autoComplete="name"
          value={values.name}
          onChange={(e) => handleChange('name', e.target.value)}
          error={getFieldError('name')}
          required
        />
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
          placeholder="Минимум 6 символов"
          autoComplete="new-password"
          value={values.password}
          onChange={(e) => handleChange('password', e.target.value)}
          error={getFieldError('password')}
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
