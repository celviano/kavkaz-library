'use client'

import { memo, useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Plus, LayoutDashboard, LogOut } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { Container } from '@/shared/ui/Container'
import { UserAvatar } from '@/entities/user'
import { useCurrentUser, useCurrentUserName, useCurrentUserImage } from '@/shared/hooks/useCurrentUser'
import { useCurrentRole } from '@/shared/hooks/useCurrentRole'
import { ProfileAvatar } from '@/entities/profile'

const NAV_LINKS = [
  { href: '/catalog',  label: 'Каталог' },
  { href: '/events',   label: 'События' },
  { href: '/about',    label: 'О проекте' },
  { href: '/contacts', label: 'Контакты' },
] as const

const MountainIcon = () => (
  <svg width="28" height="22" viewBox="0 0 28 22" fill="none" aria-hidden="true">
    <path d="M10 20L18 5L26 20H10Z" fill="currentColor" opacity="0.25" />
    <path d="M2 20L11 4L20 20H2Z" fill="currentColor" />
    <path d="M11 4L14 9.5H8L11 4Z" fill="var(--color-bg)" opacity="0.7" />
  </svg>
)

// Кнопка зависит от роли:
// seller/admin → Кабинет + Добавить книгу
// user → Добавить книгу (с подсказкой что станет продавцом)
function HeaderActions({ isSeller, isAdmin }: { isSeller: boolean; isAdmin: boolean }) {
  const hasDashboard = isSeller || isAdmin

  return (
    <div className="flex items-center gap-2">
      {hasDashboard && (
        <Link
          href="/dashboard"
          className={cn(
            'inline-flex items-center gap-1.5 h-9 px-3 rounded-lg',
            'text-sm font-medium text-ash border border-surface2',
            'hover:text-ink hover:bg-surface hover:border-surface3',
            'transition-all duration-150',
          )}
        >
          <LayoutDashboard size={14} strokeWidth={1.8}/>
          Кабинет
        </Link>
      )}
      <Link
        href="/add-book"
        className={cn(
          'hidden lg:flex items-center gap-1.5 h-9 px-4 rounded-lg',
          'text-sm font-medium',
          'bg-accent text-bg border border-accent',
          'hover:bg-accent2 hover:border-accent2',
          'transition-all duration-150',
        )}
      >
        <Plus size={14} strokeWidth={2.5} aria-hidden="true"/>
        Добавить книгу
      </Link>
    </div>
  )
}

