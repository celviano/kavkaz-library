'use client'

import { memo } from 'react'
import { cn } from '@/shared/lib/cn'
import { useCurrentUser } from '@/shared/hooks/useCurrentUser'
import { useFavoriteIds, useToggleFavorite } from '../model/useFavorites'

interface FavoriteButtonProps {
  bookId: string
  className?: string
}

export const FavoriteButton = memo<FavoriteButtonProps>(({ bookId, className }) => {
  const { user } = useCurrentUser()
  const { data: favoriteIds = [] } = useFavoriteIds(user?.id ?? null)
  const { mutate: toggle, isPending } = useToggleFavorite(user?.id ?? null)

  const isFav = favoriteIds.includes(bookId)

  function handleClick(e: React.MouseEvent) {
    e.preventDefault()   // не переходить по ссылке карточки
    e.stopPropagation()

    if (!user) {
      window.location.href = '/auth/login'
      return
    }
    toggle({ bookId, isFav })
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      aria-label={isFav ? 'Убрать из избранного' : 'Добавить в избранное'}
      aria-pressed={isFav}
      className={cn(
        'w-8 h-8 rounded-full flex items-center justify-center',
        'border transition-all duration-200 cursor-pointer',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
        'disabled:opacity-50 disabled:cursor-wait',
        isFav
          ? 'bg-accent border-accent text-bg shadow-accent-sm'
          : 'bg-bg/80 border-surface2 text-ash hover:border-accent/50 hover:text-accent hover:bg-bg',
        className,
      )}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill={isFav ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transition-transform duration-200 group-hover:scale-110"
      >
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
    </button>
  )
})

FavoriteButton.displayName = 'FavoriteButton'
