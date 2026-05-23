'use client'

import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import useEmblaCarousel from 'embla-carousel-react'
import 'yet-another-react-lightbox/styles.css'

import { cn } from '@/shared/lib/cn'

const Lightbox = dynamic(() => import('yet-another-react-lightbox'))

interface BookSliderProps {
  title: string
  year: number
  category: string
  coverUrl?: string | null
  images?: string[]
}

export const BookSlider = memo<BookSliderProps>(
  ({ title, year, category, coverUrl, images = [] }) => {
    const slides = useMemo(() => {
      const allSlides: { url: string | null; label: string }[] = [
        { url: coverUrl ?? null, label: 'Обложка' },
        ...images.map((url, i) => ({ url, label: `Фото ${i + 1}` })),
      ]
      const PLACEHOLDER_LABELS = ['Титульный лист', 'Карта региона', 'Оглавление']
      return allSlides.length < 2
        ? [
            ...allSlides,
            ...PLACEHOLDER_LABELS.slice(0, 3).map((label) => ({ url: null, label })),
          ]
        : allSlides
    }, [coverUrl, images])

    const [current, setCurrent] = useState(0)
    const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({})
    const [lightboxOpen, setLightboxOpen] = useState(false)
    const [lightboxIndex, setLightboxIndex] = useState(0)

    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })

    const onSelect = useCallback(() => {
      if (!emblaApi) return
      setCurrent(emblaApi.selectedScrollSnap())
    }, [emblaApi])

    useEffect(() => {
      if (!emblaApi) return
      emblaApi.on('select', onSelect)
      return () => {
        emblaApi.off('select', onSelect)
      }
    }, [emblaApi, onSelect])

    const lightboxSlides = useMemo(
      () =>
        slides
          .filter((s, i) => Boolean(s.url) && !imgErrors[i])
          .map((s) => ({ src: s.url! })),
      [slides, imgErrors],
    )

    const openLightbox = useCallback(
      (slideIndex: number) => {
        const realWithIndex = slides
          .map((s, i) => ({ ...s, i }))
          .filter((s) => Boolean(s.url) && !imgErrors[s.i])
        const idx = realWithIndex.findIndex((s) => s.i === slideIndex)
        if (idx === -1) return
        setLightboxIndex(idx)
        setLightboxOpen(true)
      },
      [slides, imgErrors],
    )

    const goTo = useCallback(
      (index: number) => {
        emblaApi?.scrollTo(index)
      },
      [emblaApi],
    )

    const currentSlide = slides[current]
    const showImage = Boolean(currentSlide?.url) && !imgErrors[current]

    return (
      <>
        <div className="flex flex-col gap-3 lg:sticky lg:top-24">
          {/* Main slider */}
          <div className="relative aspect-3/4 rounded-2xl overflow-hidden bg-surface border border-surface2 group/main">
            {/* Embla viewport */}
            <div ref={emblaRef} className="absolute inset-0 overflow-hidden">
              <div className="flex h-full">
                {slides.map((slide, i) => {
                  const hasImage = Boolean(slide.url) && !imgErrors[i]
                  return (
                    <div
                      key={i}
                      className="relative flex-[0_0_100%] h-full min-w-0"
                      role="img"
                      aria-label={`${slide.label} — ${title}`}
                    >
                      {hasImage ? (
                        <button
                          type="button"
                          onClick={() => openLightbox(i)}
                          className="absolute inset-0 z-10 cursor-zoom-in focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
                          style={{ padding: 0, margin: 0, background: 'none', border: 'none' }}
                          aria-label="Открыть в полный размер"
                        >
                          <Image
                            src={slide.url!}
                            alt={`${title} — ${slide.label}`}
                            fill
                            sizes="(max-width: 1024px) 100vw, 40vw"
                            className="object-cover"
                            priority={i === 0}
                            onError={() => setImgErrors((prev) => ({ ...prev, [i]: true }))}
                          />
                        </button>
                      ) : (
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
                                id={`slider-pat-${i}`}
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
                            <rect width="100%" height="100%" fill={`url(#slider-pat-${i})`} />
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
                              <path
                                d="M24 46 L34 18 L44 46 H24Z"
                                fill="#2a5c45"
                                opacity="0.55"
                              />
                              <path d="M20 10 L24 20H16L20 10Z" fill="#f2ede6" opacity="0.6" />
                              <path d="M34 18 L37 26H31L34 18Z" fill="#f2ede6" opacity="0.5" />
                            </svg>
                            <span className="text-[11px] text-dim uppercase tracking-widest">
                              {slide.label}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Category badge */}
            <div className="absolute top-3.5 left-3.5 bg-accent text-bg text-[10px] font-medium px-3 py-1 rounded-full z-20 pointer-events-none">
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
            <div className="absolute bottom-3.5 right-3.5 text-[11px] font-mono text-ash z-20 bg-bg/60 backdrop-blur-sm px-2 py-0.5 rounded-full pointer-events-none">
              {current + 1} / {slides.length}
            </div>

            {/* Arrows */}
            <button
              onClick={() => emblaApi?.scrollPrev()}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-bg/80 backdrop-blur-sm border border-surface2 flex items-center justify-center text-ash hover:text-accent hover:border-accent/40 transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-accent opacity-0 group-hover/main:opacity-100"
              aria-label="Предыдущее фото"
            >
              ‹
            </button>
            <button
              onClick={() => emblaApi?.scrollNext()}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-bg/80 backdrop-blur-sm border border-surface2 flex items-center justify-center text-ash hover:text-accent hover:border-accent/40 transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-accent opacity-0 group-hover/main:opacity-100"
              aria-label="Следующее фото"
            >
              ›
            </button>
          </div>

          {/* Thumbnails */}
          <ul
            className="flex gap-2 overflow-x-auto pb-1"
            aria-label="Миниатюры"
            style={{ scrollbarWidth: 'none' }}
          >
            {slides.map((slide, i) => {
              const thumbHasImage = Boolean(slide.url) && !imgErrors[i]
              const isActive = current === i
              return (
                <li key={i}>
                  <button
                    onClick={() => goTo(i)}
                    aria-label={slide.label}
                    aria-pressed={isActive}
                    className={cn(
                      'relative shrink-0 w-16 aspect-3/4 rounded-xl border overflow-hidden',
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
                </li>
              )
            })}
          </ul>
        </div>

        {/* YARL Lightbox — lazy, монтируется только при открытии */}
        {lightboxOpen && (
          <Lightbox
            open={lightboxOpen}
            close={() => setLightboxOpen(false)}
            index={lightboxIndex}
            slides={lightboxSlides}
            controller={{ closeOnBackdropClick: true }}
            styles={{
              container: { backgroundColor: 'rgba(27, 34, 18, 0.93)' },
              button: { color: '#a8998a', filter: 'none' },
            }}
            className="yarl-kavkaz"
          />
        )}
      </>
    )
  },
)

BookSlider.displayName = 'BookSlider'
