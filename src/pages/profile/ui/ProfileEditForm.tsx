'use client'

import { memo, useCallback, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'

import type { Profile } from '@/entities/profile'
import { ProfileAvatar, useUpdateProfile } from '@/entities/profile'
import { FormSection } from '@/features/add-book/ui/FormSection'
import { createClient } from '@/shared/lib/supabase/client'
import type { ProfileEditValues } from '@/shared/lib/zod/schemas'
import { profileEditSchema } from '@/shared/lib/zod/schemas'
import { AvatarCropModal } from '@/shared/ui/AvatarCropModal'
import { Button } from '@/shared/ui/Button'
import { Container } from '@/shared/ui/Container'
import { ErrorBanner } from '@/shared/ui/ErrorBanner'
import { FormActions } from '@/shared/ui/FormActions'
import { FormField } from '@/shared/ui/FormField'
import { Input } from '@/shared/ui/Input'
import { PageHeading } from '@/shared/ui/PageHeading'
import { Textarea } from '@/shared/ui/Textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import type { User } from '@supabase/supabase-js'

interface ProfileEditFormProps {
  user: User
  profile: Profile | null
}

export const ProfileEditForm = memo<ProfileEditFormProps>(({ user, profile }) => {
  const router = useRouter()
  const { mutate: update, isPending, error } = useUpdateProfile(user.id)

  // ── Avatar state ────────────────────────────────────────────────────────────
  const avatarInputRef = useRef<HTMLInputElement>(null)
  const [avatarRawSrc, setAvatarRawSrc] = useState<string | null>(null)
  const [avatarModalOpen, setAvatarModalOpen] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [avatarBlob, setAvatarBlob] = useState<Blob | null>(null)

  // ── Banner state ─────────────────────────────────────────────────────────────
  const bannerInputRef = useRef<HTMLInputElement>(null)
  const [bannerRawSrc, setBannerRawSrc] = useState<string | null>(null)
  const [bannerModalOpen, setBannerModalOpen] = useState(false)
  const [bannerPreview, setBannerPreview] = useState<string | null>(null)
  const [bannerBlob, setBannerBlob] = useState<Blob | null>(null)

  const [uploadError, setUploadError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileEditValues>({
    resolver: zodResolver(profileEditSchema),
    defaultValues: {
      firstName: profile?.firstName ?? '',
      lastName: profile?.lastName ?? '',
      displayName: profile?.displayName ?? '',
      bornYear: profile?.bornYear ? String(profile.bornYear) : '',
      bio: profile?.bio ?? '',
      city: profile?.city ?? '',
      country: profile?.country ?? '',
      website: profile?.website ?? '',
    },
  })

  const displayName =
    [profile?.firstName, profile?.lastName].filter(Boolean).join(' ') ||
    profile?.displayName ||
    user.email?.split('@')[0] ||
    'Пользователь'

  // ── File select handlers ────────────────────────────────────────────────────
  const handleAvatarFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarRawSrc(URL.createObjectURL(file))
    setAvatarModalOpen(true)
    e.target.value = ''
  }, [])

  const handleBannerFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setBannerRawSrc(URL.createObjectURL(file))
    setBannerModalOpen(true)
    e.target.value = ''
  }, [])

  // ── Crop apply handlers ─────────────────────────────────────────────────────
  const handleAvatarApply = useCallback(
    (blob: Blob) => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview)
      setAvatarPreview(URL.createObjectURL(blob))
      setAvatarBlob(blob)
      setUploadError(null)
    },
    [avatarPreview],
  )

  const handleBannerApply = useCallback(
    (blob: Blob) => {
      if (bannerPreview) URL.revokeObjectURL(bannerPreview)
      setBannerPreview(URL.createObjectURL(blob))
      setBannerBlob(blob)
      setUploadError(null)
    },
    [bannerPreview],
  )

  // ── Modal close handlers ────────────────────────────────────────────────────
  const handleAvatarModalClose = useCallback(() => {
    setAvatarModalOpen(false)
    if (avatarRawSrc) URL.revokeObjectURL(avatarRawSrc)
    setAvatarRawSrc(null)
  }, [avatarRawSrc])

  const handleBannerModalClose = useCallback(() => {
    setBannerModalOpen(false)
    if (bannerRawSrc) URL.revokeObjectURL(bannerRawSrc)
    setBannerRawSrc(null)
  }, [bannerRawSrc])

  // ── Remove handlers ─────────────────────────────────────────────────────────
  const handleRemoveAvatar = useCallback(() => {
    if (avatarPreview) URL.revokeObjectURL(avatarPreview)
    setAvatarPreview(null)
    setAvatarBlob(null)
  }, [avatarPreview])

  const handleRemoveBanner = useCallback(() => {
    if (bannerPreview) URL.revokeObjectURL(bannerPreview)
    setBannerPreview(null)
    setBannerBlob(null)
  }, [bannerPreview])

  // ── Upload helper ───────────────────────────────────────────────────────────
  async function uploadBlob(blob: Blob, bucket: string): Promise<string> {
    const supabase = createClient()
    const filePath = `${user.id}/${Date.now()}.webp`
    const { error: err } = await supabase.storage.from(bucket).upload(filePath, blob, {
      upsert: true,
      cacheControl: '3600',
      contentType: 'image/webp',
    })
    if (err) throw err
    return supabase.storage.from(bucket).getPublicUrl(filePath).data.publicUrl
  }

  // ── Submit ──────────────────────────────────────────────────────────────────
  async function onSubmit(data: ProfileEditValues) {
    setUploadError(null)
    let avatarUrl = profile?.avatarUrl ?? ''
    let bannerUrl = profile?.bannerUrl ?? ''

    try {
      if (avatarBlob) avatarUrl = await uploadBlob(avatarBlob, 'avatars')
      if (bannerBlob) bannerUrl = await uploadBlob(bannerBlob, 'banners')
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Ошибка загрузки изображения')
      return
    }

    update({
      firstName: data.firstName ?? '',
      lastName: data.lastName ?? '',
      displayName: data.displayName ?? '',
      bornYear: data.bornYear ?? '',
      bio: data.bio ?? '',
      city: data.city ?? '',
      country: data.country ?? '',
      website: data.website ?? '',
      avatarUrl,
      bannerUrl,
    })
  }

  const shownAvatarUrl = avatarPreview ?? profile?.avatarUrl ?? null
  const shownBannerUrl = bannerPreview ?? profile?.bannerUrl ?? null

  const PencilIcon = (
    <svg
      width="18"
      height="18"
      viewBox="0 0 20 20"
      fill="none"
      stroke="white"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 15.5V17h1.5l8.8-8.8-1.5-1.5L2 15.5z" />
      <path d="M16.7 4.3a1 1 0 0 0 0-1.4l-1.6-1.6a1 1 0 0 0-1.4 0l-1.4 1.4 3 3 1.4-1.4z" />
    </svg>
  )

  return (
    <main id="main-content">
      <section className="py-12">
        <Container>
          <div className="max-w-2xl mx-auto">
            <div className="mb-10">
              <PageHeading eyebrow="Аккаунт" title="Редактировать профиль" />
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="flex flex-col gap-8"
            >
              {/* ── Banner section ────────────────────────────────────────── */}
              <FormSection title="Обложка профиля">
                <div className="flex flex-col gap-3">
                  {/* Banner preview — clickable */}
                  <button
                    type="button"
                    onClick={() => bannerInputRef.current?.click()}
                    aria-label="Изменить обложку профиля"
                    className="relative group w-full overflow-hidden rounded-xl border border-surface2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                    style={{ height: 106 }}
                  >
                    {shownBannerUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={shownBannerUrl}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-surface2 flex items-center justify-center">
                        <svg
                          className="absolute inset-0 w-full h-full"
                          preserveAspectRatio="xMidYMid slice"
                          style={{ opacity: 0.06 }}
                        >
                          <defs>
                            <pattern
                              id="banner-edit-pat"
                              x="0"
                              y="0"
                              width="60"
                              height="60"
                              patternUnits="userSpaceOnUse"
                            >
                              <polygon
                                points="30,4 56,30 30,56 4,30"
                                fill="none"
                                stroke="#2a5c45"
                                strokeWidth="1"
                              />
                              <polygon
                                points="30,14 46,30 30,46 14,30"
                                fill="none"
                                stroke="#8B6914"
                                strokeWidth="0.7"
                              />
                              <circle cx="30" cy="30" r="3" fill="#2a5c45" />
                            </pattern>
                          </defs>
                          <rect width="100%" height="100%" fill="url(#banner-edit-pat)" />
                        </svg>
                      </div>
                    )}
                    {/* Hover overlay */}
                    <span
                      className="absolute inset-0 flex items-center justify-center bg-dark/50 opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-hidden="true"
                    >
                      {PencilIcon}
                    </span>
                  </button>

                  {/* Controls */}
                  <div className="flex items-center gap-3">
                    <p className="text-sm text-ash leading-snug flex-1">
                      JPG, PNG или WebP · до 5 МБ · рекомендуем 895×212
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => bannerInputRef.current?.click()}
                    >
                      Выбрать обложку
                    </Button>
                    {bannerPreview && (
                      <button
                        type="button"
                        onClick={handleRemoveBanner}
                        className="text-xs text-dim hover:text-ash transition-colors whitespace-nowrap"
                      >
                        Удалить
                      </button>
                    )}
                  </div>

                  <input
                    ref={bannerInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handleBannerFileSelect}
                    aria-hidden="true"
                    tabIndex={-1}
                  />
                </div>
              </FormSection>

              {/* ── Avatar section ────────────────────────────────────────── */}
              <FormSection title="Фото профиля">
                <div className="flex items-center gap-5">
                  <button
                    type="button"
                    onClick={() => avatarInputRef.current?.click()}
                    aria-label="Изменить фото профиля"
                    className="relative group shrink-0 rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    <ProfileAvatar
                      avatarUrl={shownAvatarUrl}
                      name={displayName}
                      size="xl"
                    />
                    <span
                      className="absolute inset-0 rounded-full flex items-center justify-center bg-dark/55 opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-hidden="true"
                    >
                      {PencilIcon}
                    </span>
                  </button>

                  <div className="flex flex-col gap-2">
                    <p className="text-sm text-ash leading-snug">
                      JPG, PNG или WebP · до 3 МБ
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => avatarInputRef.current?.click()}
                      >
                        Выбрать фото
                      </Button>
                      {avatarPreview && (
                        <button
                          type="button"
                          onClick={handleRemoveAvatar}
                          className="text-xs text-dim hover:text-ash transition-colors"
                        >
                          Удалить
                        </button>
                      )}
                    </div>
                  </div>

                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handleAvatarFileSelect}
                    aria-hidden="true"
                    tabIndex={-1}
                  />
                </div>
              </FormSection>

              {/* ── Personal data ─────────────────────────────────────────── */}
              <FormSection title="Личные данные">
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Имя">
                    <Input
                      placeholder="Александр"
                      maxLength={100}
                      {...register('firstName')}
                    />
                  </FormField>
                  <FormField label="Фамилия">
                    <Input
                      placeholder="Иванов"
                      maxLength={100}
                      {...register('lastName')}
                    />
                  </FormField>
                </div>
                <FormField
                  label="Отображаемое имя"
                  hint="Если не указано — используется имя и фамилия"
                >
                  <Input
                    placeholder="Псевдоним"
                    maxLength={100}
                    {...register('displayName')}
                  />
                </FormField>
                <FormField label="Год рождения">
                  <Input
                    type="number"
                    min={1900}
                    max={new Date().getFullYear() - 5}
                    placeholder="1985"
                    {...register('bornYear')}
                  />
                </FormField>
                <FormField label="О себе" hint="Расскажите немного о себе">
                  <Textarea
                    rows={3}
                    maxLength={500}
                    placeholder="Интересуюсь культурой и историей Кавказа..."
                    {...register('bio')}
                  />
                </FormField>
              </FormSection>

              {/* ── Location & contacts ───────────────────────────────────── */}
              <FormSection title="Местоположение и контакты">
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Город">
                    <Input placeholder="Москва" maxLength={100} {...register('city')} />
                  </FormField>
                  <FormField label="Страна">
                    <Input
                      placeholder="Россия"
                      maxLength={100}
                      {...register('country')}
                    />
                  </FormField>
                </div>
                <FormField label="Сайт или соцсеть" error={errors.website?.message}>
                  <Input
                    type="url"
                    placeholder="https://example.com"
                    maxLength={255}
                    error={errors.website?.message}
                    {...register('website')}
                  />
                </FormField>
                <FormField
                  label="Email"
                  hint="Изменить email можно в настройках аккаунта"
                >
                  <Input
                    type="email"
                    value={user.email ?? ''}
                    readOnly
                    className="opacity-60 cursor-not-allowed"
                  />
                </FormField>
              </FormSection>

              <ErrorBanner
                message={uploadError ?? (error instanceof Error ? error.message : null)}
              />

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

      {/* Avatar crop modal */}
      {avatarRawSrc && (
        <AvatarCropModal
          open={avatarModalOpen}
          imageSrc={avatarRawSrc}
          onClose={handleAvatarModalClose}
          onApply={handleAvatarApply}
          cropShape="round"
          aspect={1}
          title="Редактировать фото"
        />
      )}

      {/* Banner crop modal */}
      {bannerRawSrc && (
        <AvatarCropModal
          open={bannerModalOpen}
          imageSrc={bannerRawSrc}
          onClose={handleBannerModalClose}
          onApply={handleBannerApply}
          cropShape="rect"
          aspect={895 / 212}
          title="Редактировать обложку"
        />
      )}
    </main>
  )
})

ProfileEditForm.displayName = 'ProfileEditForm'
