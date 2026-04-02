'use client'

import { memo, useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { cn } from '@/shared/lib/cn'
import { useCurrentUser, useCurrentUserName, useCurrentUserImage } from '@/shared/hooks/useCurrentUser'
import { logoutAction } from '@/features/auth'

export const UserAvatar = memo(() => {
  const { user, loading } = useCurrentUser()
  const name = useCurrentUserName(user)
  const image = useCurrentUserImage(user)
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const initials = name
    ? name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
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

  if (loading) {
    return <div className="w-9 h-9 rounded-full bg-surface2 animate-pulse" aria-hidden="true" />
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={`Меню пользователя ${name ?? ''}`}
        className={cn(
          'w-9 h-9 rounded-full flex items-center justify-center',
          'text-xs font-semibold select-none cursor-pointer',
          'border-2 transition-all duration-150',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
          open
            ? 'border-accent ring-2 ring-accent/20'
            : 'border-surface2 hover:border-accent/50',
        )}
        style={{ background: image ? undefined : 'var(--color-accent)' }}
      >
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt={name ?? 'Аватар'} className="w-full h-full rounded-full object-cover" />
        ) : (
          <span className="text-bg text-[11px] font-semibold">{initials}</span>
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 top-11 z-50 w-52 rounded-2xl bg-bg border border-surface2 shadow-accent py-1.5"
          role="menu"
          aria-label="Меню пользователя"
        >
          {/* User info */}
          <div className="px-4 py-3 border-b border-surface2">
            <p className="text-sm font-medium text-ink truncate">{name}</p>
            <p className="text-xs text-ash truncate">{user?.email}</p>
          </div>

          <div className="py-1">
            <Link
              href="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-text hover:text-ink hover:bg-surface transition-colors"
              role="menuitem"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
              </svg>
              Профиль
            </Link>

            {/* Favorites link */}
            <Link
              href="/favorites"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-text hover:text-ink hover:bg-surface transition-colors"
              role="menuitem"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
              </svg>
              Избранное
            </Link>

            <Link
              href="/catalog"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-text hover:text-ink hover:bg-surface transition-colors"
              role="menuitem"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
              </svg>
              Каталог
            </Link>
          </div>

          <div className="pt-1 border-t border-surface2">
            <form action={logoutAction}>
              <button
                type="submit"
                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-ash hover:text-ink hover:bg-surface transition-colors cursor-pointer"
                role="menuitem"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                Выйти
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
})

UserAvatar.displayName = 'UserAvatar'
