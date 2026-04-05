'use client'

import { memo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/shared/lib/cn'
import { Container } from '@/shared/ui/Container'
import { PageHeading } from '@/shared/ui/PageHeading'
import { Dropzone, DropzoneEmptyState, DropzoneContent } from '@/shared/ui/Dropzone'
import { useSupabaseUpload } from '@/shared/hooks/useSupabaseUpload'
import { useCreateOrganization } from '@/entities/organization'

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

function Field({ label, hint, required, children }: {
  label:    string
  hint?:    string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-ink">
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-dim">{hint}</p>}
    </div>
  )
}

export const CreateOrganizationForm = memo(() => {
  const router  = useRouter()
  const { mutateAsync: create } = useCreateOrganization()
  const [saving, setSaving] = useState(false)
  const [error,  setError]  = useState<string | null>(null)

  const logoUpload = useSupabaseUpload({
    bucketName:       'logos',
    path:             'organizations',
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'],
    maxFiles:         1,
    maxFileSize:      3 * 1024 * 1024,
  })

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setSaving(true)

    try {
      const fd = new FormData(e.currentTarget)
      let logoUrl = ''

      if (logoUpload.files.filter((f) => f.errors.length === 0).length > 0) {
        const urls = await logoUpload.onUpload()
        logoUrl = urls[0] ?? ''
      }

      const org = await create({
        name:        fd.get('name') as string,
        description: fd.get('description') as string,
        website:     fd.get('website') as string,
        email:       fd.get('email') as string,
        phone:       fd.get('phone') as string,
        city:        fd.get('city') as string,
        address:     fd.get('address') as string,
        inn:         fd.get('inn') as string,
        logoUrl,
      })

      router.push(`/dashboard`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось создать организацию')
      setSaving(false)
    }
  }

  return (
    <main id="main-content">
      <section className="py-12">
        <Container>
          <div className="max-w-2xl mx-auto">
            <div className="mb-10">
              <PageHeading
                eyebrow="Продавец"
                title="Создать организацию"
                subtitle="После создания ваш статус изменится на «Продавец». Организацию проверит администратор."
              />
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <div className="flex flex-col gap-8">

                {/* Основное */}
                <div className="bg-surface border border-surface2 rounded-2xl p-6 flex flex-col gap-5">
                  <h2 className="text-[11px] font-medium tracking-[2px] uppercase text-accent">Основное</h2>

                  <Field label="Название организации" required>
                    <input name="name" type="text" required maxLength={200}
                      placeholder="ООО «Книжная лавка»" className={inputCls} />
                  </Field>

                  <Field label="Описание" hint="Расскажите о специализации, истории, ассортименте">
                    <textarea name="description" rows={3} maxLength={1000}
                      placeholder="Антикварный книжный магазин..."
                      className={textareaCls} />
                  </Field>

                  <Field label="Логотип" hint="JPG, PNG, WebP или SVG до 3 МБ">
                    <Dropzone {...logoUpload}>
                      <DropzoneEmptyState />
                      <DropzoneContent />
                    </Dropzone>
                  </Field>
                </div>

                {/* Контакты */}
                <div className="bg-surface border border-surface2 rounded-2xl p-6 flex flex-col gap-5">
                  <h2 className="text-[11px] font-medium tracking-[2px] uppercase text-accent">Контакты</h2>

                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Email">
                      <input name="email" type="email" maxLength={200}
                        placeholder="info@example.com" className={inputCls} />
                    </Field>
                    <Field label="Телефон">
                      <input name="phone" type="tel" maxLength={30}
                        placeholder="+7 999 123-45-67" className={inputCls} />
                    </Field>
                  </div>

                  <Field label="Сайт">
                    <input name="website" type="url" maxLength={255}
                      placeholder="https://example.com" className={inputCls} />
                  </Field>
                </div>

                {/* Адрес */}
                <div className="bg-surface border border-surface2 rounded-2xl p-6 flex flex-col gap-5">
                  <h2 className="text-[11px] font-medium tracking-[2px] uppercase text-accent">Адрес и реквизиты</h2>

                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Город">
                      <input name="city" type="text" maxLength={100}
                        placeholder="Москва" className={inputCls} />
                    </Field>
                    <Field label="ИНН" hint="Необязательно">
                      <input name="inn" type="text" maxLength={12}
                        placeholder="7700000000" className={inputCls} />
                    </Field>
                  </div>

                  <Field label="Адрес">
                    <input name="address" type="text" maxLength={300}
                      placeholder="ул. Арбат, 1" className={inputCls} />
                  </Field>
                </div>

                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                  </div>
                )}

                {/* Info banner */}
                <div className="flex items-start gap-3 bg-accent/6 border border-accent/20 rounded-2xl px-5 py-4">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2a5c45" strokeWidth="1.8" strokeLinecap="round" className="flex-shrink-0 mt-0.5">
                    <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
                  </svg>
                  <p className="text-sm text-accent leading-relaxed">
                    После создания организация будет проверена администратором. До верификации ваши книги будут отображаться как от частного лица.
                  </p>
                </div>

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
                        Создаём...
                      </span>
                    ) : 'Создать организацию'}
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

CreateOrganizationForm.displayName = 'CreateOrganizationForm'
