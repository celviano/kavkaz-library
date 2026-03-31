import { memo } from 'react'
import Link from 'next/link'
import { Container } from '@/shared/ui/Container'

export const Footer = memo(() => {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-auto border-t border-surface2 bg-surface">
      <Container>
        <div className="py-10 flex flex-col gap-8 md:flex-row md:items-center md:justify-between">

          {/* Brand */}
          <div className="flex flex-col gap-2">
            <span
              className="font-display font-semibold text-ink text-lg leading-none"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Kavkaz<span className="text-accent italic">Library</span>
            </span>
            <p className="text-xs text-ash max-w-xs leading-relaxed">
              Каталог исторических книг, атласов и мемуаров
              о народах и землях Кавказа и Закавказья.
            </p>
          </div>

          {/* Nav */}
          <nav aria-label="Навигация в подвале">
            <ul className="flex flex-wrap gap-6">
              {[
                { href: '/catalog', label: 'Каталог' },
                { href: '/about',   label: 'О проекте' },
                { href: '/contact', label: 'Контакты' },
              ].map(({ href, label }) => (
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

          {/* Copyright */}
          <p className="text-xs text-dim">
            © {year} KavkazLibrary
          </p>
        </div>
      </Container>
    </footer>
  )
})

Footer.displayName = 'Footer'
