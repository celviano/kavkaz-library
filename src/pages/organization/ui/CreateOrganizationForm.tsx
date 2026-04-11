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
import { useSupabaseUpload } from '@/shared/hooks/useSupabaseUpload'
import { FormSection } from '@/features/add-book/ui/FormSection'
import { useCreateOrganization } from '@/entities/organization'

export const CreateOrganizationForm = memo(() => {
  const router = useRouter()
  const { mutate: create, isPending, error } = useCreateOrganization()

  const nameRef        = useRef<HTMLInputElement>(null)
  const descriptionRef = useRef<HTMLTextAreaElement>(null)
  const emailRef       = useRef<HTMLInputElement>(null)
  const phoneRef       = useRef<HTMLInputElement>(null)
  const websiteRef     = useRef<HTMLInputElement>(null)
  const cityRef        = useRef<HTMLInputElement>(null)
  const innRef         = useRef<HTMLInputElement>(null)
  const addressRef     = useRef<HTMLInputElement>(null)

  const logoUpload = useSupabaseUpload({
    bucketName:       'logos',
    path:             'organizations',
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'],
    maxFiles:         1,
    maxFileSize:      3 * 1024 * 1024,
  })

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    let logoUrl = ''
    if (logoUpload.files.filter((f) => f.errors.length === 0).length > 0) {
      const urls = await logoUpload.onUpload()
      logoUrl = urls[0] ?? ''
    }

    create(
      {
        name:        nameRef.current?.value        ?? '',
        description: descriptionRef.current?.value ?? '',
        email:       emailRef.current?.value       ?? '',
        phone:       phoneRef.current?.value       ?? '',
        website:     websiteRef.current?.value     ?? '',
        city:        cityRef.current?.value        ?? '',
        inn:         innRef.current?.value         ?? '',
        address:     addressRef.current?.value     ?? '',
        logoUrl,
      },
      { onSuccess: () => router.push('/dashboard') },
    )
  }

  return (
    <main id="main-content">
      <section className="py-12">
        <Container>
          <div className="max-w-2xl mx-auto">
            <div className="mb-10">
              <PageHeading eyebrow="Продавец" title="Создать организацию"
                subtitle="После создания ваш статус изменится на «Продавец»." />
            </div>

            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-8">

              <FormSection title="Основное">
                <FormField label="Название организации" required>
                  <Input ref={nameRef} name="name" required maxLength={200} placeholder="ООО «Книжная лавка»" />
                </FormField>
                <FormField label="Описание" hint="Специализация, история, ассортимент">
                  <Textarea ref={descriptionRef} name="description" rows={3} maxLength={1000}
                    placeholder="Антикварный книжный магазин..." />
                </FormField>
                <FormField label="Логотип" hint="JPG, PNG, WebP или SVG до 3 МБ">
                  <Dropzone {...logoUpload}><DropzoneEmptyState /><DropzoneContent /></Dropzone>
                </FormField>
              </FormSection>

              <FormSection title="Контакты">
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Email">
                    <Input ref={emailRef} name="email" type="email" maxLength={200} placeholder="info@example.com" />
                  </FormField>
                  <FormField label="Телефон">
                    <Input ref={phoneRef} name="phone" type="tel" maxLength={30} placeholder="+7 999 123-45-67" />
                  </FormField>
                </div>
                <FormField label="Сайт">
                  <Input ref={websiteRef} name="website" type="url" maxLength={255} placeholder="https://example.com" />
                </FormField>
              </FormSection>

              <FormSection title="Адрес и реквизиты">
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Город">
                    <Input ref={cityRef} name="city" maxLength={100} placeholder="Москва" />
                  </FormField>
                  <FormField label="ИНН" hint="Необязательно">
                    <Input ref={innRef} name="inn" maxLength={12} placeholder="7700000000" />
                  </FormField>
                </div>
                <FormField label="Адрес">
                  <Input ref={addressRef} name="address" maxLength={300} placeholder="ул. Арбат, 1" />
                </FormField>
              </FormSection>

              <div className="flex items-start gap-3 bg-accent/6 border border-accent/20 rounded-2xl px-5 py-4">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2a5c45"
                  strokeWidth="1.8" strokeLinecap="round" className="flex-shrink-0 mt-0.5">
                  <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
                </svg>
                <p className="text-sm text-accent leading-relaxed">
                  Организация будет проверена администратором перед верификацией.
                </p>
              </div>

              <ErrorBanner message={error instanceof Error ? error.message : null} />

              <FormActions submitLabel="Создать организацию" submitting={isPending}
                submittingLabel="Создаём..." onCancel={() => router.back()} />
            </form>
          </div>
        </Container>
      </section>
    </main>
  )
})

CreateOrganizationForm.displayName = 'CreateOrganizationForm'
