'use client'

import { memo } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
import { profileEditSchema } from '@/shared/lib/zod/schemas'
import type { ProfileEditValues } from '@/shared/lib/zod/schemas'
import type { Profile } from '@/entities/profile'
import type { User } from '@supabase/supabase-js'

interface ProfileEditFormProps {
  user:    User
  profile: Profile | null
}

export const ProfileEditForm = memo<ProfileEditFormProps>(({ user, profile }) => {
  const router = useRouter()
  const { mutate: update, isPending, error } = useUpdateProfile(user.id)

  const { register, handleSubmit, formState: { errors } } = useForm<ProfileEditValues>({
    resolver: zodResolver(profileEditSchema),
    defaultValues: {
      firstName:   profile?.firstName   ?? '',
      lastName:    profile?.lastName    ?? '',
      displayName: profile?.displayName ?? '',
      bornYear:    profile?.bornYear ? String(profile.bornYear) : '',
      bio:         profile?.bio         ?? '',
      city:        profile?.city        ?? '',
      country:     profile?.country     ?? '',
      website:     profile?.website     ?? '',
    },
  })

  const avatarUpload = useSupabaseUpload({
    bucketName: 'avatars', path: user.id,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxFiles: 1, maxFileSize: 3 * 1024 * 1024,
  })

  const displayName = [profile?.firstName, profile?.lastName].filter(Boolean).join(' ')
    || profile?.displayName
    || user.email?.split('@')[0]
    || 'Пользователь'

  async function onSubmit(data: ProfileEditValues) {
    let avatarUrl = profile?.avatarUrl ?? ''
    if (avatarUpload.files.filter(f => f.errors.length === 0).length > 0) {
      const urls = await avatarUpload.onUpload()
      if (urls[0]) avatarUrl = urls[0]
    }

    update({
      firstName:   data.firstName   ?? '',
      lastName:    data.lastName    ?? '',
      displayName: data.displayName ?? '',
      bornYear:    data.bornYear    ?? '',
      bio:         data.bio         ?? '',
      city:        data.city        ?? '',
      country:     data.country     ?? '',
      website:     data.website     ?? '',
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

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-8">
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
                    <Input placeholder="Александр" maxLength={100} {...register('firstName')} />
                  </FormField>
                  <FormField label="Фамилия">
                    <Input placeholder="Иванов" maxLength={100} {...register('lastName')} />
                  </FormField>
                </div>
                <FormField label="Отображаемое имя" hint="Если не указано — используется имя и фамилия">
                  <Input placeholder="Псевдоним" maxLength={100} {...register('displayName')} />
                </FormField>
                <FormField label="Год рождения">
                  <Input type="number" min={1900} max={new Date().getFullYear() - 5}
                    placeholder="1985" {...register('bornYear')} />
                </FormField>
                <FormField label="О себе" hint="Расскажите немного о себе">
                  <Textarea rows={3} maxLength={500}
                    placeholder="Интересуюсь культурой и историей Кавказа..."
                    {...register('bio')} />
                </FormField>
              </FormSection>

              <FormSection title="Местоположение и контакты">
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Город">
                    <Input placeholder="Москва" maxLength={100} {...register('city')} />
                  </FormField>
                  <FormField label="Страна">
                    <Input placeholder="Россия" maxLength={100} {...register('country')} />
                  </FormField>
                </div>
                <FormField label="Сайт или соцсеть" error={errors.website?.message}>
                  <Input type="url" placeholder="https://example.com" maxLength={255}
                    error={errors.website?.message} {...register('website')} />
                </FormField>
                <FormField label="Email" hint="Изменить email можно в настройках аккаунта">
                  <Input type="email" value={user.email ?? ''} readOnly className="opacity-60 cursor-not-allowed" />
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
