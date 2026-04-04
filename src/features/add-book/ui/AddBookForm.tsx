'use client'

import { memo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/shared/lib/cn'
import { Container } from '@/shared/ui/Container'
import { Select } from '@/shared/ui/Select'
import { Dropzone, DropzoneEmptyState, DropzoneContent } from '@/shared/ui/Dropzone'
import { useSupabaseUpload } from '@/shared/hooks/useSupabaseUpload'
import { addBookAction } from '../actions/addBook.action'
import { CATEGORIES, CATEGORY_LABELS } from '@/shared/config/constants'
import { CONDITION_LABELS } from '@/entities/book/model/types'
import type { BookCategory, BookCondition } from '@/entities/book/model/types'

// ─── Field primitive ──────────────────────────────────────────────────────────

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string
  required?: boolean
  hint?: string
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

// ─── Options ──────────────────────────────────────────────────────────────────

const LANGUAGE_OPTIONS = [
  { value: 'Русский', label: 'Русский' },
  { value: 'Грузинский', label: 'Грузинский' },
  { value: 'Армянский', label: 'Армянский' },
  { value: 'Азербайджанский', label: 'Азербайджанский' },
  { value: 'Другой', label: 'Другой' },
]

const CATEGORY_OPTIONS = CATEGORIES.map((cat) => ({
  value: cat,
  label: CATEGORY_LABELS[cat],
}))

const CONDITION_OPTIONS = (
  Object.entries(CONDITION_LABELS) as [BookCondition, string][]
).map(([value, label]) => ({ value, label }))

// ─── Form ─────────────────────────────────────────────────────────────────────

export const AddBookForm = memo(() => {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [priceType, setPriceType] = useState<'fixed' | 'negotiable' | 'exchange'>('fixed')
  const [category, setCategory] = useState<BookCategory | ''>('')
  const [language, setLanguage] = useState('Русский')
  const [condition, setCondition] = useState<BookCondition>('good')

  const coverUpload = useSupabaseUpload({
    bucketName: 'book-covers',
    path: 'user-uploads',
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxFiles: 1,
    maxFileSize: 5 * 1024 * 1024,
  })

  const imagesUpload = useSupabaseUpload({
    bucketName: 'book-images',
    path: 'user-uploads',
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxFiles: 9,
    maxFileSize: 5 * 1024 * 1024,
  })

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    if (!category) {
      setError('Выберите категорию')
      return
    }

    setSubmitting(true)

    try {
      const fd = new FormData(e.currentTarget)

      let coverUrl = ''
      let imageUrls: string[] = []

      if (coverUpload.files.filter((f) => f.errors.length === 0).length > 0) {
        const urls = await coverUpload.onUpload()
        coverUrl = urls[0] ?? ''
      }

      if (imagesUpload.files.filter((f) => f.errors.length === 0).length > 0) {
        imageUrls = await imagesUpload.onUpload()
      }

      await addBookAction({
        title: fd.get('title') as string,
        author: fd.get('author') as string,
        year: parseInt(fd.get('year') as string, 10),
        category: category,
        description: fd.get('description') as string,
        pages: fd.get('pages') ? parseInt(fd.get('pages') as string, 10) : null,
        language,
        price: fd.get('price') ? parseFloat(fd.get('price') as string) : null,
        currency: 'RUB',
        priceType,
        condition,
        edition: fd.get('edition') as string,
        publisherName: fd.get('publisher_name') as string,
        publisherCity: fd.get('publisher_city') as string,
        tags: fd.get('tags') as string,
        coverUrl,
        imageUrls,
        copiesTotal: parseInt((fd.get('copies_total') as string) || '1', 10),
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Что-то пошло не так')
      setSubmitting(false)
    }
  }

  return (
    <main id="main-content">
      <section className="py-12">
        <Container>
          <div className="max-w-2xl mx-auto">
            <div className="mb-10">
              <p className="text-[11px] font-medium tracking-[2px] uppercase text-accent mb-2">
                Каталог
              </p>
              <h1
                className="font-display font-semibold text-ink leading-tight mb-2"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
                }}
              >
                Добавить книгу
              </h1>
              <p className="text-ash text-sm">
                Заполните информацию о книге. Поля отмеченные{' '}
                <span className="text-red-400">*</span> обязательны.
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <div className="flex flex-col gap-8">
                {/* ── Основная информация ── */}
                <div className="bg-surface border border-surface2 rounded-2xl p-6 flex flex-col gap-5">
                  <h2 className="text-[11px] font-medium tracking-[2px] uppercase text-accent">
                    Основная информация
                  </h2>

                  <Field label="Название" required>
                    <input
                      name="title"
                      type="text"
                      required
                      maxLength={300}
                      placeholder="Например: История Грузии с древнейших времён"
                      className={inputCls}
                    />
                  </Field>

                  <Field label="Автор" required>
                    <input
                      name="author"
                      type="text"
                      required
                      maxLength={200}
                      placeholder="Имя автора"
                      className={inputCls}
                    />
                  </Field>

                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Год издания" required>
                      <input
                        name="year"
                        type="number"
                        required
                        min={1400}
                        max={new Date().getFullYear()}
                        placeholder="1871"
                        className={inputCls}
                      />
                    </Field>

                    <Field label="Количество страниц">
                      <input
                        name="pages"
                        type="number"
                        min={1}
                        max={9999}
                        placeholder="488"
                        className={inputCls}
                      />
                    </Field>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Категория" required>
                      <Select
                        label="Категория"
                        value={category}
                        onChange={(v) => setCategory(v as BookCategory)}
                        placeholder="Выберите категорию"
                        options={CATEGORY_OPTIONS}
                      />
                    </Field>

                    <Field label="Язык">
                      <Select
                        label="Язык"
                        value={language}
                        onChange={setLanguage}
                        options={LANGUAGE_OPTIONS}
                      />
                    </Field>
                  </div>

                  <Field
                    label="Описание"
                    hint="Расскажите о содержании, истории и ценности книги"
                  >
                    <textarea
                      name="description"
                      rows={4}
                      maxLength={2000}
                      placeholder="Краткое описание книги..."
                      className={textareaCls}
                    />
                  </Field>

                  <Field label="Теги" hint="Через запятую: Кавказ, XIX век, этнография">
                    <input
                      name="tags"
                      type="text"
                      maxLength={500}
                      placeholder="Тег 1, Тег 2, Тег 3"
                      className={inputCls}
                    />
                  </Field>
                </div>

                {/* ── Издание ── */}
                <div className="bg-surface border border-surface2 rounded-2xl p-6 flex flex-col gap-5">
                  <h2 className="text-[11px] font-medium tracking-[2px] uppercase text-accent">
                    Сведения об издании
                  </h2>

                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Издательство">
                      <input
                        name="publisher_name"
                        type="text"
                        maxLength={200}
                        placeholder="Тип. Деп. уделов"
                        className={inputCls}
                      />
                    </Field>
                    <Field label="Город издания">
                      <input
                        name="publisher_city"
                        type="text"
                        maxLength={100}
                        placeholder="Санкт-Петербург"
                        className={inputCls}
                      />
                    </Field>
                  </div>

                  <Field label="Издание / выпуск">
                    <input
                      name="edition"
                      type="text"
                      maxLength={100}
                      placeholder="1-е издание"
                      className={inputCls}
                    />
                  </Field>
                </div>

                {/* ── Продажа ── */}
                <div className="bg-surface border border-surface2 rounded-2xl p-6 flex flex-col gap-5">
                  <h2 className="text-[11px] font-medium tracking-[2px] uppercase text-accent">
                    Продажа
                  </h2>

                  <Field label="Тип цены" required>
                    <div className="flex gap-2">
                      {(
                        [
                          { value: 'fixed', label: 'Фиксированная' },
                          { value: 'negotiable', label: 'Договорная' },
                          { value: 'exchange', label: 'Обмен' },
                        ] as const
                      ).map(({ value, label }) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setPriceType(value)}
                          className={cn(
                            'flex-1 h-10 rounded-xl text-sm font-medium border transition-all cursor-pointer',
                            priceType === value
                              ? 'bg-accent text-bg border-accent'
                              : 'bg-bg border-surface2 text-ash hover:border-surface3',
                          )}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </Field>

                  {priceType === 'fixed' && (
                    <Field label="Цена (₽)" required>
                      <input
                        name="price"
                        type="number"
                        min={0}
                        max={9999999}
                        step={50}
                        required
                        placeholder="1500"
                        className={inputCls}
                      />
                    </Field>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Состояние" required>
                      <Select
                        label="Состояние"
                        value={condition}
                        onChange={(v) => setCondition(v as BookCondition)}
                        options={CONDITION_OPTIONS}
                      />
                    </Field>

                    <Field label="Количество экземпляров">
                      <input
                        name="copies_total"
                        type="number"
                        min={1}
                        max={99}
                        defaultValue={1}
                        className={inputCls}
                      />
                    </Field>
                  </div>
                </div>

                {/* ── Фотографии ── */}
                <div className="bg-surface border border-surface2 rounded-2xl p-6 flex flex-col gap-5">
                  <h2 className="text-[11px] font-medium tracking-[2px] uppercase text-accent">
                    Фотографии
                  </h2>

                  <Field
                    label="Обложка"
                    hint="Главное фото книги — первым в карточке. JPEG, PNG или WebP до 5 МБ"
                  >
                    <Dropzone {...coverUpload}>
                      <DropzoneEmptyState />
                      <DropzoneContent />
                    </Dropzone>
                  </Field>

                  <Field
                    label="Дополнительные фото"
                    hint="Фото разворотов, штампов, состояния переплёта. До 9 файлов"
                  >
                    <Dropzone {...imagesUpload}>
                      <DropzoneEmptyState />
                      <DropzoneContent />
                    </Dropzone>
                  </Field>
                </div>

                {/* ── Error ── */}
                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                  </div>
                )}

                {/* ── Submit ── */}
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
                    disabled={submitting}
                    className="h-11 px-8 rounded-xl text-sm font-medium bg-accent text-bg border border-accent hover:bg-accent2 hover:border-accent2 shadow-accent-sm hover:shadow-accent transition-all cursor-pointer disabled:opacity-60 disabled:cursor-wait"
                  >
                    {submitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full border-2 border-bg/30 border-t-bg animate-spin" />
                        Публикуем...
                      </span>
                    ) : (
                      'Добавить книгу'
                    )}
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

AddBookForm.displayName = 'AddBookForm'
