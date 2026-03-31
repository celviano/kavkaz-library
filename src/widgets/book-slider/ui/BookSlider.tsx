'use client'

import { memo, useState } from 'react'
import { cn } from '@/shared/lib/cn'

interface BookSliderProps {
  title: string
  year: number
  category: string
}

const SLIDE_LABELS = [
  'Обложка',
  'Титульный лист',
  'Карта региона',
  'Оглавление',
]

export const BookSlider = memo<BookSliderProps>(({ title, year, category }) => {
  const [current, setCurrent] = useState(0)

  const prev = () => setCurrent((c) => (c - 1 + SLIDE_LABELS.length) % SLIDE_LABELS.length)
  const next = () => setCurrent((c) => (c + 1) % SLIDE_LABELS.length)

  return (
    <div className="flex flex-col gap-4 lg:sticky lg:top-24">

      {/* Main slide */}
      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-surface border border-surface2">
        {/* Year watermark */}
        <span
          className="absolute inset-0 flex items-center justify-center font-display font-bold text-accent/[0.07] select-none pointer-events-none leading-none"
          style={{ fontFamily: 'var(--font-display)', fontSize: '9rem' }}
          aria-hidden="true"
        >
          {year}
        </span>

        {/* Carpet ornament */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.04]" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <pattern id="slider-pat" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <polygon points="30,4 56,30 30,56 4,30" fill="none" stroke="#2a5c45" strokeWidth="1" />
              <polygon points="30,14 46,30 30,46 14,30" fill="none" stroke="#8B6914" strokeWidth="0.7" />
              <circle cx="30" cy="30" r="3" fill="#2a5c45" />
              <circle cx="0"  cy="0"  r="1.5" fill="#8B6914" />
              <circle cx="60" cy="0"  r="1.5" fill="#8B6914" />
              <circle cx="0"  cy="60" r="1.5" fill="#8B6914" />
              <circle cx="60" cy="60" r="1.5" fill="#8B6914" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#slider-pat)" />
        </svg>

        {/* Placeholder content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10">
          <svg width="52" height="52" viewBox="0 0 52 52" fill="none" className="opacity-[0.18]">
            <path d="M8 46 L20 10 L32 46 H8Z" fill="#2a5c45" />
            <path d="M24 46 L34 18 L44 46 H24Z" fill="#2a5c45" opacity="0.55" />
            <path d="M20 10 L24 20H16L20 10Z" fill="#f2ede6" opacity="0.6" />
            <path d="M34 18 L37 26H31L34 18Z" fill="#f2ede6" opacity="0.5" />
          </svg>
          <span className="text-[11px] text-dim uppercase tracking-widest">
            {SLIDE_LABELS[current]}
          </span>
        </div>

        {/* Category badge */}
        <div className="absolute top-3.5 left-3.5 bg-accent text-bg text-[10px] font-medium px-3 py-1 rounded-full z-20">
          {category}
        </div>

        {/* Slide counter */}
        <div className="absolute bottom-3.5 right-3.5 text-[11px] font-mono text-ash z-20">
          {current + 1} / {SLIDE_LABELS.length}
        </div>

        {/* Arrow overlays */}
        <button
          onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-bg/80 border border-surface2 flex items-center justify-center text-ash hover:text-accent hover:border-accent/40 transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-accent"
          aria-label="Предыдущее фото"
        >
          ‹
        </button>
        <button
          onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-bg/80 border border-surface2 flex items-center justify-center text-ash hover:text-accent hover:border-accent/40 transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-accent"
          aria-label="Следующее фото"
        >
          ›
        </button>
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-4 gap-2" role="list" aria-label="Миниатюры">
        {SLIDE_LABELS.map((label, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            role="listitem"
            aria-label={label}
            aria-pressed={current === i}
            className={cn(
              'aspect-[3/4] rounded-xl border flex items-center justify-center',
              'text-xs text-ash transition-all duration-150 cursor-pointer',
              'focus-visible:outline-2 focus-visible:outline-accent',
              current === i
                ? 'border-accent bg-accent/8 text-accent'
                : 'border-surface2 bg-surface hover:border-surface3',
            )}
          >
            <svg width="16" height="20" viewBox="0 0 16 20" fill="none" className="opacity-40">
              <path d="M2 18 L6 4 L10 18H2Z" fill="currentColor" />
              <path d="M8 18 L11 8 L14 18H8Z" fill="currentColor" opacity="0.6" />
            </svg>
          </button>
        ))}
      </div>

    </div>
  )
})

BookSlider.displayName = 'BookSlider'
