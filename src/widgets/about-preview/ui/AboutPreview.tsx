import { memo } from 'react'
import Link from 'next/link'
import { Container } from '@/shared/ui/Container'

export const AboutPreview = memo(() => {
  return (
    <section aria-labelledby="about-heading" className="py-20 border-t border-surface2">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left — text */}
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-[11px] font-medium tracking-[2px] uppercase text-accent mb-3">
                О проекте
              </p>
              <h2
                id="about-heading"
                className="font-display font-semibold text-ink leading-tight mb-5"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.7rem, 3vw, 2.4rem)',
                }}
              >
                Кавказ — <em className="text-accent not-italic">как лоскутное одеяло</em>
              </h2>
              <div className="flex flex-col gap-4 text-ash text-base leading-relaxed">
                <p>
                  Кавказ — один из самых удивительных регионов мира. Десятки народов,
                  языков и культур, живущих бок о бок на небольшом клочке земли между
                  Чёрным и Каспийским морями. Каждая долина — своя история, каждый хребет
                  — своя судьба.
                </p>
                <p>
                  Этот проект создан для того, чтобы разжечь интерес к этому краю — через
                  книги, которые писали люди, видевшие Кавказ своими глазами:
                  путешественники, учёные, военные, поэты. Их свидетельства открывают
                  регион живым, противоречивым и бесконечно богатым.
                </p>
                <p>
                  Мы убеждены: история Кавказа — это не далёкое прошлое. Это ключ к
                  пониманию настоящего. И лучший способ начать — открыть книгу.
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

          {/* Right — decorative panel */}
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
                    { value: 'XIX век', label: 'Золотой период\nкавказоведения' },
                    { value: '50+', label: 'Авторов\nи исследователей' },
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
