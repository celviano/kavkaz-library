import { Container } from '@/shared/ui/Container'

// ─── Иконки ───────────────────────────────────────────────────────────────────

const IconMail = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
)

const IconTelegram = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M21.94 4.3L18.6 19.6c-.25 1.1-.9 1.37-1.82.85l-5-3.68-2.41 2.32c-.27.27-.49.49-.99.49l.35-5.03L17.6 7.4c.42-.37-.09-.58-.65-.21L6.05 14.4 1.15 12.9c-1.07-.33-1.09-1.07.22-1.58L20.46 2.8c.9-.33 1.68.2 1.48 1.5z" fill="currentColor"/>
  </svg>
)

const IconVK = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M2 6.5C2 4 4 2 6.5 2h11C20 2 22 4 22 6.5v11c0 2.5-2 4.5-4.5 4.5h-11C4 22 2 20 2 17.5v-11z" fill="currentColor" opacity="0.15"/>
    <path d="M12.6 16s.4-.04.6-.26c.18-.2.18-.57.18-.57s-.03-1.74.79-2 1.94 1.7 3.1 2.44c.87.57 1.54.44 1.54.44l3.08-.04s1.61-.1.85-1.36c-.06-.1-.44-.94-2.28-2.65-1.92-1.78-1.66-1.5.65-4.57 1.41-1.88 1.97-3.02 1.79-3.51-.17-.47-1.19-.35-1.19-.35l-3.47.02s-.26-.03-.45.07c-.19.1-.31.34-.31.34s-.54 1.44-1.26 2.67c-1.52 2.57-2.13 2.71-2.38 2.55-.58-.37-.43-1.5-.43-2.3 0-2.51.38-3.55-.74-3.82C11.5 3 10.93 3 9.6 3 7.94 3 6.53 3.02 5.73 3.43c-.54.27-.95.88-.7.91.31.04 1.01.19 1.38.7.49.65.47 2.12.47 2.12s.28 2.96-.65 3.33c-.64.25-1.52-.26-3.4-2.6C2.07 6.42 1.54 5.3 1.54 5.3s-.13-.22-.31-.33c-.22-.13-.53-.17-.53-.17L.24 4.83s-1.72-.04-.18 2.44C1.1 8.68 4.5 13 8.2 13c0 0 .4.04.62-.17.2-.2.19-.57.19-.57s-.04-1.75.78-2 1.93 1.69 3.08 2.43c.87.57 1.54.44 1.54.44l3.08-.04s1.61-.1.85-1.36z" fill="currentColor"/>
  </svg>
)

const IconMax = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <rect width="24" height="24" rx="6" fill="currentColor" opacity="0.15"/>
    <text x="12" y="16.5" textAnchor="middle" fontSize="11" fontWeight="700" fill="currentColor" fontFamily="Arial">MAX</text>
  </svg>
)

const IconMap = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
)

const IconClock = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
)

// ─── Данные ───────────────────────────────────────────────────────────────────

const SOCIALS = [
  {
    label:    'Telegram',
    handle:   '@kavkazlibrary',
    desc:     'Новости, анонсы событий, редкие находки',
    href:     'https://t.me/kavkazlibrary',
    Icon:     IconTelegram,
    color:    'bg-[#2AABEE]/10 text-[#2AABEE] border-[#2AABEE]/20',
    iconBg:   '#2AABEE',
  },
  {
    label:    'ВКонтакте',
    handle:   'vk.com/kavkazlibrary',
    desc:     'Публикации, обсуждения, сообщество читателей',
    href:     'https://vk.com/kavkazlibrary',
    Icon:     IconVK,
    color:    'bg-[#0077FF]/10 text-[#0077FF] border-[#0077FF]/20',
    iconBg:   '#0077FF',
  },
  {
    label:    'Канал в MAX',
    handle:   '@kavkazlibrary',
    desc:     'Эксклюзивный контент и редкие материалы',
    href:     'https://max.ru/kavkazlibrary',
    Icon:     IconMax,
    color:    'bg-accent/10 text-accent border-accent/20',
    iconBg:   '#2a5c45',
  },
]

const FAQ = [
  {
    q: 'Как добавить книгу на площадку?',
    a: 'Зарегистрируйтесь, перейдите в раздел «Добавить книгу» и заполните карточку. Книга появится в каталоге после проверки модератором.',
  },
  {
    q: 'Как связаться с продавцом?',
    a: 'На странице каждой книги есть кнопка «Приобрести» — она открывает форму запроса. Продавец получит уведомление и свяжется с вами.',
  },
  {
    q: 'Как долго рассматривается книга на модерации?',
    a: 'Обычно в течение 1–2 рабочих дней. Если прошло больше — напишите нам на почту.',
  },
  {
    q: 'Можно ли разместить целую коллекцию или магазин?',
    a: 'Да — создайте страницу организации в настройках профиля. После верификации получите расширенный профиль продавца.',
  },
]

// ─── Компонент ────────────────────────────────────────────────────────────────

