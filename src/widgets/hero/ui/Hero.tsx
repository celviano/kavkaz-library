import { memo } from 'react'
import Link from 'next/link'
import { Container } from '@/shared/ui/Container'
import { HeroBackground } from './hero-background'


export const Hero = memo(() => {
  return (
    <section
      className="relative overflow-hidden min-h-svh md:min-h-0 flex flex-col"
      aria-labelledby="hero-heading"
    >
      
    <HeroBackground />
    
      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 w-full h-32 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, var(--color-bg))' }}
        aria-hidden="true"
      />
      <Container className="relative flex-1 flex flex-col md:block py-16 md:py-32 xl:py-40">

        <div className="relative flex flex-col items-center justify-center text-center flex-1">

          {/* Badge — pinned to top on mobile, inline on md+ */}
          <div className="absolute top-10 left-0 right-0 flex justify-center md:static md:mb-8">
            <div className="flex w-fit items-center gap-2 rounded-full border border-accent/20 bg-accent/6 px-4 py-1.5 backdrop-blur-[2px]">
              <span className="text-accent text-[10px] md:text-xs font-semibold tracking-[2px] uppercase">
                Главная страница
              </span>
            </div>
          </div>

          {/* Heading */}
          <h1
            id="hero-heading"
            className="flex flex-col text-ink font-medium leading-[1.05] tracking-tight mb-4 md:mb-6"
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
          <p className="text-ink/70 text-sm font-medium md:text-lg leading-relaxed max-w-2xl mb-8 md:mb-10">
            Книги по истории, культуре, языкам, литературе и биографиям народов Кавказа и
            Закавказья. Редкие издания, которые почти невозможно найти в обычной продаже.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
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

          {/* Stats — pinned to bottom on mobile, inline on md+ */}
          <dl className="absolute bottom-10 left-0 right-0 flex flex-wrap justify-center gap-8 pt-8 border-t border-surface2/70 md:static md:mt-16 md:gap-12 md:max-w-lg md:mx-auto md:w-full">
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
                <dt className="text-xs text-ink/70 font-medium uppercase tracking-widest">
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
