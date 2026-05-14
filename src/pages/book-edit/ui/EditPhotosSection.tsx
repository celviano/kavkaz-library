'use client'

import { memo } from 'react'
import Image from 'next/image'

import type { useSupabaseUpload } from '@/shared/hooks/useSupabaseUpload'
import { cn } from '@/shared/lib/cn'
import { Dropzone, DropzoneContent, DropzoneEmptyState } from '@/shared/ui/Dropzone'
import { FormField } from '@/shared/ui/FormField'

import { FormSection } from '@/features/add-book/ui/FormSection'

interface EditPhotosSectionProps {
  existingCoverUrl: string | null
  existingImages: string[]
  coverDeleted: boolean
  deletedImageUrls: Set<string>
  onDeleteCover: () => void
  onDeleteImage: (url: string) => void
  coverUpload: ReturnType<typeof useSupabaseUpload>
  imagesUpload: ReturnType<typeof useSupabaseUpload>
}

function XIcon() {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

export const EditPhotosSection = memo<EditPhotosSectionProps>(
  ({
    existingCoverUrl,
    existingImages,
    coverDeleted,
    deletedImageUrls,
    onDeleteCover,
    onDeleteImage,
    coverUpload,
    imagesUpload,
  }) => {
    const visibleImages = existingImages.filter((url) => !deletedImageUrls.has(url))
    const remainingSlots = 9 - visibleImages.length

    const showCoverUpload = coverDeleted || !existingCoverUrl || coverUpload.files.length > 0

    return (
      <FormSection title="Фотографии">
        {/* Cover */}
        <FormField label="Обложка" hint="Главное фото книги. JPEG, PNG или WebP до 5 МБ">
          {existingCoverUrl && !coverDeleted && coverUpload.files.length === 0 ? (
            <div className="flex items-start gap-4">
              <div className="relative group w-28 h-36 rounded-xl overflow-hidden border border-surface2 shrink-0">
                <Image
                  src={existingCoverUrl}
                  alt="Обложка"
                  fill
                  sizes="112px"
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={onDeleteCover}
                  className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-ink/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  aria-label="Удалить обложку"
                >
                  <XIcon />
                </button>
              </div>
              <p className="text-xs text-ash mt-1">
                Наведите курсор на фото, чтобы удалить. Удалите, чтобы загрузить другую.
              </p>
            </div>
          ) : (
            <Dropzone {...coverUpload}>
              <DropzoneEmptyState />
              <DropzoneContent />
            </Dropzone>
          )}
        </FormField>

        {/* Additional images */}
        <FormField
          label="Дополнительные фото"
          hint={`Фото разворотов, состояния переплёта. Максимум 9 фото`}
        >
          <div className="flex flex-col gap-3">
            {visibleImages.length > 0 && (
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                {visibleImages.map((url) => (
                  <div
                    key={url}
                    className="relative group aspect-square rounded-xl overflow-hidden border border-surface2"
                  >
                    <Image src={url} alt="" fill sizes="96px" className="object-cover" />
                    <button
                      type="button"
                      onClick={() => onDeleteImage(url)}
                      className={cn(
                        'absolute top-1 right-1 w-5 h-5 rounded-full',
                        'bg-ink/70 text-white flex items-center justify-center',
                        'opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer',
                      )}
                      aria-label="Удалить фото"
                    >
                      <XIcon />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {remainingSlots > 0 && (
              <Dropzone
                {...imagesUpload}
                key={`images-${remainingSlots}`}
              >
                <DropzoneEmptyState />
                <DropzoneContent />
              </Dropzone>
            )}

            {remainingSlots === 0 && (
              <p className="text-xs text-dim">
                Достигнуто максимальное количество фото (9). Удалите одно, чтобы добавить новое.
              </p>
            )}
          </div>
        </FormField>
      </FormSection>
    )
  },
)

EditPhotosSection.displayName = 'EditPhotosSection'
