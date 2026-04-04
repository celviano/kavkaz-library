'use client'

import { memo, useState, useCallback, useEffect } from 'react'
import Image from 'next/image'
import { cn } from '@/shared/lib/cn'

interface BookSliderProps {
  title: string
  year: number
  category: string
  coverUrl?: string | null
  images?: string[]
}

export const BookSlider = memo<BookSliderProps>(
  ({ title, year, category, coverUrl, images = [] }) => {
    const allSlides: { url: string | null; label: string }[] = [
      { url: coverUrl ?? null, label: 'Обложка' },
      ...images.map((url, i) => ({ url, label: `Фото ${i + 1}` })),
    ]

    const PLACEHOLDER_LABELS = ['Титульный лист', 'Карта региона', 'Оглавление']
    const slides =
      allSlides.length < 2
        ? [
            ...allSlides,
            ...PLACEHOLDER_LABELS.slice(0, 3).map((label) => ({ url: null, label })),
          ]
        : allSlides

    const [current, setCurrent] = useState(0)
    const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({})
    const [loading, setLoading] = useState(false)
    const [modalOpen, setModalOpen] = useState(false)

    const currentSlide = slides[current]
    const showImage = Boolean(currentSlide.url) && !imgErrors[current]

    const goTo = useCallback(
      (index: number) => {
        if (index === current) return
        const nextSlide = slides[index]
        if (nextSlide.url && !imgErrors[index]) setLoading(true)
        setCurrent(index)
      },
      [current, slides, imgErrors],
    )

    const prev = useCallback(
      () => goTo((current - 1 + slides.length) % slides.length),
      [current, slides.length, goTo],
    )
    const next = useCallback(
      () => goTo((current + 1) % slides.length),
      [current, slides.length, goTo],
    )

    useEffect(() => {
      if (!modalOpen) return
      const handler = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setModalOpen(false)
        if (e.key === 'ArrowLeft') prev()
        if (e.key === 'ArrowRight') next()
      }
      document.addEventListener('keydown', handler)
      document.body.style.overflow = 'hidden'
      return () => {
        document.removeEventListener('keydown', handler)
        document.body.style.overflow = ''
      }
    }, [modalOpen, prev, next])

    return (
      <>
        <div className="flex flex-col gap-3 lg:sticky lg:top-24">
          {/* Main slide */}
          <div
            className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-surface border border-surface2 group/main"
            role="img"
            aria-label={`${currentSlide.label} — ${title}`}
          >
            {/* Loader */}
            {loading && showImage && (
              <div className="absolute inset-0 z-30 flex items-center justify-center bg-surface/60 backdrop-blur-[2px]">
                <div className="w-8 h-8 rounded-full border-2 border-surface2 border-t-accent animate-spin" />
              </div>
            )}

            {/* Real image */}
            {showImage && (
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="absolute inset-0 z-10 cursor-zoom-in focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
                style={{ padding: 0, margin: 0, background: 'none', border: 'none' }}
                aria-label="Открыть в полный размер"
              >
                <Image
                  src={currentSlide.url!}
                  alt={`${title} — ${currentSlide.label}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className={cn(
                    'object-cover transition-opacity duration-300',
                    loading ? 'opacity-0' : 'opacity-100',
                  )}
                  priority={current === 0}
                  onLoad={() => setLoading(false)}
                  onError={() => {
                    setImgErrors((prev) => ({ ...prev, [current]: true }))
                    setLoading(false)
                  }}
                />
              </button>
            )}

            {/* Placeholder */}
            {!showImage && (
              <>
                <span
                  className="absolute inset-0 flex items-center justify-center font-display font-bold text-accent/[0.07] select-none pointer-events-none leading-none"
                  style={{ fontFamily: 'var(--font-display)', fontSize: '9rem' }}
                  aria-hidden="true"
                >
                  {year}
                </span>
                <svg
                  className="absolute inset-0 w-full h-full opacity-[0.04]"
                  preserveAspectRatio="xMidYMid slice"
                  aria-hidden="true"
                >
                  <defs>
                    <pattern
                      id="slider-pat"
                      x="0"
                      y="0"
                      width="60"
                      height="60"
                      patternUnits="userSpaceOnUse"
                    >
                      <polygon
                        points="30,4 56,30 30,56 4,30"
                        fill="none"
                        stroke="#2a5c45"
                        strokeWidth="1"
                      />
                      <polygon
                        points="30,14 46,30 30,46 14,30"
                        fill="none"
                        stroke="#8B6914"
                        strokeWidth="0.7"
                      />
                      <circle cx="30" cy="30" r="3" fill="#2a5c45" />
                      <circle cx="0" cy="0" r="1.5" fill="#8B6914" />
                      <circle cx="60" cy="0" r="1.5" fill="#8B6914" />
                      <circle cx="0" cy="60" r="1.5" fill="#8B6914" />
                      <circle cx="60" cy="60" r="1.5" fill="#8B6914" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#slider-pat)" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10">
                  <svg
                    width="52"
                    height="52"
                    viewBox="0 0 52 52"
                    fill="none"
                    className="opacity-[0.18]"
                  >
                    <path d="M8 46 L20 10 L32 46 H8Z" fill="#2a5c45" />
                    <path d="M24 46 L34 18 L44 46 H24Z" fill="#2a5c45" opacity="0.55" />
                    <path d="M20 10 L24 20H16L20 10Z" fill="#f2ede6" opacity="0.6" />
                    <path d="M34 18 L37 26H31L34 18Z" fill="#f2ede6" opacity="0.5" />
                  </svg>
                  <span className="text-[11px] text-dim uppercase tracking-widest">
                    {currentSlide.label}
                  </span>
                </div>
              </>
            )}

            {/* Category badge */}
            <div className="absolute top-3.5 left-3.5 bg-accent text-bg text-[10px] font-medium px-3 py-1 rounded-full z-20">
              {category}
            </div>

            {/* Zoom hint */}
            {showImage && (
              <div className="absolute bottom-3.5 left-3.5 z-20 flex items-center gap-1.5 bg-bg/70 backdrop-blur-sm px-2.5 py-1 rounded-full opacity-0 group-hover/main:opacity-100 transition-opacity duration-200 pointer-events-none">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-ash"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35M11 8v6M8 11h6" />
                </svg>
                <span className="text-[10px] text-ash">Увеличить</span>
              </div>
            )}

            {/* Counter */}
            <div className="absolute bottom-3.5 right-3.5 text-[11px] font-mono text-ash z-20 bg-bg/60 backdrop-blur-sm px-2 py-0.5 rounded-full">
              {current + 1} / {slides.length}
            </div>

            {/* Arrows — visible on hover */}
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-bg/80 backdrop-blur-sm border border-surface2 flex items-center justify-center text-ash hover:text-accent hover:border-accent/40 transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-accent opacity-0 group-hover/main:opacity-100"
              aria-label="Предыдущее фото"
            >
              ‹
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-bg/80 backdrop-blur-sm border border-surface2 flex items-center justify-center text-ash hover:text-accent hover:border-accent/40 transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-accent opacity-0 group-hover/main:opacity-100"
              aria-label="Следующее фото"
            >
              ›
            </button>
          </div>

          {/* Thumbnails — horizontal scroll */}
          <div
            className="flex gap-2 overflow-x-auto pb-1"
            role="list"
            aria-label="Миниатюры"
            style={{ scrollbarWidth: 'none' }}
          >
            {slides.map((slide, i) => {
              const thumbHasImage = Boolean(slide.url) && !imgErrors[i]
              const isActive = current === i
              return (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  role="listitem"
                  aria-label={slide.label}
                  aria-pressed={isActive}
                  className={cn(
                    'relative flex-shrink-0 w-16 aspect-[3/4] rounded-xl border overflow-hidden',
                    'transition-all duration-200 cursor-pointer',
                    'focus-visible:outline-2 focus-visible:outline-accent',
                    isActive
                      ? 'border-accent ring-1 ring-accent/30 scale-[1.04]'
                      : 'border-surface2 hover:border-surface3 opacity-70 hover:opacity-100',
                  )}
                >
                  {thumbHasImage ? (
                    <Image
                      src={slide.url!}
                      alt={slide.label}
                      fill
                      sizes="64px"
                      className="object-cover"
                      onError={() => setImgErrors((prev) => ({ ...prev, [i]: true }))}
                    />
                  ) : (
                    <div
                      className={cn(
                        'w-full h-full flex items-center justify-center',
                        isActive ? 'bg-accent/8' : 'bg-surface',
                      )}
                    >
                      <svg
                        width="14"
                        height="18"
                        viewBox="0 0 16 20"
                        fill="none"
                        className="opacity-30"
                      >
                        <path d="M2 18 L6 4 L10 18H2Z" fill="currentColor" />
                        <path
                          d="M8 18 L11 8 L14 18H8Z"
                          fill="currentColor"
                          opacity="0.6"
                        />
                      </svg>
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Modal lightbox */}
        {modalOpen && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center"
            role="dialog"
            aria-modal="true"
            aria-label={`${title} — ${currentSlide.label}`}
          >
            <div
              className="absolute inset-0 bg-ink/90 backdrop-blur-sm"
              onClick={() => setModalOpen(false)}
            />

            <div className="relative z-10 flex flex-col items-center gap-4 w-full max-w-4xl px-4">
              <button
                onClick={() => setModalOpen(false)}
                className="absolute -top-2 right-4 w-9 h-9 rounded-full bg-bg/10 border border-bg/20 flex items-center justify-center text-bg/80 hover:text-bg hover:bg-bg/20 transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-bg"
                aria-label="Закрыть"
              >
                ✕
              </button>

              <div
                className="relative flex items-center justify-center"
                style={{ maxHeight: '80vh' }}
              >
                {showImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={currentSlide.url!}
                    alt={`${title} — ${currentSlide.label}`}
                    className="max-w-full max-h-[80vh] w-auto h-auto object-contain rounded-xl shadow-2xl"
                  />
                ) : (
                  <div className="flex items-center justify-center h-64 text-bg/40 text-sm">
                    Изображение недоступно
                  </div>
                )}
              </div>

              <div className="flex items-center gap-6">
                <button
                  onClick={prev}
                  className="w-10 h-10 rounded-full bg-bg/10 border border-bg/20 flex items-center justify-center text-bg/80 hover:text-bg hover:bg-bg/20 transition-all cursor-pointer text-lg"
                  aria-label="Предыдущее"
                >
                  ‹
                </button>
                <span className="text-bg/60 text-sm font-medium min-w-[120px] text-center">
                  {currentSlide.label} · {current + 1} / {slides.length}
                </span>
                <button
                  onClick={next}
                  className="w-10 h-10 rounded-full bg-bg/10 border border-bg/20 flex items-center justify-center text-bg/80 hover:text-bg hover:bg-bg/20 transition-all cursor-pointer text-lg"
                  aria-label="Следующее"
                >
                  ›
                </button>
              </div>

              <div
                className="flex gap-2 overflow-x-auto pb-1"
                style={{ scrollbarWidth: 'none' }}
              >
                {slides.map((slide, i) => {
                  const thumbHasImage = Boolean(slide.url) && !imgErrors[i]
                  return (
                    <button
                      key={i}
                      onClick={() => goTo(i)}
                      aria-label={slide.label}
                      aria-pressed={current === i}
                      className={cn(
                        'relative flex-shrink-0 w-12 aspect-[3/4] rounded-lg border overflow-hidden transition-all duration-200 cursor-pointer',
                        current === i
                          ? 'border-bg/80 ring-1 ring-bg/40 scale-[1.08]'
                          : 'border-bg/20 opacity-50 hover:opacity-80',
                      )}
                    >
                      {thumbHasImage ? (
                        <Image
                          src={slide.url!}
                          alt={slide.label}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-bg/10 flex items-center justify-center">
                          <svg
                            width="10"
                            height="14"
                            viewBox="0 0 16 20"
                            fill="none"
                            className="opacity-40"
                          >
                            <path d="M2 18 L6 4 L10 18H2Z" fill="white" />
                          </svg>
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </>
    )
  },
)

BookSlider.displayName = 'BookSlider'
