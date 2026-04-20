'use client'

import { memo, useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { cn } from '@/shared/lib/cn'
import { useCurrentUser } from '@/shared/hooks/useCurrentUser'
import { useProfile, ProfileAvatar, getFullName, ROLE_LABELS, ROLE_BADGE_STYLE } from '@/entities/profile'
import { logoutAction } from '@/features/auth'

export const UserAvatar = memo(() => {
  const { user, loading } = useCurrentUser()
  const { data: profile } = useProfile(user?.id ?? null)
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const displayName = getFullName(profile ?? null) || user?.email?.split('@')[0] || null
  const avatarUrl = profile?.avatarUrl ?? user?.user_metadata?.avatar_url ?? null

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  if (!loading && !user) {
    return (
      <Link
        href="/auth/login"
        className={cn(
          'inline-flex items-center justify-center h-9 px-5 rounded-lg',
          'text-sm font-medium text-ash border border-surface2',
          'bg-bg hover:text-ink hover:bg-surface hover:border-surface3',
          'transition-all duration-150',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
        )}
      >
        Войти
      </Link>
    )
  }

  if (loading)
    return (
      <div
        className="w-9 h-9 rounded-full bg-surface2 animate-pulse"
        aria-hidden="true"
      />
    )

  const NAV_ITEMS = [
    {
      href: '/profile',
      label: 'Профиль',
      d: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM4 20c0-4 3.6-7 8-7s8 3 8 7',
    },
    {
      href: '/dashboard',
      label: 'Кабинет',
      d: 'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z',
    },
    {
      href: '/favorites',
      label: 'Избранное',
      d: 'M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z',
    },
    {
      href: '/catalog',
      label: 'Каталог',
      d: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z',
    },
  ]

  return (
    <div className="relative flex " ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={`Меню пользователя ${displayName ?? ''}`}
        className={cn(
          'w-9 h-9 rounded-full cursor-pointer border-2 transition-all duration-150',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
          open
            ? 'border-accent ring-2 ring-accent/20'
            : 'border-surface2 hover:border-accent/50',
        )}
      >
        <ProfileAvatar
          avatarUrl={avatarUrl}
          name={displayName}
          size="sm"
          className="border-0"
        />
      </button>

      {open && (
        <div
          className="absolute right-0 top-11 z-50 w-52 rounded-2xl bg-bg border border-surface2 shadow-accent py-1.5"
          role="menu"
        >
          <div className="px-4 py-3 border-b border-surface2">
            <p className="text-sm font-medium text-ink truncate">{displayName}</p>
            <p className="text-xs text-ash truncate">{user?.email}</p>
            {profile?.role && (
              <span className={`inline-flex items-center mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium ${ROLE_BADGE_STYLE[profile.role]}`}>
                {ROLE_LABELS[profile.role]}
              </span>
            )}
          </div>

          <div className="py-1">
            {NAV_ITEMS.map(({ href, label, d }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-text hover:text-ink hover:bg-surface transition-colors"
                role="menuitem"
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d={d} />
                </svg>
                {label}
              </Link>
            ))}
          </div>

          <div className="pt-1 border-t border-surface2">
            <button
              type="button"
              onClick={async () => {
                const { createClient } = await import('@/shared/lib/supabase/client')
                const supabase = createClient()
                await supabase.auth.signOut()
              }}
              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-ash hover:text-ink hover:bg-surface transition-colors cursor-pointer"
              role="menuitem"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Выйти
            </button>
          </div>
        </div>
      )}
    </div>
  )
})

UserAvatar.displayName = 'UserAvatar'
