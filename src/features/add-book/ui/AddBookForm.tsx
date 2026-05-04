'use client'

import { memo, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '@/shared/lib/supabase/client'
import { useAddBookStore } from '@/shared/store'
import { addBookAction } from '../actions/addBook.action'
import { submitEbookAction } from '@/features/ebooks/actions/submitEbook.action'
import { addPhysicalBookSchema } from '@/shared/lib/zod/schemas'
import { useSupabaseUpload } from '@/shared/hooks/useSupabaseUpload'
import { Container } from '@/shared/ui/Container'
import { BookTypeToggle } from './BookTypeToggle'
import { BasicInfoSection } from './sections/BasicInfoSection'
import { PublicationSection } from './sections/PublicationSection'
import { SaleSection } from './sections/SaleSection'
import { PhotosSection } from './sections/PhotosSection'
import { EbookUploadSection } from './sections/EbookUploadSection'
import { CopyrightSection } from './sections/CopyrightSection'
import type { AddPhysicalBookValues } from '@/shared/lib/zod/schemas'
import type { BookCategory } from '@/entities/book/model/types'
import type { BookType } from './BookTypeToggle'

export const AddBookForm = memo<{ initialBookType?: BookType }>(
  ({ initialBookType = 'physical' }) => {
    const router = useRouter()

    // ── Zustand (персистентный черновик) ──────────────────────────────────────
    const {
      bookType,
      setBookType,
      values: draftValues,
      setValues: saveDraft,
      copyrightType,
      setCopyrightType,
      reset: resetDraft,
    } = useAddBookStore()

    // ── RHF ───────────────────────────────────────────────────────────────────
    const form = useForm<AddPhysicalBookValues>({
      resolver: zodResolver(addPhysicalBookSchema),
      defaultValues: {
        title: '',
        author: '',
        year: '',
        pages: '',
        description: '',
        tags: '',
        price: '',
        copies: '1',
        publisherName: '',
        publisherCity: '',
        edition: '',
        language: 'Русский',
        priceType: 'fixed',
        condition: 'good',
        category: '',
        ...draftValues, // восстанавливаем черновик из Zustand
      },
    })

    const {
      handleSubmit,
      watch,
      formState: { isSubmitting },
    } = form

    // ── Синхронизируем RHF → Zustand при каждом изменении ────────────────────
    const watchedValues = watch()
    useEffect(() => {
      saveDraft(watchedValues)
    }, [JSON.stringify(watchedValues)]) // eslint-disable-line react-hooks/exhaustive-deps

    // ── Ebook state (файл не персистируем — он File object) ───────────────────
    const [ebookFile, setEbookFile] = useState<File | null>(null)
    const [ebookFileError, setEbookFileError] = useState<string | null>(null)
    const [copyrightConfirmed, setCopyrightConfirmed] = useState(false)
    const [copyrightError, setCopyrightError] = useState<string | null>(null)
    const [submitError, setSubmitError] = useState<string | null>(null)

    // ── Uploads ───────────────────────────────────────────────────────────────
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

    // Инициализируем bookType из initialBookType только при первом маунте
    useEffect(() => {
      if (bookType === 'physical' && initialBookType !== 'physical') {
        setBookType(initialBookType)
      }
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    function handleBookTypeChange(type: BookType) {
      setBookType(type)
      setSubmitError(null)
      setEbookFileError(null)
      setCopyrightError(null)
    }

    async function onSubmit(data: AddPhysicalBookValues) {
      setSubmitError(null)

      if (bookType === 'ebook') {
        if (!ebookFile) {
          setEbookFileError('Загрузите файл книги')
          return
        }
        if (!copyrightConfirmed) {
          setCopyrightError('Подтвердите права на распространение')
          return
        }
      }

      try {
        if (bookType === 'physical') {
          let coverUrl = ''
          let imageUrls: string[] = []
          if (coverUpload.files.some((f) => f.errors.length === 0))
            coverUrl = (await coverUpload.onUpload())[0] ?? ''
          if (imagesUpload.files.some((f) => f.errors.length === 0))
            imageUrls = await imagesUpload.onUpload()

          await addBookAction({
            title: data.title,
            author: data.author,
            year: parseInt(data.year, 10),
            category: data.category as BookCategory,
            description: data.description ?? '',
            pages: data.pages ? parseInt(data.pages, 10) : null,
            language: data.language ?? 'Русский',
            price: data.price ? parseFloat(data.price) : null,
            currency: 'RUB',
            priceType: data.priceType ?? 'fixed',
            condition: data.condition ?? 'good',
            edition: data.edition ?? '',
            publisherName: data.publisherName ?? '',
            publisherCity: data.publisherCity ?? '',
            tags: data.tags ?? '',
            coverUrl,
            imageUrls,
            copiesTotal: parseInt(data.copies ?? '1', 10),
          })
        } else {
          const supabase = createClient()
          const ext = ebookFile!.name.split('.').pop()?.toLowerCase() ?? 'pdf'
          const ebookId = crypto.randomUUID()
          const storagePath = `user-uploads/${ebookId}.${ext}`

          const { error: uploadError } = await supabase.storage
            .from('ebooks')
            .upload(storagePath, ebookFile!, {
              contentType: ebookFile!.type,
              upsert: false,
            })

          if (uploadError)
            throw new Error(`Ошибка загрузки файла: ${uploadError.message}`)

          await submitEbookAction({
            title: data.title,
            author: data.author,
            year: data.year ? parseInt(data.year, 10) : null,
            category: data.category as BookCategory,
            description: data.description ?? '',
            copyrightType,
            storagePath,
            fileName: ebookFile!.name,
            fileType: ebookFile!.type,
            fileSize: ebookFile!.size,
          })
        }

        resetDraft()
      } catch (err) {
        setSubmitError(err instanceof Error ? err.message : 'Что-то пошло не так')
      }
    }

    return (
      <main id="main-content">
        <section className="py-12">
          <Container>
            <div className="max-w-2xl mx-auto">
              <header className="mb-10">
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
                  Поля отмеченные <span className="text-red-400">*</span> обязательны.
                </p>
              </header>

              <form
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                className="flex flex-col gap-8"
              >
                <BookTypeToggle value={bookType} onChange={handleBookTypeChange} />

                <BasicInfoSection form={form} />
                <PublicationSection form={form} />

                {bookType === 'physical' && <SaleSection form={form} />}

                {bookType === 'physical' ? (
                  <PhotosSection coverUpload={coverUpload} imagesUpload={imagesUpload} />
                ) : (
                  <>
                    <EbookUploadSection
                      file={ebookFile}
                      onFile={(f) => {
                        setEbookFile(f)
                        setEbookFileError(null)
                      }}
                      error={ebookFileError ?? undefined}
                    />
                    <CopyrightSection
                      value={copyrightType}
                      confirmed={copyrightConfirmed}
                      onChange={setCopyrightType}
                      onConfirm={(v) => {
                        setCopyrightConfirmed(v)
                        setCopyrightError(null)
                      }}
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
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="h-11 px-6 rounded-xl text-sm font-medium border border-surface2 text-ash hover:text-ink hover:bg-surface transition-all cursor-pointer"
                  >
                    Отмена
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-11 px-8 rounded-xl text-sm font-medium bg-accent text-bg border border-accent hover:bg-accent2 shadow-accent-sm hover:shadow-accent transition-all cursor-pointer disabled:opacity-60 disabled:cursor-wait"
                  >
                    {isSubmitting
                      ? bookType === 'ebook'
                        ? 'Загрузка...'
                        : 'Сохранение...'
                      : bookType === 'ebook'
                        ? 'Отправить на проверку'
                        : 'Добавить книгу'}
                  </button>
                </div>
              </form>
            </div>
          </Container>
        </section>
      </main>
    )
  },
)

AddBookForm.displayName = 'AddBookForm'
