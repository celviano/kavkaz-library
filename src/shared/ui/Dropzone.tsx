'use client'

import {
  createContext,
  useCallback,
  useContext,
  type PropsWithChildren,
} from 'react'
import Image from 'next/image'
import { cn } from '@/shared/lib/cn'
import type { UseSupabaseUploadReturn, UploadedFile } from '@/shared/hooks/useSupabaseUpload'

// ─── Helpers ────────────────────────────────────────────────────────────────

export function formatBytes(bytes: number, decimals = 2): string {
  if (!bytes) return '0 bytes'
  const k = 1024
  const sizes = ['bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`
}

// ─── Context ─────────────────────────────────────────────────────────────────

type DropzoneCtx = Omit<UseSupabaseUploadReturn, 'getRootProps' | 'getInputProps'>
const DropzoneContext = createContext<DropzoneCtx | undefined>(undefined)

function useDropzoneContext() {
  const ctx = useContext(DropzoneContext)
  if (!ctx) throw new Error('Must be used inside <Dropzone>')
  return ctx
}

// ─── Root ────────────────────────────────────────────────────────────────────

type DropzoneProps = UseSupabaseUploadReturn & { className?: string }

export function Dropzone({
  className,
  children,
  getRootProps,
  getInputProps,
  ...rest
}: PropsWithChildren<DropzoneProps>) {
  const isActive  = rest.isDragActive
  const isInvalid =
    (rest.isDragActive && rest.isDragReject) ||
    (rest.errors.length > 0 && !rest.isSuccess) ||
    rest.files.some((f) => f.errors.length > 0)

  return (
    <DropzoneContext.Provider value={rest}>
      <div
        {...getRootProps({
          className: cn(
            'border-2 border-dashed rounded-2xl p-6 text-center',
            'transition-all duration-200 outline-none cursor-pointer',
            'bg-surface border-surface3',
            'hover:border-accent/50 hover:bg-accent/3',
            isActive  && 'border-accent bg-accent/6 scale-[1.01]',
            isInvalid && 'border-red-400/60 bg-red-50/30',
            rest.isSuccess && 'border-solid border-accent/40 bg-accent/4',
            className,
          ),
        })}
      >
        <input {...getInputProps()} />
        {children}
      </div>
    </DropzoneContext.Provider>
  )
}

// ─── Empty state ─────────────────────────────────────────────────────────────

export function DropzoneEmptyState({ className }: { className?: string }) {
  const { maxFiles, maxFileSize, inputRef, isSuccess } = useDropzoneContext()
  if (isSuccess) return null

  return (
    <div className={cn('flex flex-col items-center gap-3 py-4', className)}>
      {/* Upload icon */}
      <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2a5c45" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="17 8 12 3 7 8"/>
          <line x1="12" y1="3" x2="12" y2="15"/>
        </svg>
      </div>
      <div>
        <p className="text-sm font-medium text-ink">
          Перетащите фото или{' '}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); inputRef.current?.click() }}
            className="text-accent underline underline-offset-2 hover:text-accent2 transition-colors cursor-pointer"
          >
            выберите файлы
          </button>
        </p>
        <p className="text-xs text-dim mt-1">
          {maxFiles > 1 ? `До ${maxFiles} фото` : '1 фото'} · до {formatBytes(maxFileSize, 0)}
        </p>
      </div>
    </div>
  )
}

// ─── File list ───────────────────────────────────────────────────────────────

export function DropzoneContent({ className }: { className?: string }) {
  const { files, setFiles, loading, successes, errors, maxFiles, maxFileSize, isSuccess } =
    useDropzoneContext()

  const remove = useCallback(
    (name: string) => setFiles(files.filter((f) => f.name !== name)),
    [files, setFiles],
  )

  if (isSuccess) {
    return (
      <div className={cn('flex items-center justify-center gap-2 py-2', className)}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2a5c45" strokeWidth="2" strokeLinecap="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        <span className="text-sm text-accent font-medium">
          Загружено {files.length} {files.length === 1 ? 'фото' : 'фото'}
        </span>
      </div>
    )
  }

  if (files.length === 0) return null

  const overLimit = files.length > maxFiles

  return (
    <div className={cn('mt-3', className)}>
      {overLimit && (
        <p className="text-xs text-red-500 mb-2 text-left">
          Максимум {maxFiles} файлов. Удалите лишние ({files.length - maxFiles} шт.)
        </p>
      )}
      <div className="flex flex-col gap-2">
        {files.map((file, idx) => {
          const hasError     = file.errors.length > 0
          const uploadErr    = errors.find((e) => e.name === file.name)
          const uploaded     = successes.includes(file.name)
          const isImg        = file.type.startsWith('image/')

          return (
            <div
              key={`${file.name}-${idx}`}
              className="flex items-center gap-3 p-2.5 rounded-xl bg-bg border border-surface2"
            >
              {/* Preview / icon */}
              <div className="w-10 h-10 rounded-lg border border-surface2 overflow-hidden flex-shrink-0 bg-surface flex items-center justify-center">
                {isImg && file.preview ? (
                  <img src={file.preview} alt={file.name} className="w-full h-full object-cover" />
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9e9080" strokeWidth="1.5">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                  </svg>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm text-ink truncate">{file.name}</p>
                <p className="text-[11px] mt-0.5">
                  {hasError ? (
                    <span className="text-red-500">
                      {file.errors.map((e) =>
                        e.message.includes('larger than')
                          ? `Слишком большой (макс. ${formatBytes(maxFileSize, 0)})`
                          : 'Недопустимый тип файла',
                      ).join(', ')}
                    </span>
                  ) : loading && !uploaded ? (
                    <span className="text-dim">Загружается...</span>
                  ) : uploadErr ? (
                    <span className="text-red-500">Ошибка: {uploadErr.message}</span>
                  ) : uploaded ? (
                    <span className="text-accent">Загружено</span>
                  ) : (
                    <span className="text-dim">{formatBytes(file.size)}</span>
                  )}
                </p>
              </div>

              {/* Remove */}
              {!loading && !uploaded && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); remove(file.name) }}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-ash hover:text-ink hover:bg-surface2 transition-colors cursor-pointer flex-shrink-0"
                  aria-label={`Удалить ${file.name}`}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              )}

              {/* Uploaded check */}
              {uploaded && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2a5c45" strokeWidth="2" strokeLinecap="round" className="flex-shrink-0">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
