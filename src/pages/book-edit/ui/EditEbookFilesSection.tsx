'use client'

import { memo, useCallback, useState } from 'react'
import Image from 'next/image'
import { FileRejection, useDropzone } from 'react-dropzone'

import type { Ebook } from '@/entities/ebook/model/types'
import type { EbookFormat } from '@/entities/ebook/model/types'
import {
  ALLOWED_EBOOK_FORMATS,
  EBOOK_FORMAT_LABELS,
  formatFileSize,
  getFormatFromFile,
  MAX_EBOOK_SIZE,
} from '@/entities/ebook/model/types'
import { FormSection } from '@/features/add-book/ui/FormSection'
import type { useSupabaseUpload } from '@/shared/hooks/useSupabaseUpload'
import { cn } from '@/shared/lib/cn'
import { Dropzone, DropzoneContent, DropzoneEmptyState } from '@/shared/ui/Dropzone'
import { FormField } from '@/shared/ui/FormField'

const ACCEPT = {
  'application/pdf': ['.pdf'],
  'application/epub+zip': ['.epub'],
  'image/vnd.djvu': ['.djvu'],
  'text/plain': ['.txt'],
  'application/x-mobipocket-ebook': ['.mobi'],
}

const FORMAT_ICONS: Record<EbookFormat, string> = {
  pdf: '📄',
  epub: '📖',
  djvu: '🗒️',
  txt: '📝',
  mobi: '📱',
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

interface EditEbookFilesSectionProps {
  ebook: Ebook
  coverDeleted: boolean
  onDeleteCover: () => void
  coverUpload: ReturnType<typeof useSupabaseUpload>
  newFile: File | null
  replaceFile: boolean
  onReplaceFile: (file: File | null) => void
  onToggleReplace: () => void
}

export const EditEbookFilesSection = memo<EditEbookFilesSectionProps>(
  ({
    ebook,
    coverDeleted,
    onDeleteCover,
    coverUpload,
    newFile,
    replaceFile,
    onReplaceFile,
    onToggleReplace,
  }) => {
    const [sizeError, setSizeError] = useState<string | null>(null)

    const onDrop = useCallback(
      (acceptedFiles: File[], fileRejections: FileRejection[]) => {
        setSizeError(null)
        if (fileRejections.length > 0) {
          setSizeError(fileRejections[0].errors[0]?.message ?? 'Неподдерживаемый файл')
          return
        }
        if (acceptedFiles[0]) onReplaceFile(acceptedFiles[0])
      },
      [onReplaceFile],
    )

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
      accept: ACCEPT,
      maxFiles: 1,
      maxSize: MAX_EBOOK_SIZE,
    })

    const currentFormat = ebook.fileFormat as EbookFormat
    const newFormat = newFile ? getFormatFromFile(newFile) : null

    return (
      <>
        {/* Cover */}
        <FormSection title="Обложка">
          <FormField
            label="Обложка книги"
            hint="Главное фото книги. JPEG, PNG или WebP до 5 МБ"
          >
            {ebook.coverUrl && !coverDeleted && coverUpload.files.length === 0 ? (
              <div className="flex items-start gap-4">
                <div className="relative group w-28 h-36 rounded-xl overflow-hidden border border-surface2 shrink-0">
                  <Image
                    src={ebook.coverUrl}
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
        </FormSection>

        {/* File */}
        <FormSection title="Файл книги">
          <FormField
            label="Текущий файл"
            hint={`PDF, EPUB, DjVu, TXT, MOBI — не более ${formatFileSize(MAX_EBOOK_SIZE)}`}
          >
            <div className="flex flex-col gap-3">
              {/* Current file info */}
              {!replaceFile && (
                <div className="flex items-center gap-4 p-4 rounded-2xl border border-surface2 bg-surface">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-2xl shrink-0">
                    {FORMAT_ICONS[currentFormat] ?? '📄'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink truncate">
                      {ebook.fileName}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">
                        {EBOOK_FORMAT_LABELS[currentFormat]}
                      </span>
                      <span className="text-xs text-ash">
                        {formatFileSize(ebook.fileSize)}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={onToggleReplace}
                    className="h-8 px-3 rounded-lg text-xs border border-steel2/40 text-steel2 hover:bg-steel/30 hover:border-steel2/60 transition-colors cursor-pointer shrink-0"
                  >
                    Заменить
                  </button>
                </div>
              )}

              {/* New file dropzone */}
              {replaceFile && (
                <div className="flex flex-col gap-2">
                  {!newFile ? (
                    <div
                      {...getRootProps({
                        className: cn(
                          'border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer outline-none',
                          'bg-surface border-surface3',
                          'hover:border-accent/50 hover:bg-accent/3',
                          isDragActive && 'border-accent bg-accent/6 scale-[1.01]',
                          sizeError && 'border-red-400/60 bg-red-50/30',
                        ),
                      })}
                    >
                      <input {...getInputProps()} />
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-surface2 border border-surface3 flex items-center justify-center">
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#7D7060"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          >
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" y1="3" x2="12" y2="15" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-ink mb-1">
                            {isDragActive
                              ? 'Отпустите файл здесь'
                              : 'Перетащите файл или нажмите для выбора'}
                          </p>
                          <p className="text-xs text-ash">
                            {ALLOWED_EBOOK_FORMATS.map(
                              (f) => EBOOK_FORMAT_LABELS[f],
                            ).join(', ')}{' '}
                            · до {formatFileSize(MAX_EBOOK_SIZE)}
                          </p>
                        </div>
                      </div>
                      {sizeError && (
                        <p className="text-xs text-red-500 mt-2">{sizeError}</p>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-4 p-4 rounded-2xl border border-accent/30 bg-accent/4">
                      <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-2xl shrink-0">
                        {newFormat ? FORMAT_ICONS[newFormat] : '📄'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-ink truncate">
                          {newFile.name}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          {newFormat && (
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">
                              {EBOOK_FORMAT_LABELS[newFormat]}
                            </span>
                          )}
                          <span className="text-xs text-ash">
                            {formatFileSize(newFile.size)}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => onReplaceFile(null)}
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-ash hover:text-red-500 hover:bg-red-50 transition-all shrink-0"
                        aria-label="Отменить замену"
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        >
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      onReplaceFile(null)
                      onToggleReplace()
                    }}
                    className="text-xs text-ash hover:text-ink transition-colors text-left"
                  >
                    ← Оставить текущий файл
                  </button>
                </div>
              )}
            </div>
          </FormField>
        </FormSection>
      </>
    )
  },
)

EditEbookFilesSection.displayName = 'EditEbookFilesSection'
