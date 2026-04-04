'use client'

import { memo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/shared/lib/cn'
import { Container } from '@/shared/ui/Container'
import { PageHeading } from '@/shared/ui/PageHeading'
import { ProfileAvatar } from '@/entities/profile'
import { Dropzone, DropzoneEmptyState, DropzoneContent } from '@/shared/ui/Dropzone'
import { useSupabaseUpload } from '@/shared/hooks/useSupabaseUpload'
import { updateProfileAction } from '@/features/auth/actions/auth.actions'
import type { Profile } from '@/entities/profile'
import type { User } from '@supabase/supabase-js'

const inputCls = cn(
  'h-11 w-full rounded-xl border border-surface2 bg-bg px-4 text-sm text-ink',
  'placeholder:text-dim outline-none',
  'hover:border-surface3 focus:border-accent/50 focus:ring-2 focus:ring-accent/10',
  'transition-all duration-150',
)

const textareaCls = cn(
  'w-full rounded-xl border border-surface2 bg-bg px-4 py-3 text-sm text-ink',
  'placeholder:text-dim outline-none resize-none',
  'hover:border-surface3 focus:border-accent/50 focus:ring-2 focus:ring-accent/10',
  'transition-all duration-150',
)

function Field({
  label,
  hint,
  children,
}: {
  label:    string
  hint?:    string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-ink">{label}</label>
      {children}
      {hint && <p className="text-xs text-dim">{hint}</p>}
    </div>
  )
}

interface ProfileEditFormProps {
  user:    User
  profile: Profile | null
}

export const ProfileEditForm = memo<ProfileEditFormProps>(({ user, profile }) => {
  const router  = useRouter()
  const [saving, setSaving]   = useState(false)
  const [error,  setError]    = useState<string | null>(null)
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatarUrl ?? '')

  const avatarUpload = useSupabaseUpload({
    bucketName:       'avatars',
    path:             user.id,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxFiles:         1,
    maxFileSize:      3 * 1024 * 1024,
  })

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setSaving(true)

    try {
      let finalAvatarUrl = avatarUrl

      if (avatarUpload.files.filter((f) => f.errors.length === 0).length > 0) {
        const urls = await avatarUpload.onUpload()
        if (urls[0]) finalAvatarUrl = urls[0]
      }

      const fd = new FormData(e.currentTarget)

      await updateProfileAction({
        displayName: fd.get('display_name') as string,
        firstName:   fd.get('first_name')   as string,
        lastName:    fd.get('last_name')     as string,
        bio:         fd.get('bio')           as string,
        city:        fd.get('city')          as string,
        country:     fd.get('country')       as string,
        website:     fd.get('website')       as string,
        bornYear:    fd.get('born_year')     as string,
        avatarUrl:   finalAvatarUrl,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось сохранить')
      setSaving(false)
    }
  }

  const displayName = [profile?.firstName, profile?.lastName].filter(Boolean).join(' ')
    || profile?.displayName
    || user.email?.split('@')[0]
    || 'Пользователь'

  return (
    <main id="main-content">
      <section className="py-12">
        <Container>
          <div className="max-w-2xl mx-auto">
            <div className="mb-10">
              <PageHeading eyebrow="Аккаунт" title="Редактировать профиль" />
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <div className="flex flex-col gap-8">

                {/* Avatar */}
                <div className="bg-surface border border-surface2 rounded-2xl p-6 flex flex-col gap-5">
                  <h2 className="text-[11px] font-medium tracking-[2px] uppercase text-accent">
                    Фото профиля
                  </h2>
                  <div className="flex items-center gap-5">
                    <ProfileAvatar avatarUrl={avatarUrl || null} name={displayName} size="xl" />
                    <div className="flex-1">
                      <Dropzone {...avatarUpload}>
                        <DropzoneEmptyState />
                        <DropzoneContent />
                      </Dropzone>
                    </div>
                  </div>
                </div>

                {/* Personal info */}
                <div className="bg-surface border border-surface2 rounded-2xl p-6 flex flex-col gap-5">
                  <h2 className="text-[11px] font-medium tracking-[2px] uppercase text-accent">
                    Личные данные
                  </h2>

                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Имя">
                      <input
                        name="first_name"
                        type="text"
                        maxLength={100}
                        defaultValue={profile?.firstName ?? ''}
                        placeholder="Александр"
                        className={inputCls}
                      />
                    </Field>
                    <Field label="Фамилия">
                      <input
                        name="last_name"
                        type="text"
                        maxLength={100}
                        defaultValue={profile?.lastName ?? ''}
                        placeholder="Иванов"
                        className={inputCls}
                      />
                    </Field>
                  </div>

                  <Field label="Отображаемое имя" hint="Если не указано — используется имя и фамилия">
                    <input
                      name="display_name"
                      type="text"
                      maxLength={100}
                      defaultValue={profile?.displayName ?? ''}
                      placeholder="Псевдоним или короткое имя"
                      className={inputCls}
                    />
                  </Field>

                  <Field label="Год рождения">
                    <input
                      name="born_year"
                      type="number"
                      min={1900}
                      max={new Date().getFullYear() - 5}
                      defaultValue={profile?.bornYear ?? ''}
                      placeholder="1985"
                      className={inputCls}
                    />
                  </Field>

                  <Field label="О себе" hint="Расскажите немного о себе и своих интересах">
                    <textarea
                      name="bio"
                      rows={3}
                      maxLength={500}
                      defaultValue={profile?.bio ?? ''}
                      placeholder="Интересуюсь историей Кавказа, собираю старинные карты..."
                      className={textareaCls}
                    />
                  </Field>
                </div>

                {/* Location & contacts */}
                <div className="bg-surface border border-surface2 rounded-2xl p-6 flex flex-col gap-5">
                  <h2 className="text-[11px] font-medium tracking-[2px] uppercase text-accent">
                    Местоположение и контакты
                  </h2>

                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Город">
                      <input
                        name="city"
                        type="text"
                        maxLength={100}
                        defaultValue={profile?.city ?? ''}
                        placeholder="Москва"
                        className={inputCls}
                      />
                    </Field>
                    <Field label="Страна">
                      <input
                        name="country"
                        type="text"
                        maxLength={100}
                        defaultValue={profile?.country ?? ''}
                        placeholder="Россия"
                        className={inputCls}
                      />
                    </Field>
                  </div>

                  <Field label="Сайт или соцсеть">
                    <input
                      name="website"
                      type="url"
                      maxLength={255}
                      defaultValue={profile?.website ?? ''}
                      placeholder="https://example.com"
                      className={inputCls}
                    />
                  </Field>

                  {/* Email — read only */}
                  <Field label="Email" hint="Изменить email можно в настройках аккаунта">
                    <input
                      type="email"
                      value={user.email ?? ''}
                      readOnly
                      className={cn(inputCls, 'opacity-60 cursor-not-allowed')}
                    />
                  </Field>
                </div>

                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                  </div>
                )}

                <div className="flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="h-11 px-6 rounded-xl text-sm font-medium border border-surface2 text-ash hover:text-ink hover:bg-surface transition-all cursor-pointer"
                  >
                    Отмена
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="h-11 px-8 rounded-xl text-sm font-medium bg-accent text-bg border border-accent hover:bg-accent2 shadow-accent-sm hover:shadow-accent transition-all cursor-pointer disabled:opacity-60 disabled:cursor-wait"
                  >
                    {saving ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full border-2 border-bg/30 border-t-bg animate-spin" />
                        Сохраняем...
                      </span>
                    ) : 'Сохранить'}
                  </button>
                </div>

              </div>
            </form>
          </div>
        </Container>
      </section>
    </main>
  )
})

ProfileEditForm.displayName = 'ProfileEditForm'
