'use client'

import { memo } from 'react'
import Link from 'next/link'
import { useProfile, useSellerStats, getFullName } from '@/entities/profile'
import { ProfileAvatar } from '@/entities/profile'

interface SellerBlockProps {
  sellerId: string
}

export const SellerBlock = memo<SellerBlockProps>(({ sellerId }) => {
  const { data: profile, isLoading } = useProfile(sellerId)
  const { data: stats } = useSellerStats(sellerId)

  if (isLoading) {
    return (
      <div className="flex items-center gap-3 animate-pulse">
        <div className="w-10 h-10 rounded-full bg-surface2 flex-shrink-0" />
        <div className="flex flex-col gap-1.5">
          <div className="h-3.5 w-28 bg-surface2 rounded-full" />
          <div className="h-3 w-20 bg-surface2 rounded-full" />
        </div>
      </div>
    )
  }

  if (!profile) return null

  const name = getFullName(profile) || 'Пользователь'

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <ProfileAvatar
          avatarUrl={profile.avatarUrl}
          name={name}
          size="md"
          className="flex-shrink-0"
        />
        <div className="min-w-0">
          <p className="text-sm font-medium text-ink truncate">{name}</p>
          <div className="flex items-center gap-2 text-xs text-ash">
            {profile.isVerified && (
              <span className="flex items-center gap-1 text-accent">
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Верифицирован
              </span>
            )}
            {stats && (
              <span>
                {stats.activeBooks}{' '}
                {stats.activeBooks === 1
                  ? 'книга'
                  : stats.activeBooks < 5
                    ? 'книги'
                    : 'книг'}
              </span>
            )}
          </div>
        </div>
      </div>

      <Link
        href={`/seller/${sellerId}`}
        className="h-8 flex items-center px-4 rounded-lg text-xs font-medium border border-surface2 text-ash hover:text-ink hover:bg-surface2 transition-all"
      >
        Все книги
      </Link>
    </div>
  )
})

SellerBlock.displayName = 'SellerBlock'