export function ContactsPage() {
  return (
    <main id="main-content">

      {/* Hero */}
      <section className="relative overflow-hidden py-20 border-b border-surface2">
        <svg className="absolute inset-0 w-full h-full opacity-[0.04]" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <pattern id="contacts-pat" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <polygon points="30,4 56,30 30,56 4,30" fill="none" stroke="#2a5c45" strokeWidth="1"/>
              <circle cx="30" cy="30" r="3" fill="#2a5c45"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#contacts-pat)"/>
        </svg>
        <Container className="relative">
          <div className="max-w-2xl">
            <p className="text-[11px] font-medium tracking-[2px] uppercase text-accent mb-4">Контакты</p>
            <h1
              className="font-display font-semibold text-ink leading-tight mb-4"
              style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3.2rem)' }}
            >
              Будем рады помочь
            </h1>
            <p className="text-ash text-lg leading-relaxed">
              Есть вопросы о площадке, хотите разместить коллекцию или стать партнёром — напишите нам.
              Отвечаем в течение рабочего дня.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Левая колонка — почта + доп. инфо */}
            <div className="flex flex-col gap-5">

              {/* Email */}
              <a
                href="mailto:hello@kavkazlibrary.ru"
                className="group flex flex-col gap-4 bg-surface border border-surface2 rounded-2xl p-6 hover:border-accent/30 hover:bg-accent/3 transition-all"
              >
                <div className="w-11 h-11 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                  <IconMail />
                </div>
                <div>
                  <p className="text-[10px] font-medium tracking-[2px] uppercase text-dim mb-1">Email</p>
                  <p className="text-base font-medium text-ink group-hover:text-accent transition-colors">
                    hello@kavkazlibrary.ru
                  </p>
                  <p className="text-xs text-ash mt-1">Общие вопросы и сотрудничество</p>
                </div>
              </a>

              {/* Режим работы */}
              <div className="flex flex-col gap-4 bg-surface border border-surface2 rounded-2xl p-6">
                <div className="w-11 h-11 rounded-xl bg-surface2 flex items-center justify-center text-ash">
                  <IconClock />
                </div>
                <div>
                  <p className="text-[10px] font-medium tracking-[2px] uppercase text-dim mb-2">Режим ответов</p>
                  <div className="flex flex-col gap-1.5 text-sm text-ash">
                    <div className="flex justify-between">
                      <span>Пн — Пт</span>
                      <span className="text-ink font-medium">10:00 – 20:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Сб — Вс</span>
                      <span className="text-ink font-medium">12:00 – 18:00</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Регион */}
              <div className="flex items-start gap-4 bg-surface border border-surface2 rounded-2xl p-6">
                <div className="w-11 h-11 rounded-xl bg-surface2 flex items-center justify-center text-ash flex-shrink-0">
                  <IconMap />
                </div>
                <div>
                  <p className="text-[10px] font-medium tracking-[2px] uppercase text-dim mb-1">Регион</p>
                  <p className="text-sm font-medium text-ink">Россия</p>
                  <p className="text-xs text-ash mt-0.5">Работаем со всей страной</p>
                </div>
              </div>
            </div>

            {/* Правая часть — соцсети */}
            <div className="lg:col-span-2 flex flex-col gap-5">
              <div>
                <p className="text-[11px] font-medium tracking-[2px] uppercase text-accent mb-1">Сообщество</p>
                <h2
                  className="font-display font-semibold text-ink"
                  style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem, 2.5vw, 1.9rem)' }}
                >
                  Следите за нами
                </h2>
              </div>

              <div className="flex flex-col gap-3">
                {SOCIALS.map(({ label, handle, desc, href, Icon, color, iconBg }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-5 bg-surface border border-surface2 rounded-2xl p-5 hover:border-accent/30 transition-all"
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105"
                      style={{ background: `${iconBg}18`, border: `1px solid ${iconBg}30`, color: iconBg }}
                    >
                      <Icon />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        <span className="text-sm font-medium text-ink">{label}</span>
                        <span className="text-xs text-dim font-mono">{handle}</span>
                      </div>
                      <p className="text-xs text-ash leading-relaxed">{desc}</p>
                    </div>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a8998a" strokeWidth="1.8" strokeLinecap="round" className="flex-shrink-0 group-hover:translate-x-0.5 group-hover:text-accent transition-all" aria-hidden="true">
                      <path d="M7 17L17 7M7 7h10v10"/>
                    </svg>
                  </a>
                ))}
              </div>

              {/* Для продавцов CTA */}
              <div className="relative overflow-hidden rounded-2xl bg-dark px-6 py-6">
                <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                  <div className="absolute left-0 top-0 w-48 h-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/20 blur-[60px]"/>
                </div>
                <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
                  <div>
                    <p className="text-bg/90 font-medium mb-1">Хотите разместить книги?</p>
                    <p className="text-bg/50 text-sm">Напишите нам — поможем с регистрацией и верификацией</p>
                  </div>
                  <a
                    href="mailto:sellers@kavkazlibrary.ru"
                    className="flex-shrink-0 inline-flex items-center gap-2 h-10 px-5 rounded-xl text-sm font-medium bg-accent text-bg hover:bg-accent2 transition-all"
                  >
                    <IconMail />
                    Написать
                  </a>
                </div>
              </div>
            </div>

          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="py-16 border-t border-surface2 bg-surface/40">
        <Container>
          <div className="max-w-3xl mx-auto">
            <div className="mb-10">
              <p className="text-[11px] font-medium tracking-[2px] uppercase text-accent mb-2">FAQ</p>
              <h2
                className="font-display font-semibold text-ink"
                style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 3vw, 2.2rem)' }}
              >
                Частые вопросы
              </h2>
            </div>
            <div className="flex flex-col gap-3">
              {FAQ.map(({ q, a }) => (
                <div key={q} className="bg-bg border border-surface2 rounded-2xl px-6 py-5">
                  <p className="text-sm font-medium text-ink mb-2">{q}</p>
                  <p className="text-sm text-ash leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

    </main>
  )
}
