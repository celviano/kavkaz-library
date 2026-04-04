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
    <section aria-labelledby="categories-heading" className="py-20 border-t border-surface2 bg-surface/40">
      <Container>
        <div className="mb-10">
          <SectionHeading eyebrow="Разделы" title="Категории" id="categories-heading" />
        </div>
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4" role="list" aria-label="Список категорий">
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
                    style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', lineHeight: 1 }}
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
