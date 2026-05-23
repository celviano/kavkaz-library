'use client'

import { memo, useState } from 'react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import 'yet-another-react-lightbox/styles.css'

const Lightbox = dynamic(() => import('yet-another-react-lightbox'))

interface BookCoverProps {
  title: string
  year: number
  category: string
  coverUrl?: string | null
}

export const BookCover = memo<BookCoverProps>(({ title, year, category, coverUrl }) => {
  const [imgError, setImgError] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const showImage = Boolean(coverUrl) && !imgError

  return (
    <div className="lg:sticky lg:top-24">
      <div
        className="relative aspect-3/4 rounded-2xl overflow-hidden bg-surface border border-surface2 group/cover"
        role="img"
        aria-label={`Обложка — ${title}`}
      >
        {showImage ? (
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            className="absolute inset-0 z-10 cursor-zoom-in focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
            style={{ padding: 0, margin: 0, background: 'none', border: 'none' }}
            aria-label="Открыть в полный размер"
          >
            <Image
              src={coverUrl!}
              alt={`${title} — обложка`}
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
              priority
              onError={() => setImgError(true)}
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
                  id="cover-pat"
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
              <rect width="100%" height="100%" fill="url(#cover-pat)" />
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
              <span className="text-[11px] text-dim uppercase tracking-widest">Обложка</span>
            </div>
          </>
        )}

        {/* Category badge */}
        <div className="absolute top-3.5 left-3.5 bg-accent text-bg text-[10px] font-medium px-3 py-1 rounded-full z-20 pointer-events-none">
          {category}
        </div>

        {/* Zoom hint */}
        {showImage && (
          <div className="absolute bottom-3.5 left-3.5 z-20 flex items-center gap-1.5 bg-bg/70 backdrop-blur-sm px-2.5 py-1 rounded-full opacity-0 group-hover/cover:opacity-100 transition-opacity duration-200 pointer-events-none">
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
      </div>

      {/* YARL Lightbox — lazy, монтируется только при открытии */}
      {lightboxOpen && showImage && (
        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          slides={[{ src: coverUrl! }]}
          controller={{ closeOnBackdropClick: true }}
          render={{ buttonPrev: () => null, buttonNext: () => null }}
          styles={{
            container: { backgroundColor: 'rgba(27, 34, 18, 0.93)' },
            button: { color: '#a8998a', filter: 'none' },
          }}
        />
      )}
    </div>
  )
})

BookCover.displayName = 'BookCover'
