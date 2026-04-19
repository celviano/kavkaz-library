'use client'

import { memo, useState } from 'react'
import Link from 'next/link'
import { Container } from '@/shared/ui/Container'
import { useDailyQuote } from '@/features/quotes/model/useQuotes'
import { useCurrentUser } from '@/shared/hooks/useCurrentUser'
import { AddQuoteModal } from '@/features/quotes/ui/AddQuoteModal'

// Fallback цитата если в БД ничего нет
const FALLBACK_QUOTES = [
  {
    text:   'Кавказ — это целый мир, сжатый между двух морей.',
    author: 'Александр Дюма',
    source: '«Кавказ», 1859',
  },
  {
    text:   'Здесь каждый камень — памятник, каждая гора — история.',
    author: 'Михаил Лермонтов',
    source: 'Из путевых заметок',
  },
  {
    text:   'Нигде в мире на столь малом пространстве не уместилось столько народов, языков и судеб.',
    author: 'Николай Дубровин',
    source: '«Этнография народов Кавказа», 1871',
  },
  {
    text:   'Кавказские горы — это не просто хребет, это граница между мирами.',
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
        className="py-20 border-t border-surface2 bg-surface/30 relative overflow-hidden"
      >
        {/* Mountain silhouette background */}
        <svg
          className="pointer-events-none absolute inset-0 w-full h-full"
          preserveAspectRatio="xMidYMid slice"
          viewBox="0 0 1440 320"
          aria-hidden="true"
        >
          <path
            d="M-20,320 L60,180 L120,210 L200,130 L280,175 L360,100 L440,155 L520,80 L600,140 L680,65 L760,125 L840,90 L920,150 L1000,75 L1080,130 L1160,95 L1240,160 L1320,110 L1440,145 L1460,320Z"
            fill="#2a5c45"
            opacity="0.055"
          />
          <path
            d="M-20,320 L40,230 L110,245 L180,210 L260,228 L340,195 L420,215 L500,188 L580,210 L660,182 L740,205 L820,190 L900,215 L980,195 L1060,218 L1140,200 L1220,222 L1340,205 L1460,320Z"
            fill="#2a5c45"
            opacity="0.065"
          />
          <path
            d="M-20,320 L0,278 L80,285 L160,268 L240,278 L320,260 L400,272 L480,258 L560,272 L640,262 L720,275 L800,265 L880,278 L960,268 L1040,280 L1120,270 L1200,282 L1320,272 L1460,320Z"
            fill="#8B6914"
            opacity="0.05"
          />
          <path d="M520,80 L538,108 L502,105Z" fill="#e8e0d4" opacity="0.5" />
          <path d="M680,65 L698,95 L662,92Z"  fill="#e8e0d4" opacity="0.5" />
          <path d="M840,90 L856,116 L824,113Z" fill="#e8e0d4" opacity="0.5" />
          <path d="M1000,75 L1016,102 L984,99Z" fill="#e8e0d4" opacity="0.45" />
        </svg>

        <Container>
          <div className="relative max-w-3xl mx-auto text-center">
            {/* Large decorative quote mark */}
            <span
              className="font-display text-accent/10 leading-none select-none absolute -top-6 left-1/2 -translate-x-1/2"
              style={{ fontFamily: 'var(--font-display)', fontSize: '10rem', lineHeight: 1 }}
              aria-hidden="true"
            >
              «
            </span>

            {/* Ornament top */}
            <div className="flex items-center justify-center gap-4 mb-8" aria-hidden="true">
              <div className="h-px flex-1 max-w-[80px] bg-gradient-to-r from-transparent to-surface3" />
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <polygon points="10,1 19,10 10,19 1,10" fill="none" stroke="#2a5c45" strokeWidth="1.2" opacity="0.4" />
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
                  <span className="text-xs text-dim">{quote.source}</span>
                </footer>
              </blockquote>
            )}

            {/* Ornament bottom */}
            <div className="flex items-center justify-center gap-4 mb-8" aria-hidden="true">
              <div className="h-px flex-1 max-w-[80px] bg-gradient-to-r from-transparent to-surface3" />
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <polygon points="10,1 19,10 10,19 1,10" fill="none" stroke="#2a5c45" strokeWidth="1.2" opacity="0.4" />
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
                <span className="transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">
                  →
                </span>
              </button>
            ) : (
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent rounded group"
              >
                Предложить цитату
                <span className="transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">
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
