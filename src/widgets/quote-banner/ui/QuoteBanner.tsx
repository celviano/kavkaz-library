'use client'

import { memo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Container } from '@/shared/ui/Container'
import { useDailyQuote } from '@/features/quotes/model/useQuotes'
import { useCurrentUser } from '@/shared/hooks/useCurrentUser'
import { AddQuoteModal } from '@/features/quotes/ui/AddQuoteModal'
import quotePainting from '../../../../public/images/quote-banner-painting.jpg'

// Fallback цитата если в БД ничего нет
const FALLBACK_QUOTES = [
  {
    text: 'Кавказ — это целый мир, сжатый между двух морей.',
    author: 'Александр Дюма',
    source: '«Кавказ», 1859',
  },
  {
    text: 'Здесь каждый камень — памятник, каждая гора — история.',
    author: 'Михаил Лермонтов',
    source: 'Из путевых заметок',
  },
  {
    text: 'Нигде в мире на столь малом пространстве не уместилось столько народов, языков и судеб.',
    author: 'Николай Дубровин',
    source: '«Этнография народов Кавказа», 1871',
  },
  {
    text: 'Кавказские горы — это не просто хребет, это граница между мирами.',
    author: 'Семён Броневский',
    source: '«Описание Кавказа», 1823',
  },
]

function getDailyFallback() {
  const day = Math.floor(Date.now() / 86_400_000)
  return FALLBACK_QUOTES[day % FALLBACK_QUOTES.length]
}

export const QuoteBanner = memo(() => {
  const { data: dbQuote, isLoading } = useDailyQuote()
  const { user } = useCurrentUser()
  const [modalOpen, setModalOpen] = useState(false)

  const quote = dbQuote ?? getDailyFallback()

  return (
    <>
      <section
        aria-label="Цитата дня"
        className="py-20 border-t border-surface2 relative overflow-hidden"
      >
        {/* Painting background */}
        <div className="absolute inset-0" aria-hidden="true">
          <Image
            src={quotePainting}
            alt=""
            fill
            className="object-cover object-center"
            sizes="100vw"
            quality={90}
          />
        </div>

        {/* Layer 1: gradient overlay — плотный сверху и снизу, прозрачный в середине */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(to bottom, rgba(242,237,230,0.92) 0%, rgba(242,237,230,0.72) 30%, rgba(242,237,230,0.72) 70%, rgba(242,237,230,0.92) 100%)',
          }}
          aria-hidden="true"
        />

        {/* Layer 2: warm tint */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'rgba(242,237,230,0.15)' }}
          aria-hidden="true"
        />

        {/* Layer 3: carpet pattern */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.025]"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="quote-carpet"
              x="0"
              y="0"
              width="80"
              height="80"
              patternUnits="userSpaceOnUse"
            >
              <polygon
                points="40,6 74,40 40,74 6,40"
                fill="none"
                stroke="#2a5c45"
                strokeWidth="1.5"
              />
              <polygon
                points="40,18 62,40 40,62 18,40"
                fill="none"
                stroke="#8B6914"
                strokeWidth="1"
              />
              <polygon points="40,28 52,40 40,52 28,40" fill="#2a5c45" opacity="0.4" />
              <circle cx="0" cy="0" r="2" fill="#8B6914" />
              <circle cx="80" cy="0" r="2" fill="#8B6914" />
              <circle cx="0" cy="80" r="2" fill="#8B6914" />
              <circle cx="80" cy="80" r="2" fill="#8B6914" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#quote-carpet)" />
        </svg>

        <Container>
          <div className="relative max-w-3xl mx-auto text-center">
            {/* Large decorative quote mark */}
            <span
              className="font-display text-accent/10 leading-none select-none absolute -top-6 left-1/2 -translate-x-1/2"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '10rem',
                lineHeight: 1,
              }}
              aria-hidden="true"
            >
              «
            </span>

            {/* Ornament top */}
            <div
              className="flex items-center justify-center gap-4 mb-8"
              aria-hidden="true"
            >
              <div className="h-px flex-1 max-w-[80px] bg-gradient-to-r from-transparent to-surface3" />
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <polygon
                  points="10,1 19,10 10,19 1,10"
                  fill="none"
                  stroke="#2a5c45"
                  strokeWidth="1.2"
                  opacity="0.4"
                />
                <polygon points="10,5 15,10 10,15 5,10" fill="#2a5c45" opacity="0.25" />
                <circle cx="10" cy="10" r="2" fill="#8B6914" opacity="0.5" />
              </svg>
              <div className="h-px flex-1 max-w-[80px] bg-gradient-to-l from-transparent to-surface3" />
            </div>

            {/* Quote */}
            {isLoading ? (
              <div className="flex flex-col items-center gap-4 mb-8">
                <div className="h-7 w-3/4 rounded-lg bg-surface2 animate-pulse" />
                <div className="h-5 w-1/2 rounded-lg bg-surface2 animate-pulse" />
                <div className="h-4 w-1/3 rounded-lg bg-surface2 animate-pulse" />
              </div>
            ) : (
              <blockquote className="relative mb-8">
                <p
                  className="font-display italic text-ink leading-snug mb-6"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(1.3rem, 2.5vw, 1.75rem)',
                  }}
                >
                  «{quote.text}»
                </p>
                <footer className="flex flex-col items-center gap-1">
                  <cite className="not-italic text-sm font-medium text-accent">
                    {quote.author}
                  </cite>
                  <span className="text-xs text-ink/50">{quote.source}</span>
                </footer>
              </blockquote>
            )}

            {/* Ornament bottom */}
            <div
              className="flex items-center justify-center gap-4 mb-8"
              aria-hidden="true"
            >
              <div className="h-px flex-1 max-w-[80px] bg-gradient-to-r from-transparent to-surface3" />
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <polygon
                  points="10,1 19,10 10,19 1,10"
                  fill="none"
                  stroke="#2a5c45"
                  strokeWidth="1.2"
                  opacity="0.4"
                />
                <polygon points="10,5 15,10 10,15 5,10" fill="#2a5c45" opacity="0.25" />
                <circle cx="10" cy="10" r="2" fill="#8B6914" opacity="0.5" />
              </svg>
              <div className="h-px flex-1 max-w-[80px] bg-gradient-to-l from-transparent to-surface3" />
            </div>

            {/* CTA */}
            {user ? (
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent rounded group"
              >
                Предложить цитату
                <span
                  className="transition-transform duration-200 group-hover:translate-x-1"
                  aria-hidden="true"
                >
                  →
                </span>
              </button>
            ) : (
              <Link
                href="/auth/login"
                className="cursor-pointer inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent rounded group"
              >
                Предложить цитату
                <span
                  className="transition-transform duration-200 group-hover:translate-x-1"
                  aria-hidden="true"
                >
                  →
                </span>
              </Link>
            )}
          </div>
        </Container>
      </section>

      {modalOpen && user && (
        <AddQuoteModal userId={user.id} onClose={() => setModalOpen(false)} />
      )}
    </>
  )
})

QuoteBanner.displayName = 'QuoteBanner'
