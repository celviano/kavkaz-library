// src/pages/about/ui/AboutHow.tsx
import { Container } from '@/shared/ui/Container'

const STEPS = [
  {
    number: '01',
    title: 'Собираем всё в одном месте',
    text: 'Больше не нужно искать по десяткам сайтов и аукционов. История, культура, языки, литература, биографии — всё в одном каталоге с описаниями и данными об издании.',
  },
  {
    number: '02',
    title: 'Объединяем продавцов и покупателей',
    text: 'Частные коллекционеры, книжные магазины, архивы — все могут добавить свои книги на площадку. Покупатель видит полную картину рынка и находит нужное издание.',
  },
  {
    number: '03',
    title: 'Сохраняем знания',
    text: 'Каждая книга попадает в каталог с историей, тегами и метаданными. Даже если книга продана — информация о ней остаётся. Это живая база данных редких изданий.',
  },
  {
    number: '04',
    title: 'Создаём сообщество',
    text: 'Лекции, встречи, выставки — мы не просто продаём книги. Мы создаём пространство для тех, кому важна история Кавказа: историков, краеведов, коллекционеров и просто любопытных.',
  },
]

export function AboutHow() {
  return (
    <section
      className="py-20 border-t border-surface2 bg-surface/40"
      aria-labelledby="how-heading"
    >
      <Container>
        <div className="mb-12">
          <p className="text-[11px] font-medium tracking-[2px] uppercase text-accent mb-3">
            Как это работает
          </p>
          <h2
            id="how-heading"
            className="font-display font-semibold text-ink"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.7rem, 3vw, 2.4rem)',
            }}
          >
            Простая идея, которой давно не хватало
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map(({ number, title, text }) => (
            <div
              key={number}
              className="flex flex-col gap-4 bg-bg rounded-2xl border border-surface2 p-6 shadow-card"
            >
              <span
                className="font-display font-semibold text-accent/30 leading-none select-none"
                style={{ fontFamily: 'var(--font-display)', fontSize: '2.8rem' }}
                aria-hidden="true"
              >
                {number}
              </span>
              <h3 className="text-ink text-base font-medium leading-snug">{title}</h3>
              <p className="text-ash text-sm leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
