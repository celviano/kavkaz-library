'use client'

import { memo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useFormValidation } from '@/shared/hooks/useFormValidation'
import { useSupabaseUpload } from '@/shared/hooks/useSupabaseUpload'
import { addBookAction } from '../actions/addBook.action'
import { submitEbookAction } from '@/features/ebooks/actions/submitEbook.action'
import { addBookRules } from '../model/validation'
import { ADD_BOOK_INITIAL_VALUES, ADD_BOOK_INITIAL_SELECTS } from '../model/types'
import { Container } from '@/shared/ui/Container'
import { BookTypeToggle } from './BookTypeToggle'
import { BasicInfoSection } from './sections/BasicInfoSection'
import { PublicationSection } from './sections/PublicationSection'
import { SaleSection } from './sections/SaleSection'
import { PhotosSection } from './sections/PhotosSection'
import { EbookUploadSection } from './sections/EbookUploadSection'
import { CopyrightSection } from './sections/CopyrightSection'
import type { AddBookValues, AddBookSelects } from '../model/types'
import type { BookCategory } from '@/entities/book/model/types'
import type { BookType } from './BookTypeToggle'
import type { CopyrightType } from '@/entities/ebook/model/types'

export const AddBookForm = memo<{ initialBookType?: 'physical' | 'ebook' }>(({ initialBookType = 'physical' }) => {
  const router = useRouter()

  const [bookType, setBookType] = useState<BookType>(initialBookType)

  const [values,  setValues]  = useState<AddBookValues>(ADD_BOOK_INITIAL_VALUES)
  const [selects, setSelects] = useState<AddBookSelects>(ADD_BOOK_INITIAL_SELECTS)
  const [submitting,    setSubmitting]    = useState(false)
  const [submitError,   setSubmitError]   = useState<string | null>(null)
  const [categoryError, setCategoryError] = useState<string | null>(null)

  const [ebookFile,          setEbookFile]          = useState<File | null>(null)
  const [ebookFileError,     setEbookFileError]     = useState<string | null>(null)
  const [copyrightType,      setCopyrightType]      = useState<CopyrightType>('public_domain')
  const [copyrightConfirmed, setCopyrightConfirmed] = useState(false)
  const [copyrightError,     setCopyrightError]     = useState<string | null>(null)

  const { getFieldError, touchField, validateAll } = useFormValidation<AddBookValues>({
    rules: {
      title:       addBookRules.title,
      author:      addBookRules.author,
      year:        addBookRules.year,
      pages:       addBookRules.pages,
      price:       bookType === 'physical' && selects.priceType === 'fixed' ? addBookRules.price : [],
      copies:      bookType === 'physical' ? addBookRules.copies : [],
      tags:        addBookRules.tags,
      description: addBookRules.description,
    },
  })

  const coverUpload = useSupabaseUpload({
    bucketName: 'book-covers', path: 'user-uploads',
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxFiles: 1, maxFileSize: 5 * 1024 * 1024,
  })

  const imagesUpload = useSupabaseUpload({
    bucketName: 'book-images', path: 'user-uploads',
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxFiles: 9, maxFileSize: 5 * 1024 * 1024,
  })

  function handleChange(field: keyof AddBookValues, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }))
    touchField(field, value)
  }

  function handleSelectChange<K extends keyof AddBookSelects>(field: K, value: AddBookSelects[K]) {
    setSelects((prev) => ({ ...prev, [field]: value }))
    if (field === 'category') setCategoryError(null)
  }

  function handleBookTypeChange(type: BookType) {
    setBookType(type)
    setSubmitError(null)
    setEbookFileError(null)
    setCopyrightError(null)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitError(null)

    if (!selects.category) { setCategoryError('Выберите категорию'); return }
    if (!validateAll(values)) return

    if (bookType === 'ebook') {
      if (!ebookFile) { setEbookFileError('Загрузите файл книги'); return }
      if (!copyrightConfirmed) { setCopyrightError('Подтвердите права на распространение'); return }
    }

    setSubmitting(true)

    try {
      if (bookType === 'physical') {
        let coverUrl   = ''
        let imageUrls: string[] = []
        if (coverUpload.files.some((f) => f.errors.length === 0))  coverUrl  = (await coverUpload.onUpload())[0]  ?? ''
        if (imagesUpload.files.some((f) => f.errors.length === 0)) imageUrls = await imagesUpload.onUpload()

        await addBookAction({
          title: values.title, author: values.author, year: parseInt(values.year, 10),
          category: selects.category as BookCategory, description: values.description,
          pages: values.pages ? parseInt(values.pages, 10) : null, language: selects.language,
          price: values.price ? parseFloat(values.price) : null, currency: 'RUB',
          priceType: selects.priceType, condition: selects.condition, edition: values.edition,
          publisherName: values.publisherName, publisherCity: values.publisherCity,
          tags: values.tags, coverUrl, imageUrls,
          copiesTotal: parseInt(values.copies || '1', 10),
        })
      } else {
        const fileBase64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload  = () => resolve(reader.result as string)
          reader.onerror = () => reject(new Error('Ошибка чтения файла'))
          reader.readAsDataURL(ebookFile!)
        })

        await submitEbookAction({
          title: values.title, author: values.author,
          year: values.year ? parseInt(values.year, 10) : null,
          category: selects.category as BookCategory, description: values.description,
          copyrightType, fileBase64, fileName: ebookFile!.name,
          fileType: ebookFile!.type, fileSize: ebookFile!.size,
        })
      }
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Что-то пошло не так')
      setSubmitting(false)
    }
  }

  return (
    <main id="main-content">
      <section className="py-12">
        <Container>
          <div className="max-w-2xl mx-auto">
            <header className="mb-10">
              <p className="text-[11px] font-medium tracking-[2px] uppercase text-accent mb-2">Каталог</p>
              <h1
                className="font-display font-semibold text-ink leading-tight mb-2"
                style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)' }}
              >
                Добавить книгу
              </h1>
              <p className="text-ash text-sm">
                Поля отмеченные <span className="text-red-400">*</span> обязательны.
              </p>
            </header>

            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-8">

              <BookTypeToggle value={bookType} onChange={handleBookTypeChange} />

              <BasicInfoSection
                values={values} selects={selects} getError={getFieldError}
                onChange={handleChange} onSelect={handleSelectChange}
                categoryError={categoryError}
              />

              <PublicationSection values={values} onChange={handleChange} />

              {bookType === 'physical' && (
                <SaleSection
                  values={values} selects={selects} getError={getFieldError}
                  onChange={handleChange} onSelect={handleSelectChange}
                />
              )}

              {bookType === 'physical' ? (
                <PhotosSection coverUpload={coverUpload} imagesUpload={imagesUpload} />
              ) : (
                <>
                  <EbookUploadSection
                    file={ebookFile}
                    onFile={(f) => { setEbookFile(f); setEbookFileError(null) }}
                    error={ebookFileError ?? undefined}
                  />
                  <CopyrightSection
                    value={copyrightType}
                    confirmed={copyrightConfirmed}
                    onChange={setCopyrightType}
                    onConfirm={(v) => { setCopyrightConfirmed(v); setCopyrightError(null) }}
                    error={copyrightError ?? undefined}
                  />
                </>
              )}

              {submitError && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {submitError}
                </div>
              )}

              <div className="flex gap-3 justify-end">
                <button type="button" onClick={() => router.back()}
                  className="h-11 px-6 rounded-xl text-sm font-medium border border-surface2 text-ash hover:text-ink hover:bg-surface transition-all cursor-pointer">
                  Отмена
                </button>
                <button type="submit" disabled={submitting}
                  className="h-11 px-8 rounded-xl text-sm font-medium bg-accent text-bg border border-accent hover:bg-accent2 shadow-accent-sm hover:shadow-accent transition-all cursor-pointer disabled:opacity-60 disabled:cursor-wait">
                  {submitting
                    ? (bookType === 'ebook' ? 'Загрузка...' : 'Сохранение...')
                    : (bookType === 'ebook' ? 'Отправить на проверку' : 'Добавить книгу')}
                </button>
              </div>
            </form>
          </div>
        </Container>
      </section>
    </main>
  )
})

AddBookForm.displayName = 'AddBookForm'
