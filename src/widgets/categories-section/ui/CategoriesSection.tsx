'use client'

import { memo } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { useCategoryCounts } from '@/entities/book'
import { CATEGORIES, CATEGORY_LABELS } from '@/shared/config/constants'
import { Badge } from '@/shared/ui/Badge'
import { Container } from '@/shared/ui/Container'
import { SectionHeading } from '@/shared/ui/SectionHeading'

import categoriesPainting from '../../../../public/images/categories-painting.jpg'

export const CategoriesSection = memo(() => {
  const { data: counts = {} } = useCategoryCounts()

  return (
    <section
      aria-labelledby="categories-heading"
      className="py-20 border-t border-surface2 relative overflow-hidden"
    >
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src={categoriesPainting}
          alt=""
          fill
          className="object-cover object-center"
          sizes="100vw"
          quality={85}
        />
      </div>
      <div
        className="absolute opacity-60 inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, rgba(242,237,230,0.93) 0%, rgba(242,237,230,0.82) 50%, rgba(242,237,230,0.93) 100%)',
        }}
        aria-hidden="true"
      />

      <Container className="relative z-10">
        <div className="mb-10">
          <SectionHeading eyebrow="Разделы" title="Категории" id="categories-heading" />
        </div>
        <ul
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3"
          aria-label="Список категорий"
        >
          {CATEGORIES.slice(0, 6).map((cat) => {
            const count = counts[cat] ?? 0
            return (
              <li key={cat} className="flex">
                <Link
                  href={`/catalog?category=${cat}`}
                  className={
                    'flex flex-col gap-2 p-3 sm:p-2 rounded-2xl ' +
                    'bg-bg border border-surface2 hover:border-accent/30 ' +
                    'hover:shadow-accent-sm transition-all duration-200 ' +
                    'focus-visible:outline-2 focus-visible:outline-offset-2 ' +
                    'focus-visible:outline-accent shadow-card w-full'
                  }
                  aria-label={`${CATEGORY_LABELS[cat]}: ${count} книг`}
                >
                  <div className="flex justify-center md:justify-start ">
                    <Badge category={cat} label={CATEGORY_LABELS[cat]} />
                  </div>

                  <span className="font-normal text-[12px] md:text-base  text-accent">
                    {count}
                  </span>
                  <span className="text-[8px] sm:text-[11px] text-ash uppercase tracking-wider">
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
