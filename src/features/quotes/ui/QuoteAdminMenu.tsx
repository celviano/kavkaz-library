'use client'

import { memo, useState } from 'react'

import { useDeleteQuote, useUpdateQuoteStatus } from '@/features/quotes/model/useQuotes'
import type { Quote } from '@/shared/lib/supabase/queries/quotes'
import { ConfirmDeleteModal } from '@/shared/ui/ConfirmDeleteModal'

interface QuoteAdminMenuProps {
  quote: Quote
  onEdit: () => void
}

export const QuoteAdminMenu = memo<QuoteAdminMenuProps>(({ quote, onEdit }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const { mutate: updateStatus, isPending: isArchiving } = useUpdateQuoteStatus()
  const { mutate: remove, isPending: isDeleting } = useDeleteQuote()

  function handleArchive() {
    setIsOpen(false)
    updateStatus({ quoteId: quote.id, status: 'archived' })
  }

  function handleEdit() {
    setIsOpen(false)
    onEdit()
  }

  function handleDeleteConfirm() {
    remove(quote.id, {
      onSuccess: () => setShowDeleteModal(false),
    })
  }

  return (
    <>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          disabled={isArchiving}
          className="w-8 h-8 rounded-full bg-bg/80 border border-surface2 text-ash hover:text-ink hover:border-surface3 transition-colors flex items-center justify-center cursor-pointer disabled:opacity-50"
          aria-label="Действия с цитатой"
          aria-expanded={isOpen}
          aria-haspopup="menu"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="5" r="1.5" />
            <circle cx="12" cy="12" r="1.5" />
            <circle cx="12" cy="19" r="1.5" />
          </svg>
        </button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />
            <div
              role="menu"
              className="absolute right-0 top-full mt-1 w-44 bg-bg border border-surface2 rounded-xl shadow-card z-50 overflow-hidden"
            >
              <button
                type="button"
                role="menuitem"
                onClick={handleArchive}
                className="w-full px-4 py-2.5 text-sm text-left text-ash hover:text-ink hover:bg-surface transition-colors cursor-pointer"
              >
                Архивировать
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={handleEdit}
                className="w-full px-4 py-2.5 text-sm text-left text-ash hover:text-ink hover:bg-surface transition-colors cursor-pointer"
              >
                Изменить
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setIsOpen(false)
                  setShowDeleteModal(true)
                }}
                className="w-full px-4 py-2.5 text-sm text-left text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
              >
                Удалить
              </button>
            </div>
          </>
        )}
      </div>

      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        isPending={isDeleting}
        title="Удалить цитату?"
        description="Цитата будет полностью удалена из базы данных. Это действие необратимо."
      />
    </>
  )
})

QuoteAdminMenu.displayName = 'QuoteAdminMenu'
