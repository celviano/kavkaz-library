'use client'

import { Info } from 'lucide-react'
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
import { useSupabaseUpload } from '@/shared/hooks/useSupabaseUpload'
import { FormSection } from '@/features/add-book/ui/FormSection'
import { useCreateOrganization } from '@/entities/organization'
import { createOrganizationSchema } from '@/shared/lib/zod/schemas'
import type { CreateOrganizationValues } from '@/shared/lib/zod/schemas'

export const CreateOrganizationForm = memo(() => {
  const router = useRouter()
  const { mutate: create, isPending, error } = useCreateOrganization()

  const { register, handleSubmit, formState: { errors } } = useForm<CreateOrganizationValues>({
    resolver: zodResolver(createOrganizationSchema),
    defaultValues: { name: '', description: '', email: '', phone: '', website: '', city: '', inn: '', address: '' },
  })

  const logoUpload = useSupabaseUpload({
    bucketName: 'logos', path: 'organizations',
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'],
    maxFiles: 1, maxFileSize: 3 * 1024 * 1024,
  })

  async function onSubmit(data: CreateOrganizationValues) {
    let logoUrl = ''
    if (logoUpload.files.filter(f => f.errors.length === 0).length > 0) {
      const urls = await logoUpload.onUpload()
      logoUrl = urls[0] ?? ''
    }

    create(
      { name: data.name, description: data.description ?? '', email: data.email ?? '',
        phone: data.phone ?? '', website: data.website ?? '', city: data.city ?? '',
        inn: data.inn ?? '', address: data.address ?? '', logoUrl },
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

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-8">
              <FormSection title="Основное">
                <FormField label="Название организации" required error={errors.name?.message}>
                  <Input required maxLength={200} placeholder="ООО «Книжная лавка»"
                    error={errors.name?.message} {...register('name')} />
                </FormField>
                <FormField label="Описание" hint="Специализация, история, ассортимент">
                  <Textarea rows={3} maxLength={1000} placeholder="Антикварный книжный магазин..." {...register('description')} />
                </FormField>
                <FormField label="Логотип" hint="JPG, PNG, WebP или SVG до 3 МБ">
                  <Dropzone {...logoUpload}>
                    <DropzoneEmptyState />
                    <DropzoneContent />
                  </Dropzone>
                </FormField>
              </FormSection>

              <FormSection title="Контакты">
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Email" error={errors.email?.message}>
                    <Input type="email" maxLength={200} placeholder="info@example.com"
                      error={errors.email?.message} {...register('email')} />
                  </FormField>
                  <FormField label="Телефон">
                    <Input type="tel" maxLength={30} placeholder="+7 999 123-45-67" {...register('phone')} />
                  </FormField>
                </div>
                <FormField label="Сайт" error={errors.website?.message}>
                  <Input type="url" maxLength={255} placeholder="https://example.com"
                    error={errors.website?.message} {...register('website')} />
                </FormField>
              </FormSection>

              <FormSection title="Адрес и реквизиты">
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Город">
                    <Input maxLength={100} placeholder="Москва" {...register('city')} />
                  </FormField>
                  <FormField label="ИНН" hint="Необязательно">
                    <Input maxLength={12} placeholder="7700000000" {...register('inn')} />
                  </FormField>
                </div>
                <FormField label="Адрес">
                  <Input maxLength={300} placeholder="ул. Арбат, 1" {...register('address')} />
                </FormField>
              </FormSection>

              <div className="flex items-start gap-3 bg-accent/6 border border-accent/20 rounded-2xl px-5 py-4">
                <Info size={16} strokeWidth={1.8} className="flex-shrink-0 mt-0.5 text-accent" />
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
