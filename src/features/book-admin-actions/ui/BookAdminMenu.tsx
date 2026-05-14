'use client'

import { memo, useState } from 'react'
import { useRouter } from 'next/navigation'

import type { Book } from '@/entities/book'
import { isAdmin } from '@/entities/profile'
import { useProfile } from '@/entities/profile'
import {
  useDeleteBook,
  useUpdateBookStatus,
} from '@/features/dashboard/model/useDashboard'
import { useCurrentUser } from '@/shared/hooks/useCurrentUser'
import { ConfirmDeleteModal } from '@/shared/ui/ConfirmDeleteModal'

interface BookAdminMenuProps {
  book: Book
}

export const BookAdminMenu = memo<BookAdminMenuProps>(({ book }) => {
  const { user } = useCurrentUser()
  const { data: profile } = useProfile(user?.id ?? null)
  const [isOpen, setIsOpen] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const router = useRouter()

  const { mutate: changeStatus, isPending: isArchiving } = useUpdateBookStatus(
    book.ownerId ?? '',
  )
  const { mutate: remove, isPending: isDeleting } = useDeleteBook()

  if (!isAdmin(profile ?? null)) return null

  function handleArchive() {
    setIsOpen(false)
    changeStatus({ bookId: book.id, status: 'archived' })
  }

  function handleDeleteConfirm() {
    remove(
      {
        bookId: book.id,
        coverUrl: book.coverUrl,
        images: book.images,
        ebookFileUrl: book.ebookFileUrl,
      },
      {
        onSuccess: () => {
          setShowDeleteModal(false)
          router.push('/catalog')
        },
      },
    )
  }

  return (
    <>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          disabled={isArchiving}
          className="w-8 h-8 rounded-full bg-bg/80 border border-surface2 text-ash hover:text-ink hover:border-surface3 transition-colors flex items-center justify-center cursor-pointer disabled:opacity-50"
          aria-label="Действия с книгой"
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
                onClick={() => {
                  setIsOpen(false)
                  router.push(`/book/${book.id}/edit`)
                }}
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
        title="Удалить книгу?"
        description="Книга будет полностью удалена из базы данных вместе со всеми файлами. Это действие необратимо."
      />
    </>
  )
})

BookAdminMenu.displayName = 'BookAdminMenu'
