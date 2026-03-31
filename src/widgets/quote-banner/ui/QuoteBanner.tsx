import { memo } from 'react'
import { Container } from '@/shared/ui/Container'

const QUOTES = [
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

// Deterministic pick by day so it's stable on SSR
function getDailyQuote() {
  const day = Math.floor(Date.now() / 86_400_000)
  return QUOTES[day % QUOTES.length]
}

export const QuoteBanner = memo(() => {
  const quote = getDailyQuote()

  return (
    <section
      aria-label="Цитата дня"
      className="py-20 border-t border-surface2 bg-surface/30"
    >
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

          <blockquote className="relative">
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

          {/* Ornament bottom */}
          <div className="flex items-center justify-center gap-4 mt-8" aria-hidden="true">
            <div className="h-px flex-1 max-w-[80px] bg-gradient-to-r from-transparent to-surface3" />
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <polygon points="10,1 19,10 10,19 1,10" fill="none" stroke="#2a5c45" strokeWidth="1.2" opacity="0.4" />
              <polygon points="10,5 15,10 10,15 5,10" fill="#2a5c45" opacity="0.25" />
              <circle cx="10" cy="10" r="2" fill="#8B6914" opacity="0.5" />
            </svg>
            <div className="h-px flex-1 max-w-[80px] bg-gradient-to-l from-transparent to-surface3" />
          </div>

        </div>
      </Container>
    </section>
  )
})

QuoteBanner.displayName = 'QuoteBanner'
