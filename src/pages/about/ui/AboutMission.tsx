// src/pages/about/ui/AboutMission.tsx
import Image from 'next/image'


import { Container } from '@/shared/ui/Container'

const IMAGES = [
  {
    src: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&q=80',
    alt: 'Старинные книги на полке антикварной лавки',
  },
  {
    src: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80',
    alt: 'Библиотека с деревянными стеллажами и старинными фолиантами',
  },
  {
    src: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&q=80',
    alt: 'Книжный рынок с редкими изданиями',
  },
]

import AboutOne from '../../../../public/images/about-mission/photo_2025-11-25_12-16-05.jpg'
import AboutTwo from '../../../../public/images/about-mission/photo_2026-04-02_15-47-47.jpg'
import AboutThree from '../../../../public/images/about-mission/photo_2026-04-04_16-46-52.jpg'

export function AboutMission() {
  return (
    <section className="py-20 border-t border-surface2" aria-labelledby="mission-heading">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-[11px] font-medium tracking-[2px] uppercase text-accent mb-3">
                Наша миссия
              </p>
              <h2
                id="mission-heading"
                className="font-display font-semibold text-ink leading-tight mb-5"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.7rem, 3vw, 2.4rem)',
                }}
              >
                Кавказ заслуживает того, чтобы его понимали
              </h2>
            </div>

            <div className="flex flex-col gap-4 text-ash text-base leading-relaxed">
              <p>
                Кавказ — один из самых богатых и многогранных регионов мира. Здесь переплелись
                десятки народов, языков, религий и культур. Каждый народ — своя поэзия,
                своя письменность, свои предания. Каждое ущелье хранит свою правду.
              </p>
              <p>
                Понять Кавказ без первоисточников невозможно. Но книги, написанные
                очевидцами — мемуары офицеров, этнографические экспедиции, редкие атласы
                XIX века — разбросаны по частным коллекциям, книжным лавкам и архивам. Их
                почти не найти в обычной продаже.
              </p>
              <p>
                <strong className="text-ink font-medium">CaucasusLibrary</strong> — единая
                площадка, где всё это собрано в одном месте. История, культура, языки,
                литература, биографии — мы объединяем всех, кто хранит и кто ищет.
              </p>
            </div>
          </div>

          {/* Images */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-3">
              <div className="rounded-2xl overflow-hidden aspect-[4/5] bg-surface2">
                <Image
                  src={AboutOne}
                  alt={IMAGES[0].alt}
                  className="w-full h-full object-cover hover:scale-[1.03] transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-surface2">
                <Image
                  src={AboutTwo}
                  alt={IMAGES[2].alt}
                  className="w-full h-full object-cover hover:scale-[1.03] transition-transform duration-500"
                  loading="lazy"
                />
              </div>
            </div>
            <div
              className="rounded-2xl overflow-hidden mt-8 bg-surface2"
              style={{ aspectRatio: '3/5' }}
            >
              <Image
                src={AboutThree}
                alt={IMAGES[1].alt}
                className="w-full h-full object-cover hover:scale-[1.03] transition-transform duration-500"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
