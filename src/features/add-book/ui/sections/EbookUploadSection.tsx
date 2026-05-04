'use client'

import { memo, useCallback, useState } from 'react'
import { useDropzone, FileRejection } from 'react-dropzone'
import { cn } from '@/shared/lib/cn'
import { FormSection } from '../FormSection'
import { FormField } from '@/shared/ui/FormField'
import {
  ALLOWED_EBOOK_FORMATS,
  MAX_EBOOK_SIZE,
  formatFileSize,
  getFormatFromFile,
  EBOOK_FORMAT_LABELS,
} from '@/entities/ebook/model/types'
import type { EbookFormat } from '@/entities/ebook/model/types'

interface EbookUploadSectionProps {
  file:     File | null
  onFile:   (file: File | null) => void
  error?:   string
}

const ACCEPT = {
  'application/pdf':               ['.pdf'],
  'application/epub+zip':          ['.epub'],
  'image/vnd.djvu':                ['.djvu'],
  'text/plain':                    ['.txt'],
  'application/x-mobipocket-ebook':['.mobi'],
}

const FORMAT_ICONS: Record<EbookFormat, string> = {
  pdf:  '📄',
  epub: '📖',
  djvu: '🗒️',
  txt:  '📝',
  mobi: '📱',
}

export const EbookUploadSection = memo<EbookUploadSectionProps>(({ file, onFile, error }) => {
  const [sizeError, setSizeError] = useState<string | null>(null)

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[]) => {
    setSizeError(null)
    if (fileRejections.length > 0) {
      const err = fileRejections[0].errors[0]?.message
      setSizeError(err ?? 'Неподдерживаемый файл')
      return
    }
    if (acceptedFiles[0]) {
      onFile(acceptedFiles[0])
    }
  }, [onFile])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept:   ACCEPT,
    maxFiles: 1,
    maxSize:  MAX_EBOOK_SIZE,
  })

  const format  = file ? getFormatFromFile(file) : null
  const hasFile = Boolean(file)
  const displayError = error ?? sizeError

  return (
    <FormSection title="Файл книги">
      <FormField
        label="Загрузить файл"
        hint={`PDF, EPUB, DjVu, TXT, MOBI — не более ${formatFileSize(MAX_EBOOK_SIZE)}`}
        required
      >
        <div
          {...getRootProps({
            className: cn(
              'border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer outline-none',
              'bg-surface border-surface3',
              'hover:border-accent/50 hover:bg-accent/3',
              isDragActive && 'border-accent bg-accent/6 scale-[1.01]',
              displayError && 'border-red-400/60 bg-red-50/30',
              hasFile && 'border-solid border-accent/40 bg-accent/4',
            ),
          })}
        >
          <input {...getInputProps()} />

          {!hasFile ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-surface2 border border-surface3 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7D7060" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-ink mb-1">
                  {isDragActive ? 'Отпустите файл здесь' : 'Перетащите файл или нажмите для выбора'}
                </p>
                <p className="text-xs text-ash">
                  {ALLOWED_EBOOK_FORMATS.map(f => EBOOK_FORMAT_LABELS[f]).join(', ')} · до {formatFileSize(MAX_EBOOK_SIZE)}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-2xl flex-shrink-0">
                {format ? FORMAT_ICONS[format] : '📄'}
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="text-sm font-medium text-ink truncate">{file!.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  {format && (
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">
                      {EBOOK_FORMAT_LABELS[format]}
                    </span>
                  )}
                  <span className="text-xs text-ash">{formatFileSize(file!.size)}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onFile(null) }}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-ash hover:text-red-500 hover:bg-red-50 transition-all flex-shrink-0"
                aria-label="Удалить файл"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
          )}
        </div>

        {displayError && (
          <p className="text-xs text-red-500 mt-1.5">{displayError}</p>
        )}
      </FormField>
    </FormSection>
  )
})

EbookUploadSection.displayName = 'EbookUploadSection'
