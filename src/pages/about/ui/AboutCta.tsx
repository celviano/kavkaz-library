// src/pages/about/ui/AboutCta.tsx
import Link from 'next/link'
import { Container } from '@/shared/ui/Container'

const STATS = [
  { value: '200+', label: 'книг в каталоге' },
  { value: 'XIX в.', label: 'основной период' },
  { value: '6', label: 'тематических разделов' },
]

export function AboutCta() {
  return (
    <section
      className="py-20 border-t border-surface2"
      aria-labelledby="about-cta-heading"
    >
      <Container>
        <div className="relative overflow-hidden rounded-3xl bg-dark px-8 md:px-16 py-16">
          {/* Glow blobs */}
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <div className="absolute left-0 top-0 w-96 h-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/20 blur-[80px]" />
            <div className="absolute right-0 bottom-0 w-72 h-72 translate-x-1/3 translate-y-1/3 rounded-full bg-accent/15 blur-[60px]" />
          </div>

          <div className="relative flex flex-col items-center text-center gap-6 max-w-2xl mx-auto">
            <h2
              id="about-cta-heading"
              className="font-display font-semibold text-bg"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.6rem, 3.5vw, 2.5rem)',
              }}
            >
              История Кавказа ждёт вас
            </h2>
            <p className="text-bg/55 text-base leading-relaxed">
              Начните с каталога — или добавьте свои книги, если у вас есть что-то редкое.
              Каждое издание, которое вы добавляете, помогает сохранить знания для
              следующих поколений.
            </p>

            {/* Stats */}
            <dl className="flex flex-wrap justify-center gap-10 py-6 border-y border-bg/10 w-full">
              {STATS.map(({ value, label }) => (
                <div key={label} className="flex flex-col items-center gap-1">
                  <dd
                    className="font-display font-semibold text-accent3 leading-none"
                    style={{ fontFamily: 'var(--font-display)', fontSize: '2rem' }}
                  >
                    {value}
                  </dd>
                  <dt className="text-xs text-bg/50 uppercase tracking-widest">
                    {label}
                  </dt>
                </div>
              ))}
            </dl>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Link
                href="/catalog"
                className="inline-flex items-center justify-center h-12 px-8 rounded-xl text-base font-medium bg-accent text-bg border border-accent hover:bg-accent2 shadow-accent-sm hover:shadow-accent transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent3"
              >
                Перейти в каталог
              </Link>
              <Link
                href="/add-book"
                className="inline-flex items-center justify-center h-12 px-8 rounded-xl text-base font-medium text-bg/80 border border-bg/20 hover:bg-bg/10 hover:text-bg transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bg"
              >
                Добавить книгу
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
