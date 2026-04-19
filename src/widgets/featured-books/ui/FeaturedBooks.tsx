'use client'

import { memo } from 'react'
import Link from 'next/link'
import { Container } from '@/shared/ui/Container'
import { SectionHeading } from '@/shared/ui/SectionHeading'
import { BookCardSkeleton } from '@/shared/ui/Skeleton'
import { BookGrid } from '@/widgets/book-grid'
import { useFeaturedBooks } from '@/entities/book'

export const FeaturedBooks = memo(() => {
  const { data: books = [], isLoading } = useFeaturedBooks()

  return (
    <section
      aria-labelledby="featured-heading"
      className="py-20 border-t border-surface2 relative overflow-hidden"
    >
      {/* Kubachi ornament background */}
      <svg
        className="pointer-events-none absolute inset-0 w-full h-full opacity-[0.85]"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="kubachi-feat"
            x="0"
            y="0"
            width="90"
            height="90"
            patternUnits="userSpaceOnUse"
          >
            {/* outer ring */}
            <circle
              cx="45"
              cy="45"
              r="32"
              fill="none"
              stroke="#8B6914"
              strokeWidth="0.7"
              opacity="0.13"
            />
            {/* inner ring */}
            <circle
              cx="45"
              cy="45"
              r="22"
              fill="none"
              stroke="#2a5c45"
              strokeWidth="0.5"
              opacity="0.11"
            />
            {/* 8 petals */}
            <ellipse cx="45" cy="19" rx="4.5" ry="8" fill="#8B6914" opacity="0.07" />
            <ellipse
              cx="45"
              cy="19"
              rx="4.5"
              ry="8"
              fill="#8B6914"
              opacity="0.07"
              transform="rotate(45,45,45)"
            />
            <ellipse
              cx="45"
              cy="19"
              rx="4.5"
              ry="8"
              fill="#2a5c45"
              opacity="0.07"
              transform="rotate(90,45,45)"
            />
            <ellipse
              cx="45"
              cy="19"
              rx="4.5"
              ry="8"
              fill="#2a5c45"
              opacity="0.07"
              transform="rotate(135,45,45)"
            />
            <ellipse
              cx="45"
              cy="19"
              rx="4.5"
              ry="8"
              fill="#8B6914"
              opacity="0.07"
              transform="rotate(180,45,45)"
            />
            <ellipse
              cx="45"
              cy="19"
              rx="4.5"
              ry="8"
              fill="#8B6914"
              opacity="0.07"
              transform="rotate(225,45,45)"
            />
            <ellipse
              cx="45"
              cy="19"
              rx="4.5"
              ry="8"
              fill="#2a5c45"
              opacity="0.07"
              transform="rotate(270,45,45)"
            />
            <ellipse
              cx="45"
              cy="19"
              rx="4.5"
              ry="8"
              fill="#2a5c45"
              opacity="0.07"
              transform="rotate(315,45,45)"
            />
            {/* center dot */}
            <circle cx="45" cy="45" r="4" fill="#8B6914" opacity="0.1" />
            <circle cx="45" cy="45" r="2" fill="#2a5c45" opacity="0.12" />
            {/* corner accents */}
            <circle cx="0" cy="0" r="3" fill="#2a5c45" opacity="0.08" />
            <circle cx="90" cy="0" r="3" fill="#2a5c45" opacity="0.08" />
            <circle cx="0" cy="90" r="3" fill="#2a5c45" opacity="0.08" />
            <circle cx="90" cy="90" r="3" fill="#2a5c45" opacity="0.08" />
            {/* connecting spurs */}
            <line
              x1="0"
              y1="45"
              x2="13"
              y2="45"
              stroke="#8B6914"
              strokeWidth="0.5"
              opacity="0.1"
            />
            <line
              x1="77"
              y1="45"
              x2="90"
              y2="45"
              stroke="#8B6914"
              strokeWidth="0.5"
              opacity="0.1"
            />
            <line
              x1="45"
              y1="0"
              x2="45"
              y2="13"
              stroke="#8B6914"
              strokeWidth="0.5"
              opacity="0.1"
            />
            <line
              x1="45"
              y1="77"
              x2="45"
              y2="90"
              stroke="#8B6914"
              strokeWidth="0.5"
              opacity="0.1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#kubachi-feat)" />
      </svg>

      <Container>
        <div className="flex items-end justify-between mb-10">
          <SectionHeading
            eyebrow="Рекомендуем"
            title="Избранные книги"
            id="featured-heading"
          />
          <Link
            href="/catalog"
            className="text-sm text-ash hover:text-ink transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent rounded hidden sm:inline-flex items-center gap-1"
          >
            Весь каталог <span aria-hidden="true">→</span>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid gap-5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <BookCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <BookGrid books={books} />
        )}

        <div className="mt-8 flex justify-center sm:hidden">
          <Link
            href="/catalog"
            className="inline-flex items-center justify-center h-10 px-6 rounded-lg text-sm font-medium bg-transparent text-accent border border-accent/40 hover:bg-accent/8 transition-all"
          >
            Весь каталог →
          </Link>
        </div>
      </Container>
    </section>
  )
})

FeaturedBooks.displayName = 'FeaturedBooks'
