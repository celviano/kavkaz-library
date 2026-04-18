'use client'

import { memo, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Plus, LayoutDashboard } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { Container } from '@/shared/ui/Container'
import { UserAvatar } from '@/entities/user'
import { useCurrentUser } from '@/shared/hooks/useCurrentUser'
import { useCurrentRole } from '@/shared/hooks/useCurrentRole'

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
          'inline-flex items-center gap-1.5 h-9 px-4 rounded-lg',
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

  return (
    <header className="sticky top-0 z-50 border-b border-surface2/70 bg-bg/90 backdrop-blur-sm">
      <Container>
        <div className="flex h-16 items-center justify-between gap-4">

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
                  pathname === href || pathname.startsWith(href + '/')
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
              'md:hidden flex flex-col justify-center gap-[5px] w-10 h-10 rounded-lg',
              'text-ash hover:text-ink hover:bg-surface',
              'transition-colors duration-150 cursor-pointer items-center',
            )}
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
          >
            <span className={cn('block w-5 h-px bg-current transition-all duration-200', menuOpen && 'translate-y-[6px] rotate-45')} />
            <span className={cn('block w-5 h-px bg-current transition-all duration-200', menuOpen && 'opacity-0')} />
            <span className={cn('block w-5 h-px bg-current transition-all duration-200', menuOpen && '-translate-y-[6px] -rotate-45')} />
          </button>
        </div>
      </Container>

      {/* Mobile menu */}
      {menuOpen && (
        <nav id="mobile-menu" className="md:hidden border-t border-surface2 bg-surface" aria-label="Мобильная навигация">
          <Container>
            <ul className="flex flex-col py-3 gap-1">
              {NAV_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className={cn(
                      'flex items-center px-3 py-2.5 text-sm rounded-lg transition-colors',
                      pathname === href
                        ? 'text-accent bg-accent/8 font-medium'
                        : 'text-ash hover:text-ink hover:bg-surface2',
                    )}
                    onClick={() => setMenuOpen(false)}
                    aria-current={pathname === href ? 'page' : undefined}
                  >
                    {label}
                  </Link>
                </li>
              ))}

              {user && (isSeller || isAdmin) && (
                <li>
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 px-3 py-2.5 text-sm rounded-lg text-ash hover:text-ink hover:bg-surface2 transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    <LayoutDashboard size={14} strokeWidth={1.8}/>
                    Кабинет
                  </Link>
                </li>
              )}

              {user && (
                <li>
                  <Link
                    href="/add-book"
                    className="flex items-center gap-2 px-3 py-2.5 text-sm rounded-lg text-accent font-medium hover:bg-accent/8 transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    <Plus size={14} strokeWidth={2.5}/>
                    Добавить книгу
                  </Link>
                </li>
              )}

              <li className="pt-2 mt-1 border-t border-surface2">
                <div className="px-3 py-2"><UserAvatar /></div>
              </li>
            </ul>
          </Container>
        </nav>
      )}
    </header>
  )
})

Header.displayName = 'Header'
