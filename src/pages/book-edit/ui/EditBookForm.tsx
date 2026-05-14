'use client'

import { memo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'

import type { Book, BookCategory } from '@/entities/book/model/types'
import type { Ebook } from '@/entities/ebook/model/types'
import type { CopyrightType } from '@/entities/ebook/model/types'
import { updateEbookAction } from '@/features/add-book/actions/updateEbook.action'
import { updateBookAction } from '@/features/add-book/actions/updateBook.action'
import { BasicInfoSection } from '@/features/add-book/ui/sections/BasicInfoSection'
import { PublicationSection } from '@/features/add-book/ui/sections/PublicationSection'
import { SaleSection } from '@/features/add-book/ui/sections/SaleSection'
import { useSupabaseUpload } from '@/shared/hooks/useSupabaseUpload'
import { createClient } from '@/shared/lib/supabase/client'
import type { AddPhysicalBookValues } from '@/shared/lib/zod/schemas'
import { addPhysicalBookSchema } from '@/shared/lib/zod/schemas'
import { Container } from '@/shared/ui/Container'
import { ErrorBanner } from '@/shared/ui/ErrorBanner'
import { zodResolver } from '@hookform/resolvers/zod'

import { EditEbookFilesSection } from './EditEbookFilesSection'
import { EditPhotosSection } from './EditPhotosSection'
import { EditCopyrightSection } from './EditCopyrightSection'

interface EditBookFormProps {
  book: Book
  ebook: Ebook | null
}

export const EditBookForm = memo<EditBookFormProps>(({ book, ebook }) => {
  const router = useRouter()

  // ── Image state (physical) ────────────────────────────────────────────────
  const [coverDeleted, setCoverDeleted] = useState(false)
  const [deletedImageUrls, setDeletedImageUrls] = useState<Set<string>>(new Set())

  // ── Ebook state ───────────────────────────────────────────────────────────
  const [copyrightType, setCopyrightType] = useState<CopyrightType>(
    ebook?.copyrightType ?? 'public_domain',
  )
  const [newEbookFile, setNewEbookFile] = useState<File | null>(null)
  const [replaceFile, setReplaceFile] = useState(false)

  const [submitError, setSubmitError] = useState<string | null>(null)

  // ── RHF pre-filled ────────────────────────────────────────────────────────
  const form = useForm<AddPhysicalBookValues>({
    resolver: zodResolver(addPhysicalBookSchema),
    defaultValues: {
      title: book.title,
      author: book.author,
      year: String(book.year),
      pages: book.pages ? String(book.pages) : '',
      description: book.description,
      tags: book.tags.join(', '),
      price: book.price != null ? String(book.price) : '',
      copies: String(book.copiesTotal || 1),
      publisherName: book.publisherName ?? '',
      publisherCity: book.publisherCity ?? '',
      edition: book.edition ?? '',
      language: book.language,
      priceType: book.priceType ?? 'fixed',
      condition: book.condition ?? 'good',
      category: book.category,
    },
  })

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form

  // ── Uploads ───────────────────────────────────────────────────────────────
  const visibleExistingImages = book.images.filter((url) => !deletedImageUrls.has(url))
  const maxNewImages = Math.max(0, 9 - visibleExistingImages.length)

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
    maxFiles: maxNewImages || 1,
    maxFileSize: 5 * 1024 * 1024,
  })

  // ── Handlers ──────────────────────────────────────────────────────────────
  function handleDeleteImage(url: string) {
    setDeletedImageUrls((prev) => new Set([...prev, url]))
  }

  // ── Submit ────────────────────────────────────────────────────────────────
  async function onSubmit(data: AddPhysicalBookValues) {
    setSubmitError(null)
    try {
      if (book.bookType === 'physical') {
        await handlePhysicalSubmit(data)
      } else {
        await handleEbookSubmit(data)
      }
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Что-то пошло не так')
    }
  }

  async function handlePhysicalSubmit(data: AddPhysicalBookValues) {
    const urlsToDelete: string[] = []
    if (coverDeleted && book.coverUrl) urlsToDelete.push(book.coverUrl)
    deletedImageUrls.forEach((url) => urlsToDelete.push(url))

    let finalCoverUrl = coverDeleted ? null : (book.coverUrl ?? null)
    if (coverUpload.files.some((f) => f.errors.length === 0)) {
      const [newUrl] = await coverUpload.onUpload()
      if (newUrl) finalCoverUrl = newUrl
    }

    const remainingImages = book.images.filter((url) => !deletedImageUrls.has(url))
    let newImageUrls: string[] = []
    if (imagesUpload.files.some((f) => f.errors.length === 0)) {
      newImageUrls = await imagesUpload.onUpload()
    }

    await updateBookAction(book.id, {
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
      coverUrl: finalCoverUrl,
      imageUrls: [...remainingImages, ...newImageUrls],
      urlsToDelete,
      copiesTotal: parseInt(data.copies ?? '1', 10),
    })
  }

  async function handleEbookSubmit(data: AddPhysicalBookValues) {
    if (!ebook) return

    const coverUrlToDelete =
      coverDeleted && ebook.coverUrl
        ? ebook.coverUrl
        : coverUpload.files.length > 0 && ebook.coverUrl
          ? ebook.coverUrl
          : null

    let finalCoverUrl = coverDeleted ? null : (ebook.coverUrl ?? null)
    if (coverUpload.files.some((f) => f.errors.length === 0)) {
      const [newUrl] = await coverUpload.onUpload()
      if (newUrl) finalCoverUrl = newUrl
    }

    let newFilePath: string | null = null
    let newFileName: string | null = null
    let newFileType: string | null = null
    let newFileSize: number | null = null

    if (replaceFile && newEbookFile) {
      const supabase = createClient()
      const ext = newEbookFile.name.split('.').pop()?.toLowerCase() ?? 'pdf'
      const fileId = crypto.randomUUID()
      const storagePath = `user-uploads/${fileId}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('ebooks')
        .upload(storagePath, newEbookFile, { contentType: newEbookFile.type, upsert: false })

      if (uploadError) throw new Error(`Ошибка загрузки файла: ${uploadError.message}`)

      newFilePath = storagePath
      newFileName = newEbookFile.name
      newFileType = newEbookFile.type
      newFileSize = newEbookFile.size
    }

    await updateEbookAction(ebook.id, {
      title: data.title,
      author: data.author,
      year: data.year ? parseInt(data.year, 10) : null,
      category: data.category as BookCategory,
      description: data.description ?? '',
      pages: data.pages ? parseInt(data.pages, 10) : null,
      language: data.language ?? 'Русский',
      publisherName: data.publisherName ?? '',
      publisherCity: data.publisherCity ?? '',
      edition: data.edition ?? '',
      tags: data.tags ?? '',
      copyrightType,
      coverUrl: finalCoverUrl,
      coverUrlToDelete,
      newFilePath,
      newFileName,
      newFileType,
      newFileSize,
      oldFilePath: ebook.fileUrl,
    })
  }

  const isEbook = book.bookType === 'ebook'

  return (
    <main id="main-content">
      <section className="py-12">
        <Container>
          <div className="max-w-2xl mx-auto">
            <header className="mb-10">
              <p className="text-[11px] font-medium tracking-[2px] uppercase text-accent mb-2">
                Редактирование
              </p>
              <h1
                className="font-display font-semibold text-ink leading-tight mb-2"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
                }}
              >
                {book.title}
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
              <BasicInfoSection form={form} />
              <PublicationSection form={form} />

              {!isEbook && <SaleSection form={form} />}

              {!isEbook ? (
                <EditPhotosSection
                  existingCoverUrl={book.coverUrl}
                  existingImages={book.images}
                  coverDeleted={coverDeleted}
                  deletedImageUrls={deletedImageUrls}
                  onDeleteCover={() => setCoverDeleted(true)}
                  onDeleteImage={handleDeleteImage}
                  coverUpload={coverUpload}
                  imagesUpload={imagesUpload}
                />
              ) : (
                <>
                  <EditEbookFilesSection
                    ebook={ebook!}
                    coverDeleted={coverDeleted}
                    onDeleteCover={() => setCoverDeleted(true)}
                    coverUpload={coverUpload}
                    newFile={newEbookFile}
                    replaceFile={replaceFile}
                    onReplaceFile={(f) => {
                      setNewEbookFile(f)
                      if (!f) setReplaceFile(false)
                    }}
                    onToggleReplace={() => setReplaceFile((v) => !v)}
                  />
                  <EditCopyrightSection
                    value={copyrightType}
                    onChange={setCopyrightType}
                  />
                </>
              )}

              {submitError && <ErrorBanner message={submitError} />}

              <div className="flex gap-3 justify-end pb-8">
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
                  {isSubmitting ? 'Сохранение...' : 'Сохранить изменения'}
                </button>
              </div>
            </form>
          </div>
        </Container>
      </section>
    </main>
  )
})

EditBookForm.displayName = 'EditBookForm'
