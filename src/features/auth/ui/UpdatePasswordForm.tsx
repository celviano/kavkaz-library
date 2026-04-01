import { AuthCard } from './AuthCard'
import { AuthInput } from './AuthInput'
import { updatePasswordAction } from '../actions/auth.actions'

interface UpdatePasswordFormProps {
  error?: string
}

export function UpdatePasswordForm({ error }: UpdatePasswordFormProps) {
  return (
    <AuthCard
      title="Новый пароль"
      subtitle="Придумайте надёжный пароль"
    >
      <form action={updatePasswordAction} className="flex flex-col gap-4">
        <AuthInput
          label="Новый пароль"
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
          className="mt-1 h-11 w-full rounded-xl bg-accent text-bg text-sm font-medium border border-accent hover:bg-accent2 transition-all duration-200 cursor-pointer"
        >
          Сохранить пароль
        </button>
      </form>
    </AuthCard>
  )
}
