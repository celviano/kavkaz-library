import { memo } from 'react'
import Link from 'next/link'
import { Container } from '@/shared/ui/Container'

export const CtaBanner = memo(() => (
  <section aria-labelledby="cta-heading" className="py-20 border-t border-surface2">
    <Container>
      <div className="relative overflow-hidden rounded-3xl bg-dark px-5 md:px-16 py-10 md:py-16 text-center">
        {/* Kubachi ornament — light on dark */}
        <svg
          className="pointer-events-none absolute inset-0 w-full h-full"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="kubachi-cta"
              x="0"
              y="0"
              width="100"
              height="100"
              patternUnits="userSpaceOnUse"
            >
              <circle
                cx="50"
                cy="50"
                r="36"
                fill="none"
                stroke="#6abf99"
                strokeWidth="0.7"
                opacity="0.12"
              />
              <circle
                cx="50"
                cy="50"
                r="25"
                fill="none"
                stroke="#8B6914"
                strokeWidth="0.5"
                opacity="0.1"
              />
              <ellipse cx="50" cy="20" rx="5" ry="9" fill="#6abf99" opacity="0.07" />
              <ellipse
                cx="50"
                cy="20"
                rx="5"
                ry="9"
                fill="#6abf99"
                opacity="0.07"
                transform="rotate(45,50,50)"
              />
              <ellipse
                cx="50"
                cy="20"
                rx="5"
                ry="9"
                fill="#8B6914"
                opacity="0.07"
                transform="rotate(90,50,50)"
              />
              <ellipse
                cx="50"
                cy="20"
                rx="5"
                ry="9"
                fill="#8B6914"
                opacity="0.07"
                transform="rotate(135,50,50)"
              />
              <ellipse
                cx="50"
                cy="20"
                rx="5"
                ry="9"
                fill="#6abf99"
                opacity="0.07"
                transform="rotate(180,50,50)"
              />
              <ellipse
                cx="50"
                cy="20"
                rx="5"
                ry="9"
                fill="#6abf99"
                opacity="0.07"
                transform="rotate(225,50,50)"
              />
              <ellipse
                cx="50"
                cy="20"
                rx="5"
                ry="9"
                fill="#8B6914"
                opacity="0.07"
                transform="rotate(270,50,50)"
              />
              <ellipse
                cx="50"
                cy="20"
                rx="5"
                ry="9"
                fill="#8B6914"
                opacity="0.07"
                transform="rotate(315,50,50)"
              />
              <circle cx="50" cy="50" r="5" fill="#6abf99" opacity="0.09" />
              <circle cx="50" cy="50" r="2.5" fill="#8B6914" opacity="0.11" />
              <circle cx="0" cy="0" r="3.5" fill="#6abf99" opacity="0.07" />
              <circle cx="100" cy="0" r="3.5" fill="#6abf99" opacity="0.07" />
              <circle cx="0" cy="100" r="3.5" fill="#6abf99" opacity="0.07" />
              <circle cx="100" cy="100" r="3.5" fill="#6abf99" opacity="0.07" />
              <line
                x1="0"
                y1="50"
                x2="14"
                y2="50"
                stroke="#8B6914"
                strokeWidth="0.5"
                opacity="0.09"
              />
              <line
                x1="86"
                y1="50"
                x2="100"
                y2="50"
                stroke="#8B6914"
                strokeWidth="0.5"
                opacity="0.09"
              />
              <line
                x1="50"
                y1="0"
                x2="50"
                y2="14"
                stroke="#8B6914"
                strokeWidth="0.5"
                opacity="0.09"
              />
              <line
                x1="50"
                y1="86"
                x2="50"
                y2="100"
                stroke="#8B6914"
                strokeWidth="0.5"
                opacity="0.09"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#kubachi-cta)" />
        </svg>

        {/* Glow blobs */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute left-0 top-0 w-96 h-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/20 blur-[80px]" />
          <div className="absolute right-0 bottom-0 w-72 h-72 translate-x-1/3 translate-y-1/3 rounded-full bg-accent/15 blur-[60px]" />
        </div>

        <div className="relative flex flex-col items-center gap-4 md:gap-5 max-w-2xl mx-auto">
          <h2
            id="cta-heading"
            className="font-normal text-bg"
            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 5vw, 2.25rem)', lineHeight: 1.15 }}
          >
            Изучайте историю <em className="text-accent3 not-italic">Кавказа</em>
          </h2>
          <p className="text-bg/55 text-sm md:text-base leading-relaxed max-w-lg">
            История, культура, языки, литература и биографии — всё о народах Кавказа
            великой эпохи Кавказской войны и освоения региона.
          </p>
          <Link
            href="/catalog"
            className="inline-flex items-center justify-center h-10 md:h-12 px-6 md:px-8 rounded-xl text-sm md:text-base font-medium bg-accent text-bg border border-accent hover:bg-accent2 shadow-accent-sm hover:shadow-accent transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent3"
          >
            Перейти в каталог
          </Link>
        </div>
      </div>
    </Container>
  </section>
))

CtaBanner.displayName = 'CtaBanner'
