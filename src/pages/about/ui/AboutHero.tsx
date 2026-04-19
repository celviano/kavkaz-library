// src/pages/about/ui/AboutHero.tsx
import { Container } from '@/shared/ui/Container'

export function AboutHero() {
  return (
    <section
      className="relative overflow-hidden py-24 md:py-32"
      aria-labelledby="about-heading"
    >
      {/* Carpet pattern */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.04]"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="about-carpet"
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
            <circle cx="0" cy="0" r="2" fill="#8B6914" />
            <circle cx="80" cy="0" r="2" fill="#8B6914" />
            <circle cx="0" cy="80" r="2" fill="#8B6914" />
            <circle cx="80" cy="80" r="2" fill="#8B6914" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#about-carpet)" />
      </svg>

      {/* Mountain silhouette */}
      <svg
        className="absolute bottom-0 left-0 w-full opacity-[0.05]"
        viewBox="0 0 1200 120"
        preserveAspectRatio="xMidYMax slice"
        aria-hidden="true"
      >
        <path
          d="M0 120 L0 70 L100 15 L180 55 L280 5 L380 50 L460 0 L560 45 L640 10 L740 55 L820 5 L920 50 L1000 15 L1100 55 L1200 20 L1200 120Z"
          fill="#1B2212"
        />
        <path d="M280 5  L295 30 L265 30Z" fill="#f2ede6" opacity="0.6" />
        <path d="M460 0  L478 26 L442 26Z" fill="#f2ede6" opacity="0.6" />
        <path d="M640 10 L654 32 L626 32Z" fill="#f2ede6" opacity="0.55" />
        <path d="M820 5  L836 28 L804 28Z" fill="#f2ede6" opacity="0.6" />
      </svg>

      <Container className="relative">
        <div className="max-w-3xl mx-auto text-center flex flex-col items-center gap-6">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-accent/20 bg-accent/6 px-5 py-2">
            <span className="text-accent text-xs font-medium tracking-[2px] uppercase">
              О проекте
            </span>
          </div>

          <h1
            id="about-heading"
            className="font-display font-normal text-4xl text-ink leading-[1.08]"
          >
            Кавказ - это не просто <em className="text-accent not-italic">география</em>
          </h1>

          <p className="text-ash text-lg leading-relaxed max-w-2xl">
            Тысячелетия культур, языков и народов. История, которую писали очевидцы,
            путешественники, полководцы и учёные - и которую сегодня почти невозможно
            найти. CaucasusLibrary создан, чтобы это изменить.
          </p>
        </div>
      </Container>
    </section>
  )
}
