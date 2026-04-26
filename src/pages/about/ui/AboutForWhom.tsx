// src/pages/about/ui/AboutForWhom.tsx
import { Container } from '@/shared/ui/Container'

const GROUPS = [
  {
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#2a5c45"
        strokeWidth="1.6"
        strokeLinecap="round"
      >
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
    title: 'Коллекционерам',
    text: 'Вы годами собирали редкие издания. Здесь можно поделиться ими с теми, кто оценит по достоинству - или продать с выгодой.',
  },
  {
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#2a5c45"
        strokeWidth="1.6"
        strokeLinecap="round"
      >
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>
    ),
    title: 'Исследователям и учёным',
    text: 'Исторические труды, этнографические исследования, лингвистические словари - первоисточники со всего Кавказа в одном месте, с описаниями и издательскими данными.',
  },
  {
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#2a5c45"
        strokeWidth="1.6"
        strokeLinecap="round"
      >
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    title: 'Книжным магазинам',
    text: 'Выход на аудиторию, которая целенаправленно ищет книги о Кавказе. Не случайные покупатели - а именно ваши.',
  },
  {
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#2a5c45"
        strokeWidth="1.6"
        strokeLinecap="round"
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    title: 'Всем любопытным',
    text: 'Хотите узнать о культуре горцев, найти биографию исторической личности или просто открыть для себя этот регион? Добро пожаловать.',
  },
]

export function AboutForWhom() {
  return (
    <section className="py-20 border-t border-surface2" aria-labelledby="forwhom-heading">
      <Container>
        <div className="mb-12">
          <p className="text-[11px] font-medium tracking-[2px] uppercase text-accent mb-3">
            Для кого
          </p>
          <h2
            id="forwhom-heading"
            className="font-display font-semibold text-ink"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.7rem, 3vw, 2.4rem)',
            }}
          >
            Место встречи для всех, кому важна история
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {GROUPS.map(({ icon, title, text }) => (
            <div
              key={title}
              className="flex flex-col  items-start gap-5 bg-surface rounded-2xl border border-surface2 p-6 shadow-card"
            >
              <div className="flex w-full flex-row justify-start items-center ">
                <span className="w-11 h-11 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0">{icon}</span>
                <h3 className="text-ink font-medium text-base ml-6">{title}</h3>
              </div>
              <div className="flex flex-col gap-1.5">
                <p className="text-ash text-sm leading-relaxed">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
