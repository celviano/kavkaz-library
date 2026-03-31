import Link from 'next/link'
import { Container } from '@/shared/ui/Container'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Страница не найдена',
}

export default function NotFound() {
  return (
    <main id="main-content" className="flex-1 flex items-center justify-center py-24">
      <Container>
        <div className="relative max-w-2xl mx-auto text-center">
          {/* SVG background ornament */}
          <svg
            className="absolute inset-0 w-full h-full opacity-[0.04] pointer-events-none"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
          >
            <defs>
              <pattern
                id="nf-pat"
                x="0"
                y="0"
                width="70"
                height="70"
                patternUnits="userSpaceOnUse"
              >
                <polygon
                  points="35,4 66,35 35,66 4,35"
                  fill="none"
                  stroke="#2a5c45"
                  strokeWidth="1.2"
                />
                <polygon
                  points="35,16 54,35 35,54 16,35"
                  fill="none"
                  stroke="#8B6914"
                  strokeWidth="0.8"
                />
                <circle cx="35" cy="35" r="3" fill="#2a5c45" />
                <circle cx="0" cy="0" r="1.5" fill="#8B6914" />
                <circle cx="70" cy="0" r="1.5" fill="#8B6914" />
                <circle cx="0" cy="70" r="1.5" fill="#8B6914" />
                <circle cx="70" cy="70" r="1.5" fill="#8B6914" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#nf-pat)" />
          </svg>

          {/* Mountain illustration */}
          <div className="relative flex justify-center mb-8" aria-hidden="true">
            <svg width="160" height="100" viewBox="0 0 160 100" fill="none">
              {/* Back mountains */}
              <path
                d="M0 100 L30 30 L55 65 L80 10 L105 55 L130 25 L160 100 Z"
                fill="#1B2212"
                opacity="0.08"
              />
              {/* Front mountains */}
              <path
                d="M0 100 L20 55 L45 80 L70 35 L95 70 L120 45 L160 100 Z"
                fill="#2a5c45"
                opacity="0.12"
              />
              {/* Snow caps */}
              <path d="M80 10 L88 28 L72 28 Z" fill="#2a5c45" opacity="0.25" />
              <path d="M130 25 L137 40 L123 40 Z" fill="#2a5c45" opacity="0.2" />
              <path d="M70 35 L77 52 L63 52 Z" fill="#2a5c45" opacity="0.2" />
              {/* 404 as fog/mist */}
              <text
                x="50%"
                y="68"
                textAnchor="middle"
                fontFamily="Georgia, serif"
                fontSize="52"
                fontWeight="600"
                fill="#2a5c45"
                opacity="0.12"
              >
                404
              </text>
            </svg>
          </div>

          {/* Ornament divider */}
          <div className="flex items-center justify-center gap-4 mb-8" aria-hidden="true">
            <div className="h-px flex-1 max-w-[60px] bg-gradient-to-r from-transparent to-surface3" />
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <polygon
                points="9,1 17,9 9,17 1,9"
                fill="none"
                stroke="#2a5c45"
                strokeWidth="1.2"
                opacity="0.4"
              />
              <polygon points="9,5 13,9 9,13 5,9" fill="#2a5c45" opacity="0.25" />
              <circle cx="9" cy="9" r="2" fill="#8B6914" opacity="0.5" />
            </svg>
            <div className="h-px flex-1 max-w-[60px] bg-gradient-to-l from-transparent to-surface3" />
          </div>

          {/* Text */}
          <h1
            className="font-display font-semibold text-ink mb-4"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
            }}
          >
            Страница затерялась в горах
          </h1>

          <p className="text-ash text-base leading-relaxed max-w-md mx-auto mb-10">
            Кажется, эта страница ушла в экспедицию и не вернулась. Возможно, она была
            переименована или удалена. Попробуйте вернуться на главную или заглянуть в
            каталог.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center h-11 px-7 rounded-xl text-sm font-medium bg-accent text-bg border border-accent hover:bg-accent2 hover:border-accent2 shadow-accent-sm hover:shadow-accent transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              На главную
            </Link>
            <Link
              href="/catalog"
              className="inline-flex items-center justify-center h-11 px-7 rounded-xl text-sm font-medium bg-transparent text-accent border border-accent/40 hover:bg-accent/8 hover:border-accent/70 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Открыть каталог
            </Link>
          </div>

          {/* Bottom ornament */}
          <div
            className="flex items-center justify-center gap-4 mt-12"
            aria-hidden="true"
          >
            <div className="h-px flex-1 max-w-[60px] bg-gradient-to-r from-transparent to-surface3" />
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <polygon
                points="9,1 17,9 9,17 1,9"
                fill="none"
                stroke="#2a5c45"
                strokeWidth="1.2"
                opacity="0.4"
              />
              <polygon points="9,5 13,9 9,13 5,9" fill="#2a5c45" opacity="0.25" />
              <circle cx="9" cy="9" r="2" fill="#8B6914" opacity="0.5" />
            </svg>
            <div className="h-px flex-1 max-w-[60px] bg-gradient-to-l from-transparent to-surface3" />
          </div>
        </div>
      </Container>
    </main>
  )
}
