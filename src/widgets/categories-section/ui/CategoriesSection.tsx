'use client'

import { memo } from 'react'
import Link from 'next/link'
import { Container } from '@/shared/ui/Container'
import { SectionHeading } from '@/shared/ui/SectionHeading'
import { Badge } from '@/shared/ui/Badge'
import { CATEGORIES, CATEGORY_LABELS } from '@/shared/config/constants'
import { useCategoryCounts } from '@/entities/book'

export const CategoriesSection = memo(() => {
  const { data: counts = {} } = useCategoryCounts()

  return (
    <section
      aria-labelledby="categories-heading"
      className="py-20 border-t border-surface2 bg-surface/40 relative overflow-hidden"
    >
      {/* Mountain silhouette background — second layer, offset from QuoteBanner */}
      <svg
        className="pointer-events-none absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 1440 320"
        aria-hidden="true"
      >
        {/* Far peaks — different profile from QuoteBanner */}
        <path
          d="M-20,320 L80,160 L150,195 L230,115 L310,165 L400,85 L490,140 L570,60 L660,120 L750,50 L840,110 L930,80 L1020,135 L1110,70 L1200,120 L1290,88 L1380,140 L1460,320Z"
          fill="#2a5c45"
          opacity="0.05"
        />
        {/* Mid range */}
        <path
          d="M-20,320 L50,240 L130,252 L210,225 L290,242 L370,212 L450,230 L540,205 L620,225 L710,198 L790,218 L880,205 L960,228 L1050,210 L1130,232 L1210,215 L1310,235 L1460,320Z"
          fill="#8B6914"
          opacity="0.045"
        />
        {/* Snow caps */}
        <path d="M570,60  L588,88  L552,85Z" fill="#e8e0d4" opacity="0.45" />
        <path d="M750,50  L766,78  L734,75Z" fill="#e8e0d4" opacity="0.45" />
        <path d="M930,80  L944,104 L916,101Z" fill="#e8e0d4" opacity="0.4" />
        <path d="M1110,70 L1124,96 L1096,93Z" fill="#e8e0d4" opacity="0.4" />
      </svg>

      <Container>
        <div className="mb-10">
          <SectionHeading eyebrow="Разделы" title="Категории" id="categories-heading" />
        </div>
        <ul
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
          role="list"
          aria-label="Список категорий"
        >
          {CATEGORIES.map((cat) => {
            const count = counts[cat] ?? 0
            return (
              <li key={cat}>
                <Link
                  href={`/catalog?category=${cat}`}
                  className="flex flex-col gap-3 p-5 rounded-2xl bg-bg border border-surface2 hover:border-accent/30 hover:shadow-accent-sm transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent shadow-card"
                  aria-label={`${CATEGORY_LABELS[cat]}: ${count} книг`}
                >
                  <Badge category={cat} label={CATEGORY_LABELS[cat]} />
                  <span
                    className="font-display font-semibold text-accent"
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.75rem',
                      lineHeight: 1,
                    }}
                  >
                    {count}
                  </span>
                  <span className="text-[11px] text-ash uppercase tracking-wider">
                    {count === 1 ? 'книга' : count < 5 ? 'книги' : 'книг'}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </Container>
    </section>
  )
})

CategoriesSection.displayName = 'CategoriesSection'
