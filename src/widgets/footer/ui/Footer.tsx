import { memo } from 'react'
import Link from 'next/link'
import { Container } from '@/shared/ui/Container'

const IconTelegram = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M21.94 4.3L18.6 19.6c-.25 1.1-.9 1.37-1.82.85l-5-3.68-2.41 2.32c-.27.27-.49.49-.99.49l.35-5.03L17.6 7.4c.42-.37-.09-.58-.65-.21L6.05 14.4 1.15 12.9c-1.07-.33-1.09-1.07.22-1.58L20.46 2.8c.9-.33 1.68.2 1.48 1.5z" />
  </svg>
)

const IconVK = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12.6 16s.4-.04.6-.26c.18-.2.18-.57.18-.57s-.03-1.74.79-2 1.94 1.7 3.1 2.44c.87.57 1.54.44 1.54.44l3.08-.04s1.61-.1.85-1.36c-.06-.1-.44-.94-2.28-2.65-1.92-1.78-1.66-1.5.65-4.57 1.41-1.88 1.97-3.02 1.79-3.51-.17-.47-1.19-.35-1.19-.35l-3.47.02s-.26-.03-.45.07c-.19.1-.31.34-.31.34s-.54 1.44-1.26 2.67c-1.52 2.57-2.13 2.71-2.38 2.55-.58-.37-.43-1.5-.43-2.3 0-2.51.38-3.55-.74-3.82C11.5 3 10.93 3 9.6 3 7.94 3 6.53 3.02 5.73 3.43c-.54.27-.95.88-.7.91.31.04 1.01.19 1.38.7.49.65.47 2.12.47 2.12s.28 2.96-.65 3.33c-.64.25-1.52-.26-3.4-2.6C2.07 6.42 1.54 5.3 1.54 5.3s-.13-.22-.31-.33c-.22-.13-.53-.17-.53-.17L.24 4.83s-1.72-.04-.18 2.44C1.1 8.68 4.5 13 8.2 13c0 0 .4.04.62-.17.2-.2.19-.57.19-.57s-.04-1.75.78-2 1.93 1.69 3.08 2.43c.87.57 1.54.44 1.54.44l3.08-.04s1.61-.1.85-1.36z" />
  </svg>
)

const IconMax = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect width="24" height="24" rx="5" fill="currentColor" opacity="0.2" />
    <text
      x="12"
      y="16"
      textAnchor="middle"
      fontSize="9"
      fontWeight="700"
      fill="currentColor"
      fontFamily="Arial"
    >
      MAX
    </text>
  </svg>
)

const SOCIALS = [
  { href: 'https://t.me/kavkazlibrary', label: 'Telegram', Icon: IconTelegram },
  { href: 'https://vk.com/kavkazlibrary', label: 'ВКонтакте', Icon: IconVK },
  { href: 'https://max.ru/kavkazlibrary', label: 'MAX', Icon: IconMax },
]

const NAV = [
  { href: '/catalog', label: 'Каталог' },
  { href: '/events', label: 'События' },
  { href: '/about', label: 'О проекте' },
  { href: '/contacts', label: 'Контакты' },
]

export const Footer = memo(() => {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-auto border-t border-surface2 bg-surface">
      <Container>
        <div className="py-10 flex flex-col gap-8">
          {/* Top row */}
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            {/* Brand */}
            <div className="flex flex-col gap-3">
              <span
                className="font-display font-semibold text-ink text-lg leading-none"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Kavkaz<span className="text-accent italic">Library</span>
              </span>
              <p className="text-xs text-ash max-w-xs leading-relaxed">
                Каталог исторических книг, атласов и мемуаров о народах и землях Кавказа и
                Закавказья.
              </p>

              {/* Socials */}
              <div className="flex flex-col gap-2 mt-1">
                <p className="text-[10px] font-medium tracking-[1.5px] uppercase text-dim">
                  Мы в соцсетях
                </p>
                <div className="flex items-center gap-2">
                  {SOCIALS.map(({ href, label, Icon }) => (
                    <a
                      key={href}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-ash bg-surface2 hover:text-ink hover:bg-surface3 transition-all focus-visible:outline-2 focus-visible:outline-accent"
                    >
                      <Icon />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Nav */}
            <nav aria-label="Навигация в подвале">
              <ul className="flex flex-wrap gap-x-8 gap-y-3">
                {NAV.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sm text-ash hover:text-ink transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent rounded"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Bottom row */}
          <div className="border-t border-surface2 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <p className="text-xs text-dim">
              © {year} KavkazLibrary — все права защищены
            </p>
            <p className="text-xs text-dim">
              Библиотека книг о Кавказе — история, культура, языки, литература
            </p>
          </div>
        </div>
      </Container>
    </footer>
  )
})

Footer.displayName = 'Footer'
