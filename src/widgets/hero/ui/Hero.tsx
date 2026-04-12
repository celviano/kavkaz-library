import { memo } from 'react'
import Link from 'next/link'
import { Container } from '@/shared/ui/Container'

export const Hero = memo(() => {
  return (
    <section className="relative overflow-hidden" aria-labelledby="hero-heading">
      {/* ── Carpet pattern (subtle, full bg) ── */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.045]"
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

      {/* ── Mountain silhouette (bottom) ── */}
      <svg
        className="absolute bottom-0 left-0 w-full opacity-[0.065]"
        viewBox="0 0 1200 160"
        preserveAspectRatio="xMidYMax slice"
        aria-hidden="true"
      >
        {/* Back range — dark */}
        <path
          d="M0 160 L0 90 L100 20 L180 80 L280 10 L380 70 L460 0 L560 60 L640 15 L740 75 L820 5 L920 65 L1000 20 L1100 70 L1200 30 L1200 160 Z"
          fill="#1B2212"
        />
        {/* Front range — green tint */}
        <path
          d="M0 160 L0 110 L80 60 L150 100 L240 45 L330 95 L420 50 L510 90 L600 55 L690 100 L780 45 L870 90 L960 55 L1050 95 L1140 60 L1200 100 L1200 160 Z"
          fill="#2a5c45"
          opacity="0.6"
        />
        {/* Snow caps */}
        <path d="M100 20 L115 42 L85  42 Z" fill="#f2ede6" opacity="0.55" />
        <path d="M280 10 L295 32 L265 32 Z" fill="#f2ede6" opacity="0.5" />
        <path d="M460 0  L478 28 L442 28 Z" fill="#f2ede6" opacity="0.6" />
        <path d="M640 15 L654 36 L626 36 Z" fill="#f2ede6" opacity="0.5" />
        <path d="M820 5  L836 30 L804 30 Z" fill="#f2ede6" opacity="0.55" />
        <path d="M1000 20 L1015 42 L985 42 Z" fill="#f2ede6" opacity="0.5" />
      </svg>

      {/* ── Fade: keep mountains from competing with text ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, rgba(242,237,230,0.88) 0%, rgba(242,237,230,0.6) 60%, rgba(242,237,230,0.15) 100%)',
        }}
        aria-hidden="true"
      />

      {/* ── Content ── */}
      <Container className="relative">
        <div className="flex flex-col items-center text-center py-24 md:py-32 xl:py-40">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2.5 rounded-full border border-accent/20 bg-accent/6 px-5 py-2 mb-8">
            <span className="text-accent text-xs font-medium tracking-[2px] uppercase">
              Библиотека Кавказа
            </span>
          </div>

          {/* Heading */}
          <h1
            id="hero-heading"
            className="flex flex-col font-display text-ink leading-[1.05] tracking-tight mb-6"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.5rem, 6vw, 5rem)',
            }}
          >
            <span>
              Библиотека <em className="text-accent not-italic">Кавказа</em>
            </span>

            <span className="text-ash text-4xl font-normal">
              От древности до наших дней
            </span>
          </h1>

          {/* Description */}
          <p className="text-ash text-lg leading-relaxed max-w-2xl mb-10">
            Книги по истории, культуре, языкам, литературе и биографиям народов Кавказа и Закавказья.
            Редкие издания, которые почти невозможно найти в обычной продаже.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 mb-16">
            <Link
              href="/catalog"
              className="inline-flex items-center justify-center h-12 px-8 rounded-xl text-base font-medium bg-accent text-bg border border-accent hover:bg-accent2 hover:border-accent2 shadow-accent-sm hover:shadow-accent transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Открыть каталог
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center h-12 px-8 rounded-xl text-base font-medium bg-transparent text-accent border border-accent/40 hover:bg-accent/8 hover:border-accent/70 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              О проекте
            </Link>
          </div>

          {/* Stats */}
          <dl className="flex flex-wrap justify-center gap-12 pt-8 border-t border-surface2 w-full max-w-lg">
            {[
              { value: '200+', label: 'изданий' },
              { value: '7', label: 'разделов' },
              { value: '6', label: 'разделов' },
            ].map((item, index) => (
              <div key={index} className="flex flex-col items-center gap-1">
                <dd
                  className="font-display font-semibold text-accent leading-none"
                  style={{ fontFamily: 'var(--font-display)', fontSize: '2rem' }}
                >
                  {item.value}
                </dd>
                <dt className="text-xs text-ash uppercase tracking-widest">{item.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </Container>
    </section>
  )
})

Hero.displayName = 'Hero'
