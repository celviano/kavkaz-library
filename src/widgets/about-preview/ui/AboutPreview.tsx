import { memo } from 'react'
import Link from 'next/link'
import { Container } from '@/shared/ui/Container'

export const AboutPreview = memo(() => {
  return (
    <section
      aria-labelledby="about-heading"
      className="py-10 md:py-20 border-t border-surface2 relative overflow-hidden"
    >
      {/* Georgian script background */}
      <svg
        className="pointer-events-none absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <text
          x="3%"
          y="18%"
          fontFamily="Georgia, serif"
          fontSize={96}
          fill="#2a5c45"
          opacity={0.045}
          transform="rotate(-8)"
          style={{ userSelect: 'none' }}
        >
          ა
        </text>
        <text
          x="11%"
          y="68%"
          fontFamily="Georgia, serif"
          fontSize={72}
          fill="#2a5c45"
          opacity={0.038}
          transform="rotate(6)"
          style={{ userSelect: 'none' }}
        >
          ბ
        </text>
        <text
          x="20%"
          y="32%"
          fontFamily="Georgia, serif"
          fontSize={110}
          fill="#8B6914"
          opacity={0.032}
          transform="rotate(-4)"
          style={{ userSelect: 'none' }}
        >
          გ
        </text>
        <text
          x="48%"
          y="12%"
          fontFamily="Georgia, serif"
          fontSize={88}
          fill="#2a5c45"
          opacity={0.035}
          transform="rotate(-6)"
          style={{ userSelect: 'none' }}
        >
          ვ
        </text>
        <text
          x="68%"
          y="24%"
          fontFamily="Georgia, serif"
          fontSize={78}
          fill="#8B6914"
          opacity={0.042}
          transform="rotate(-10)"
          style={{ userSelect: 'none' }}
        >
          თ
        </text>
        <text
          x="76%"
          y="72%"
          fontFamily="Georgia, serif"
          fontSize={92}
          fill="#2a5c45"
          opacity={0.036}
          transform="rotate(7)"
          style={{ userSelect: 'none' }}
        >
          კ
        </text>
        <text
          x="85%"
          y="42%"
          fontFamily="Georgia, serif"
          fontSize={68}
          fill="#8B6914"
          opacity={0.04}
          transform="rotate(-5)"
          style={{ userSelect: 'none' }}
        >
          ლ
        </text>
        <text
          x="93%"
          y="82%"
          fontFamily="Georgia, serif"
          fontSize={86}
          fill="#2a5c45"
          opacity={0.033}
          transform="rotate(8)"
          style={{ userSelect: 'none' }}
        >
          მ
        </text>
        <text
          x="7%"
          y="88%"
          fontFamily="Georgia, serif"
          fontSize={74}
          fill="#8B6914"
          opacity={0.038}
          transform="rotate(-12)"
          style={{ userSelect: 'none' }}
        >
          ნ
        </text>
        <text
          x="90%"
          y="10%"
          fontFamily="Georgia, serif"
          fontSize={82}
          fill="#2a5c45"
          opacity={0.035}
          transform="rotate(-7)"
          style={{ userSelect: 'none' }}
        >
          პ
        </text>
      </svg>

      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left - text */}
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-[11px] font-medium tracking-[2px] uppercase text-accent mb-3">
                О проекте
              </p>
              <h2
                id="about-heading"
                className="font-display font-normal text-4xl text-ink leading-tight mb-5"
              >
                Кавказ - <em className="text-accent not-italic">как лоскутное одеяло</em>
              </h2>
              <div className="flex flex-col gap-4 text-ash text-base leading-relaxed">
                <p>
                  Кавказ - один из самых удивительных регионов мира. Десятки народов,
                  языков и культур, живущих бок о бок на небольшом клочке земли между
                  Чёрным и Каспийским морями. Каждая долина хранит свою историю, каждый
                  хребет - свою судьбу.
                </p>
                <p>
                  Проект создан, чтобы разжечь интерес к этому краю через книги, которые
                  писали люди, видевшие Кавказ своими глазами: путешественники, учёные,
                  военные, поэты. Их свидетельства открывают регион живым, противоречивым
                  и бесконечно богатым.
                </p>
                <p>
                  Культура и история Кавказа - это не далёкое прошлое. Это ключ к
                  пониманию настоящего. Лучший способ начать - открыть книгу.
                </p>
              </div>
            </div>

            <Link
              href="/about"
              className="self-start inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent rounded group"
            >
              Подробнее о проекте
              <span
                className="transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden="true"
              >
                →
              </span>
            </Link>
          </div>

          {/* Right - decorative panel */}
          <div className="relative flex items-center justify-center">
            <div className="relative w-full max-w-sm mx-auto">
              <div
                className="absolute inset-0 rounded-3xl bg-surface border border-surface2 translate-x-3 translate-y-3"
                aria-hidden="true"
              />
              <div className="relative rounded-3xl bg-surface border border-surface2 overflow-hidden p-8 shadow-card">
                <svg
                  className="absolute inset-0 w-full h-full opacity-[0.055]"
                  preserveAspectRatio="xMidYMid slice"
                  aria-hidden="true"
                >
                  <defs>
                    <pattern
                      id="about-pat"
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
                        strokeWidth="1.2"
                      />
                      <polygon
                        points="30,14 46,30 30,46 14,30"
                        fill="none"
                        stroke="#8B6914"
                        strokeWidth="0.8"
                      />
                      <circle cx="30" cy="30" r="4" fill="#2a5c45" />
                      <circle cx="0" cy="0" r="2" fill="#8B6914" />
                      <circle cx="60" cy="0" r="2" fill="#8B6914" />
                      <circle cx="0" cy="60" r="2" fill="#8B6914" />
                      <circle cx="60" cy="60" r="2" fill="#8B6914" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#about-pat)" />
                </svg>
                <div className="relative grid grid-cols-2 gap-px bg-surface2 rounded-2xl overflow-hidden mb-6">
                  {[
                    { value: '7', label: 'Разделов\nбиблиотеки' },
                    { value: '100+', label: 'Авторов\nи составителей' },
                    { value: '14', label: 'Народов\nв каталоге' },
                    { value: '3', label: 'Региона\nЗакавказья' },
                  ].map(({ value, label }) => (
                    <div key={label} className="bg-bg px-5 py-4 flex flex-col gap-1.5">
                      <span
                        className="font-display font-semibold text-accent leading-none"
                        style={{ fontFamily: 'var(--font-display)', fontSize: '1.55rem' }}
                      >
                        {value}
                      </span>
                      <span className="text-[11px] text-ash leading-snug whitespace-pre-line">
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
                <blockquote className="relative pt-5 border-t border-surface2">
                  <p
                    className="font-display italic text-text leading-snug"
                    style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem' }}
                  >
                    «Кавказ — это целый мир, сжатый между двух морей»
                  </p>
                  <footer className="mt-2 text-[11px] text-dim">
                    — Александр Дюма, «Кавказ», 1859
                  </footer>
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
})

AboutPreview.displayName = 'AboutPreview'
