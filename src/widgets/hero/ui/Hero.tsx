import { memo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Container } from '@/shared/ui/Container'
import heroPainting from '../../../../public/images/hero-painting.jpg'

export const Hero = memo(() => {
  return (
    <section className="relative overflow-hidden min-h-svh md:min-h-0 flex flex-col" aria-labelledby="hero-heading">
      {/* Painting background */}
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src={heroPainting}
          alt=""
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
          quality={90}
        />
      </div>

      {/* Layer 1: heavy top fade so text is always readable */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, rgba(242,237,230,0.92) 0%, rgba(242,237,230,0.78) 45%, rgba(242,237,230,0.45) 75%, rgba(242,237,230,0.15) 100%)',
        }}
        aria-hidden="true"
      />

      {/* Layer 2: warm tint */} 
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'rgba(242,237,230,0.18)' }}
        aria-hidden="true"
      />

      {/* Layer 3: carpet pattern */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.025]"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="carpet"
            x="0"
            y="0"
            width="80"
            height="80"
            patternUnits="userSpaceOnUse"
          >
            <polygon
              points="40,6 74,40 40,74 6,40"
              fill="none"
              stroke="#2a5c45"
              strokeWidth="1.5"
            />
            <polygon
              points="40,18 62,40 40,62 18,40"
              fill="none"
              stroke="#8B6914"
              strokeWidth="1"
            />
            <polygon points="40,28 52,40 40,52 28,40" fill="#2a5c45" opacity="0.4" />
            <line
              x1="0"
              y1="40"
              x2="80"
              y2="40"
              stroke="#2a5c45"
              strokeWidth="0.5"
              opacity="0.5"
            />
            <line
              x1="40"
              y1="0"
              x2="40"
              y2="80"
              stroke="#2a5c45"
              strokeWidth="0.5"
              opacity="0.5"
            />
            <circle cx="0" cy="0" r="2" fill="#8B6914" />
            <circle cx="80" cy="0" r="2" fill="#8B6914" />
            <circle cx="0" cy="80" r="2" fill="#8B6914" />
            <circle cx="80" cy="80" r="2" fill="#8B6914" />
            <circle cx="40" cy="0" r="2" fill="#2a5c45" />
            <circle cx="40" cy="80" r="2" fill="#2a5c45" />
            <circle cx="0" cy="40" r="2" fill="#2a5c45" />
            <circle cx="80" cy="40" r="2" fill="#2a5c45" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#carpet)" />
      </svg>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 w-full h-32 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, var(--color-bg))' }}
        aria-hidden="true"
      />

      <Container className="relative flex-1 flex flex-col md:block">
        <div className="flex flex-col items-center justify-center text-center flex-1 py-16 md:py-32 xl:py-40">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/6 px-4 py-1.5 mb-6 md:mb-8 backdrop-blur-[2px]">
            <span className="text-accent text-[10px] md:text-xs font-medium tracking-[2px] uppercase">
              Библиотека Кавказа
            </span>
          </div>

          {/* Heading */}
          <h1
            id="hero-heading"
            className="flex flex-col text-ink leading-[1.05] tracking-tight mb-4 md:mb-6"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 7vw, 5rem)',
            }}
          >
            <span>
              Библиотека <em className="text-accent not-italic">Кавказа</em>
            </span>
            <span
              className="text-ink/70 font-normal"
              style={{ fontSize: 'clamp(1.25rem, 4vw, 2.25rem)' }}
            >
              От древности до наших дней
            </span>
          </h1>

          {/* Description */}
          <p className="text-ink/60 text-sm md:text-lg leading-relaxed max-w-2xl mb-8 md:mb-10">
            Книги по истории, культуре, языкам, литературе и биографиям народов Кавказа и
            Закавказья. Редкие издания, которые почти невозможно найти в обычной продаже.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto mb-12 md:mb-16">
            <Link
              href="/catalog"
              className="inline-flex items-center justify-center h-11 md:h-12 px-7 md:px-8 w-full sm:w-auto rounded-xl text-sm md:text-base font-medium bg-accent text-bg border border-accent hover:bg-accent2 hover:border-accent2 shadow-accent-sm hover:shadow-accent transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Открыть каталог
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center h-11 md:h-12 px-7 md:px-8 w-full sm:w-auto rounded-xl text-sm md:text-base font-medium bg-bg/60 backdrop-blur-sm text-accent border border-accent/40 hover:bg-accent/8 hover:border-accent/70 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              О проекте
            </Link>
          </div>

          {/* Stats */}
          <dl className="flex flex-wrap justify-center gap-8 md:gap-12 pt-8 border-t border-surface2/70 w-full max-w-lg">
            {[
              { value: '200+', label: 'изданий' },
              { value: '7', label: 'разделов' },
              { value: '14', label: 'народов' },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-1">
                <dd
                  className="font-display font-semibold text-accent leading-none"
                  style={{ fontFamily: 'var(--font-display)', fontSize: '2rem' }}
                >
                  {item.value}
                </dd>
                <dt className="text-xs text-ink/50 uppercase tracking-widest">
                  {item.label}
                </dt>
              </div>
            ))}
          </dl>
        </div>
      </Container>
    </section>
  )
})

Hero.displayName = 'Hero'
