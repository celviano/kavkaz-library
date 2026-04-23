// src/pages/about/ui/AboutHero.tsx
import Image from 'next/image'
import { Container } from '@/shared/ui/Container'
import aboutPainting from '../../../../public/images/about-hero-painting.jpg'

export function AboutHero() {
  return (
    <section
      className="relative overflow-hidden min-h-svh md:min-h-0 flex flex-col py-14 md:py-32"
      aria-labelledby="about-heading"
    >
      {/* Painting background */}
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src={aboutPainting}
          alt=""
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
          quality={90}
        />
      </div>

      {/* Layer 1: gradient overlay */}
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
        style={{ background: 'rgba(242,237,230,0.15)' }}
        aria-hidden="true"
      />

      {/* Layer 3: carpet pattern */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.025]"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <pattern id="about-carpet" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
            <polygon points="40,6 74,40 40,74 6,40"   fill="none" stroke="#2a5c45" strokeWidth="1.5" />
            <polygon points="40,18 62,40 40,62 18,40" fill="none" stroke="#8B6914" strokeWidth="1" />
            <polygon points="40,28 52,40 40,52 28,40" fill="#2a5c45" opacity="0.4" />
            <circle cx="0"  cy="0"  r="2" fill="#8B6914" />
            <circle cx="80" cy="0"  r="2" fill="#8B6914" />
            <circle cx="0"  cy="80" r="2" fill="#8B6914" />
            <circle cx="80" cy="80" r="2" fill="#8B6914" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#about-carpet)" />
      </svg>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 w-full h-32 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, var(--color-bg))' }}
        aria-hidden="true"
      />

      <Container className="relative flex-1 flex flex-col md:block">
        <div className="flex-1 flex flex-col items-center justify-center md:justify-start max-w-3xl mx-auto text-center gap-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/6 px-4 py-1.5 backdrop-blur-[2px]">
            <span className="text-accent text-[10px] md:text-xs font-medium tracking-[2px] uppercase">
              О проекте
            </span>
          </div>

          <h1
            id="about-heading"
            className="font-normal text-ink leading-[1.08]"
            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 5vw, 3rem)' }}
          >
            Кавказ - это не просто <em className="text-accent not-italic">география</em>
          </h1>
          <p className="text-ink/80 text-sm md:text-lg leading-relaxed max-w-2xl font-semibold">
            Тысячелетия культур, языков и народов. История, которую писали очевидцы,
            путешественники, полководцы и учёные - и которую сегодня почти невозможно
            найти. CaucasusLibrary создан, чтобы это изменить.
          </p>
        </div>
      </Container>
    </section>
  )
}
