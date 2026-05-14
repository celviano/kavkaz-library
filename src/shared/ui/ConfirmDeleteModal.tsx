'use client'

import { memo, useEffect } from 'react'

interface ConfirmDeleteModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  isPending?: boolean
  title?: string
  description?: string
}

export const ConfirmDeleteModal = memo<ConfirmDeleteModalProps>(
  ({
    isOpen,
    onClose,
    onConfirm,
    isPending = false,
    title = 'Удалить?',
    description = 'Это действие необратимо. Запись будет полностью удалена.',
  }) => {
    useEffect(() => {
      if (!isOpen) return
      const handler = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose()
      }
      document.addEventListener('keydown', handler)
      document.body.style.overflow = 'hidden'
      return () => {
        document.removeEventListener('keydown', handler)
        document.body.style.overflow = ''
      }
    }, [isOpen, onClose])

    if (!isOpen) return null

    return (
      <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
        <div
          className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
          onClick={onClose}
          aria-hidden="true"
        />

        <div
          className="relative z-10 w-full sm:max-w-sm bg-bg rounded-t-3xl sm:rounded-3xl border border-surface2 shadow-accent p-8 flex flex-col gap-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-delete-title"
        >
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-ash hover:text-ink hover:bg-surface2 transition-colors cursor-pointer disabled:opacity-50"
            aria-label="Закрыть"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <div className="flex flex-col gap-2 pr-6">
            <h2 id="confirm-delete-title" className="text-ink font-semibold text-lg">
              {title}
            </h2>
            <p className="text-ash text-sm leading-relaxed">{description}</p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="flex-1 h-11 rounded-xl text-sm font-medium border border-surface2 text-ash hover:text-ink hover:bg-surface hover:border-surface3 transition-all disabled:opacity-50 cursor-pointer"
            >
              Отмена
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isPending}
              className="flex-1 h-11 rounded-xl text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isPending ? 'Удаление...' : 'Удалить'}
            </button>
          </div>
        </div>
      </div>
    )
  },
)

ConfirmDeleteModal.displayName = 'ConfirmDeleteModal'
