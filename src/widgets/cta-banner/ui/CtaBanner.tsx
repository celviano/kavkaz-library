import { memo } from 'react'
import Link from 'next/link'
import { Container } from '@/shared/ui/Container'

export const CtaBanner = memo(() => (
  <section aria-labelledby="cta-heading" className="py-20 border-t border-surface2">
    <Container>
      <div className="relative overflow-hidden rounded-3xl bg-dark px-8 md:px-16 py-16 text-center">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute left-0 top-0 w-96 h-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/20 blur-[80px]" />
          <div className="absolute right-0 bottom-0 w-72 h-72 translate-x-1/3 translate-y-1/3 rounded-full bg-accent/15 blur-[60px]" />
        </div>
        <div className="relative flex flex-col items-center gap-5 max-w-2xl mx-auto">
          <h2
            id="cta-heading"
            className="font-display text-4xl font-normal text-bg"
          >
            Изучайте историю <em className="text-accent3 not-italic">Кавказа</em>
          </h2>
          <p className="text-bg/55 text-base leading-relaxed max-w-lg">
            История, культура, языки, литература и биографии — всё о народах Кавказа
            великой эпохи Кавказской войны и освоения региона.
          </p>
          <Link
            href="/catalog"
            className="inline-flex items-center justify-center h-12 px-8 rounded-xl text-base font-medium bg-accent text-bg border border-accent hover:bg-accent2 shadow-accent-sm hover:shadow-accent transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent3"
          >
            Перейти в каталог
          </Link>
        </div>
      </div>
    </Container>
  </section>
))

CtaBanner.displayName = 'CtaBanner'
