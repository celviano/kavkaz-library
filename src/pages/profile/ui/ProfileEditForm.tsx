'use client'

import { memo, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Container } from '@/shared/ui/Container'
import { PageHeading } from '@/shared/ui/PageHeading'
import { FormField } from '@/shared/ui/FormField'
import { Input } from '@/shared/ui/Input'
import { Textarea } from '@/shared/ui/Textarea'
import { FormActions } from '@/shared/ui/FormActions'
import { ErrorBanner } from '@/shared/ui/ErrorBanner'
import { Dropzone, DropzoneEmptyState, DropzoneContent } from '@/shared/ui/Dropzone'
import { ProfileAvatar, useUpdateProfile } from '@/entities/profile'
import { useSupabaseUpload } from '@/shared/hooks/useSupabaseUpload'
import { FormSection } from '@/features/add-book/ui/FormSection'
import type { Profile } from '@/entities/profile'
import type { User } from '@supabase/supabase-js'

interface ProfileEditFormProps {
  user:    User
  profile: Profile | null
}

export const ProfileEditForm = memo<ProfileEditFormProps>(({ user, profile }) => {
  const router = useRouter()
  const { mutate: update, isPending, error } = useUpdateProfile(user.id)

  // Refs — guaranteed to hold values even after async avatar upload
  const firstNameRef   = useRef<HTMLInputElement>(null)
  const lastNameRef    = useRef<HTMLInputElement>(null)
  const displayNameRef = useRef<HTMLInputElement>(null)
  const bornYearRef    = useRef<HTMLInputElement>(null)
  const bioRef         = useRef<HTMLTextAreaElement>(null)
  const cityRef        = useRef<HTMLInputElement>(null)
  const countryRef     = useRef<HTMLInputElement>(null)
  const websiteRef     = useRef<HTMLInputElement>(null)

  const avatarUpload = useSupabaseUpload({
    bucketName:       'avatars',
    path:             user.id,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxFiles:         1,
    maxFileSize:      3 * 1024 * 1024,
  })

  const displayName = [profile?.firstName, profile?.lastName].filter(Boolean).join(' ')
    || profile?.displayName
    || user.email?.split('@')[0]
    || 'Пользователь'

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    // Upload avatar first — refs stay valid across this await
    let avatarUrl = profile?.avatarUrl ?? ''
    if (avatarUpload.files.filter((f) => f.errors.length === 0).length > 0) {
      const urls = await avatarUpload.onUpload()
      if (urls[0]) avatarUrl = urls[0]
    }

    update({
      firstName:   firstNameRef.current?.value   ?? '',
      lastName:    lastNameRef.current?.value    ?? '',
      displayName: displayNameRef.current?.value ?? '',
      bornYear:    bornYearRef.current?.value    ?? '',
      bio:         bioRef.current?.value         ?? '',
      city:        cityRef.current?.value        ?? '',
      country:     countryRef.current?.value     ?? '',
      website:     websiteRef.current?.value     ?? '',
      avatarUrl,
    })
  }

  return (
    <main id="main-content">
      <section className="py-12">
        <Container>
          <div className="max-w-2xl mx-auto">
            <div className="mb-10">
              <PageHeading eyebrow="Аккаунт" title="Редактировать профиль" />
            </div>

            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-8">

              <FormSection title="Фото профиля">
                <div className="flex items-center gap-5">
                  <ProfileAvatar avatarUrl={profile?.avatarUrl ?? null} name={displayName} size="xl" />
                  <div className="flex-1">
                    <Dropzone {...avatarUpload}>
                      <DropzoneEmptyState />
                      <DropzoneContent />
                    </Dropzone>
                  </div>
                </div>
              </FormSection>

              <FormSection title="Личные данные">
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Имя">
                    <Input ref={firstNameRef} name="first_name" placeholder="Александр"
                      maxLength={100} defaultValue={profile?.firstName ?? ''} />
                  </FormField>
                  <FormField label="Фамилия">
                    <Input ref={lastNameRef} name="last_name" placeholder="Иванов"
                      maxLength={100} defaultValue={profile?.lastName ?? ''} />
                  </FormField>
                </div>
                <FormField label="Отображаемое имя" hint="Если не указано — используется имя и фамилия">
                  <Input ref={displayNameRef} name="display_name" placeholder="Псевдоним"
                    maxLength={100} defaultValue={profile?.displayName ?? ''} />
                </FormField>
                <FormField label="Год рождения">
                  <Input ref={bornYearRef} name="born_year" type="number"
                    min={1900} max={new Date().getFullYear() - 5}
                    placeholder="1985" defaultValue={profile?.bornYear ?? ''} />
                </FormField>
                <FormField label="О себе" hint="Расскажите немного о себе">
                  <Textarea ref={bioRef} name="bio" rows={3} maxLength={500}
                    placeholder="Интересуюсь историей Кавказа..."
                    defaultValue={profile?.bio ?? ''} />
                </FormField>
              </FormSection>

              <FormSection title="Местоположение и контакты">
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Город">
                    <Input ref={cityRef} name="city" placeholder="Москва"
                      maxLength={100} defaultValue={profile?.city ?? ''} />
                  </FormField>
                  <FormField label="Страна">
                    <Input ref={countryRef} name="country" placeholder="Россия"
                      maxLength={100} defaultValue={profile?.country ?? ''} />
                  </FormField>
                </div>
                <FormField label="Сайт или соцсеть">
                  <Input ref={websiteRef} name="website" type="url"
                    placeholder="https://example.com" maxLength={255}
                    defaultValue={profile?.website ?? ''} />
                </FormField>
                <FormField label="Email" hint="Изменить email можно в настройках аккаунта">
                  <Input type="email" value={user.email ?? ''} readOnly
                    className="opacity-60 cursor-not-allowed" />
                </FormField>
              </FormSection>

              <ErrorBanner message={error instanceof Error ? error.message : null} />

              <FormActions
                submitLabel="Сохранить"
                submitting={isPending}
                submittingLabel="Сохраняем..."
                onCancel={() => router.back()}
              />
            </form>
          </div>
        </Container>
      </section>
    </main>
  )
})

ProfileEditForm.displayName = 'ProfileEditForm'
