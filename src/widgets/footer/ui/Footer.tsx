import { memo } from 'react'
import Link from 'next/link'
import { Container } from '@/shared/ui/Container'
import { IconTelegram, IconVK, IconMax } from '@/shared/ui/SocialIcons'

const SOCIALS = [
  { href: 'https://t.me/caucasuslibrary',   label: 'Telegram',  Icon: IconTelegram, branded: false },
  { href: 'https://vk.com/caucasuslibrary', label: 'ВКонтакте', Icon: IconVK,       branded: true  },
  { href: 'https://max.ru/caucasuslibrary', label: 'MAX',       Icon: IconMax,      branded: true  },
]

const NAV = [
  { href: '/catalog',  label: 'Каталог' },
  { href: '/events',   label: 'События' },
  { href: '/about',    label: 'О проекте' },
  { href: '/contacts', label: 'Контакты' },
]

export const Footer = memo(() => {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-auto border-t border-surface2 bg-surface">
      <Container>
        <div className="py-10 flex flex-col gap-8">

          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div className="flex flex-col gap-3">
              <span
                className="font-display font-semibold text-ink text-lg leading-none"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Kavkaz<span className="text-accent italic">Library</span>
              </span>
              <p className="text-xs text-ash max-w-xs leading-relaxed">
                Книги по истории, культуре, языкам и литературе
                народов Кавказа и Закавказья.
              </p>

              <div className="flex flex-col gap-2 mt-1">
                <p className="text-[10px] font-medium tracking-[1.5px] uppercase text-dim">
                  Мы в соцсетях
                </p>
                <div className="flex items-center gap-2">
                  {SOCIALS.map(({ href, label, Icon, branded }) => (
                    <a
                      key={href}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className={
                        branded
                          ? 'w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center hover:opacity-80 transition-opacity focus-visible:outline-2 focus-visible:outline-accent'
                          : 'w-8 h-8 rounded-lg flex items-center justify-center text-ash bg-surface2 hover:text-ink hover:bg-surface3 transition-all focus-visible:outline-2 focus-visible:outline-accent'
                      }
                    >
                      <Icon size={branded ? 32 : 18}/>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <nav aria-label="Навигация в подвале">
              <ul className="flex flex-wrap justify-center md:justify-start gap-x-8 gap-y-3">
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

          <div className="border-t border-surface2 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <p className="text-xs text-dim">© {year} KavkazLibrary — все права защищены</p>
            <p className="text-xs text-dim">Библиотека книг о Кавказе — история, культура, языки, литература</p>
          </div>

        </div>
      </Container>
    </footer>
  )
})

Footer.displayName = 'Footer'
