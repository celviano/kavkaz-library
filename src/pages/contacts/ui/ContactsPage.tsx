import { Mail, MapPin, Clock } from 'lucide-react'
import { Container } from '@/shared/ui/Container'
import { IconTelegram, IconVK, IconMax } from '@/shared/ui/SocialIcons'

const SOCIALS = [
  {
    label:   'Telegram',
    handle:  '@caucasuslibrary',
    desc:    'Новости, анонсы событий, редкие находки',
    href:    'https://t.me/caucasuslibrary',
    Icon:    IconTelegram,
    iconBg:  '#2AABEE',
  },
  {
    label:   'ВКонтакте',
    handle:  'vk.com/caucasuslibrary',
    desc:    'Публикации, обсуждения, сообщество читателей',
    href:    'https://vk.com/caucasuslibrary',
    Icon:    IconVK,
    iconBg:  '#0077FF',
  },
  {
    label:   'Канал в MAX',
    handle:  '@caucasuslibrary',
    desc:    'Эксклюзивный контент и редкие материалы',
    href:    'https://max.ru/caucasuslibrary',
    Icon:    IconMax,
    iconBg:  '#2a5c45',
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

export function ContactsPage() {
  return (
    <main id="main-content">
      <section className="relative overflow-hidden min-h-svh md:min-h-0 flex flex-col py-14 md:py-20 border-b border-surface2">
        <svg className="absolute inset-0 w-full h-full opacity-[0.04]" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <pattern id="contacts-pat" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <polygon points="30,4 56,30 30,56 4,30" fill="none" stroke="#2a5c45" strokeWidth="1"/>
              <circle cx="30" cy="30" r="3" fill="#2a5c45"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#contacts-pat)"/>
        </svg>
        <Container className="relative flex-1 flex flex-col justify-center md:block">
          <div className="max-w-2xl">
            <p className="text-[10px] md:text-[11px] font-medium tracking-[2px] uppercase text-accent mb-3 md:mb-4">Контакты</p>
            <h1 className="font-normal text-ink leading-tight mb-3 md:mb-4"
              style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 5vw, 3.2rem)' }}>
              Будем рады помочь
            </h1>
            <p className="text-ash text-sm md:text-lg leading-relaxed">
              Есть вопросы о площадке, хотите разместить коллекцию или стать партнёром — напишите нам.
              Отвечаем в течение рабочего дня.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="flex flex-col gap-5">
              <a href="mailto:hello@caucasuslibrary.ru"
                className="group flex flex-col gap-4 bg-surface border border-surface2 rounded-2xl p-6 hover:border-accent/30 hover:bg-accent/3 transition-all">
                <div className="w-11 h-11 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                  <Mail size={22} strokeWidth={1.6}/>
                </div>
                <div>
                  <p className="text-[10px] font-medium tracking-[2px] uppercase text-dim mb-1">Email</p>
                  <p className="text-base font-medium text-ink group-hover:text-accent transition-colors">
                    hello@caucasuslibrary.ru
                  </p>
                  <p className="text-xs text-ash mt-1">Общие вопросы и сотрудничество</p>
                </div>
              </a>

              <div className="flex flex-col gap-4 bg-surface border border-surface2 rounded-2xl p-6">
                <div className="w-11 h-11 rounded-xl bg-surface2 flex items-center justify-center text-ash">
                  <Clock size={22} strokeWidth={1.6}/>
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

              <div className="flex items-start gap-4 bg-surface border border-surface2 rounded-2xl p-6">
                <div className="w-11 h-11 rounded-xl bg-surface2 flex items-center justify-center text-ash flex-shrink-0">
                  <MapPin size={22} strokeWidth={1.6}/>
                </div>
                <div>
                  <p className="text-[10px] font-medium tracking-[2px] uppercase text-dim mb-1">Регион</p>
                  <p className="text-sm font-medium text-ink">Россия</p>
                  <p className="text-xs text-ash mt-0.5">Работаем со всей страной</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 flex flex-col gap-5">
              <div>
                <p className="text-[11px] font-medium tracking-[2px] uppercase text-accent mb-1">Сообщество</p>
                <h2 className="font-display font-normal text-ink"
                  style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem, 2.5vw, 1.9rem)' }}>
                  Следите за нами
                </h2>
              </div>

              <div className="flex flex-col gap-3">
                {SOCIALS.map(({ label, handle, desc, href, Icon, iconBg }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                    className="group flex items-center gap-5 bg-surface border border-surface2 rounded-2xl p-5 hover:border-accent/30 transition-all">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105"
                      style={{ background: `${iconBg}18`, border: `1px solid ${iconBg}30`, color: iconBg }}>
                      <Icon size={22}/>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        <span className="text-sm font-medium text-ink">{label}</span>
                        <span className="text-xs text-dim font-mono">{handle}</span>
                      </div>
                      <p className="text-xs text-ash leading-relaxed">{desc}</p>
                    </div>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a8998a" strokeWidth="1.8" strokeLinecap="round"
                      className="flex-shrink-0 group-hover:translate-x-0.5 transition-all" aria-hidden="true">
                      <path d="M7 17L17 7M7 7h10v10"/>
                    </svg>
                  </a>
                ))}
              </div>

              <div className="relative overflow-hidden rounded-2xl bg-dark px-6 py-6">
                <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                  <div className="absolute left-0 top-0 w-48 h-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/20 blur-[60px]"/>
                </div>
                <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
                  <div>
                    <p className="text-bg/90 font-medium mb-1">Хотите разместить книги?</p>
                    <p className="text-bg/50 text-sm">Напишите нам — поможем с регистрацией и верификацией</p>
                  </div>
                  <a href="mailto:sellers@caucasuslibrary.ru"
                    className="flex-shrink-0 inline-flex items-center gap-2 h-10 px-5 rounded-xl text-sm font-medium bg-accent text-bg hover:bg-accent2 transition-all">
                    <Mail size={16} strokeWidth={1.8}/>
                    Написать
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16 border-t border-surface2 bg-surface/40">
        <Container>
          <div className="max-w-3xl mx-auto">
            <div className="mb-10">
              <p className="text-[11px] font-medium tracking-[2px] uppercase text-accent mb-2">FAQ</p>
              <h2 className="font-display font-normal text-ink"
                style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 3vw, 2.2rem)' }}>
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