export const Header = memo(() => {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const { user } = useCurrentUser()
  const { isSeller, isAdmin } = useCurrentRole()
  const userName = useCurrentUserName(user)
  const userImage = useCurrentUserImage(user)

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  // Close on route change
  useEffect(() => { setMenuOpen(false) }, [pathname])

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-surface2/70 bg-bg/90 backdrop-blur-sm">
        <Container>
          <div className="flex h-16 items-center justify-between gap-3">

            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent rounded-sm shrink-0"
              aria-label="CaucasusLibrary — на главную"
            >
              <span className="text-accent"><MountainIcon /></span>
              <span
                className="font-display text-xl font-semibold tracking-wide text-ink leading-none"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Caucasus<span className="text-accent italic">Library</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex justify-center items-center gap-1 flex-1" aria-label="Основная навигация">
              {NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm transition-all duration-150',
                    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
                    pathname === href || pathname?.startsWith(href + '/')
                      ? 'text-accent bg-accent/10 font-medium'
                      : 'text-ash hover:text-ink hover:bg-surface',
                  )}
                  aria-current={pathname === href ? 'page' : undefined}
                >
                  {label}
                </Link>
              ))}
            </nav>

            {/* Right */}
            <div className="hidden md:flex items-center gap-3">
              {user && <HeaderActions isSeller={isSeller} isAdmin={isAdmin} />}
              <UserAvatar />
            </div>

            {/* Mobile burger */}
            <button
              className={cn(
                'md:hidden flex flex-col justify-center gap-1.25 w-10 h-10 rounded-lg',
                'text-ash hover:text-ink hover:bg-surface',
                'transition-colors duration-150 cursor-pointer items-center',
              )}
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
            >
              <span className={cn('block w-5 h-px bg-current transition-all duration-200', menuOpen && 'translate-y-1.5 rotate-45')} />
              <span className={cn('block w-5 h-px bg-current transition-all duration-200', menuOpen && 'opacity-0')} />
              <span className={cn('block w-5 h-px bg-current transition-all duration-200', menuOpen && '-translate-y-1.5 -rotate-45')} />
            </button>
          </div>
        </Container>
      </header>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="fixed inset-0 z-40 md:hidden flex flex-col bg-bg"
          role="dialog"
          aria-modal="true"
          aria-label="Мобильная навигация"
        >
          <div className="h-16 shrink-0 border-b border-surface2/70" />

          <div className="flex-1 overflow-y-auto flex flex-col">
            <Container className="flex-1 flex flex-col">

              {/* Main nav */}
              <nav aria-label="Основная навигация">
                <ul className="flex flex-col pt-4">
                  {NAV_LINKS.map(({ href, label }) => (
                    <li key={href}>
                      <Link
                        href={href}
                        className={cn(
                          'flex items-center justify-between py-3.5 border-b border-surface2 transition-colors',
                          pathname === href ? 'text-accent' : 'text-ink hover:text-accent',
                        )}
                        style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 400, lineHeight: 1.1 }}
                        onClick={() => setMenuOpen(false)}
                        aria-current={pathname === href ? 'page' : undefined}
                      >
                        {label}
                        {pathname === href && <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Secondary links */}
              <div className="flex flex-col md:pt-2">
                {user && (isSeller || isAdmin) && (
                  <Link
                    href="/dashboard"
                    className={cn(
                      'flex items-center justify-between py-3.5 border-b border-surface2 transition-colors',
                      pathname === '/dashboard' ? 'text-accent' : 'text-ink hover:text-accent',
                    )}
                    style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 400, lineHeight: 1.1 }}
                    onClick={() => setMenuOpen(false)}
                  >
                    Кабинет
                    {pathname === '/dashboard' && <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />}
                  </Link>
                )}
                <Link
                  href="/favorites"
                  className={cn(
                    'flex items-center justify-between py-3.5 border-b border-surface2 transition-colors',
                    pathname === '/favorites' ? 'text-accent' : 'text-ink hover:text-accent',
                  )}
                  style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 400, lineHeight: 1.1 }}
                  onClick={() => setMenuOpen(false)}
                >
                  Избранное
                  {pathname === '/favorites' && <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />}
                </Link>
                {user && (
                  <button
                    type="button"
                    className="flex items-center justify-between w-full py-3.5 border-b border-surface2 text-rose-700 hover:text-rose-800 transition-colors cursor-pointer"
                    style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 400, lineHeight: 1.1 }}
                    onClick={async () => {
                      const { createClient } = await import('@/shared/lib/supabase/client')
                      const supabase = createClient()
                      await supabase.auth.signOut()
                      setMenuOpen(false)
                    }}
                  >
                    Выйти
                    <LogOut size={16} strokeWidth={1.6} />
                  </button>
                )}
              </div>

              {/* Bottom: user / login */}
              <div className="mt-auto pt-4 pb-6 border-t border-surface2">
                {user ? (
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                    onClick={() => setMenuOpen(false)}
                  >
                    <ProfileAvatar avatarUrl={userImage} name={userName} size="sm" />
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-medium text-ink leading-none truncate">
                        {userName ?? 'Профиль'}
                      </span>
                      <span className="text-xs text-ash truncate mt-0.5">{user.email}</span>
                    </div>
                  </Link>
                ) : (
                  <Link
                    href="/auth/login"
                    className="inline-flex items-center justify-center h-10 w-full rounded-xl text-sm font-medium text-ash border border-surface2 hover:text-ink hover:bg-surface transition-all"
                    onClick={() => setMenuOpen(false)}
                  >
                    Войти
                  </Link>
                )}
              </div>

            </Container>
          </div>
        </div>
      )}
    </>
  )
})

Header.displayName = 'Header'
