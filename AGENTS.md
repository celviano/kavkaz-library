# AGENTS.md — Постоянная память проекта CaucasusLibrary

## Что делает проект

**CaucasusLibrary** — маркетплейс исторических книг о Кавказе и Закавказье.
Частные коллекционеры, книжные магазины и архивы публикуют физические книги;
покупатели могут их искать, добавлять в избранное и отправлять запросы на приобретение.

---

## Технологический стек

| Технология | Версия | Роль |
|---|---|---|
| Next.js | ^15 | App Router, Server Actions, SSR |
| React | ^19 | UI |
| TypeScript | ^5, strict | Типизация |
| Tailwind CSS | ^4 | Стили (`@theme` токены, без кастомных классов) |
| Supabase | ^2 | PostgreSQL, Auth, Storage, RLS |
| TanStack Query | ^5 | Кэш, мутации, оптимистичные обновления |
| react-dropzone | ^14 | Загрузка файлов |
| clsx + tailwind-merge | — | `cn()` утилита |
| lucide-react | ^0.511 | Иконки |

---

## Структура папок

```
app/                        ← Next.js App Router (routing only, thin pages)
  layout.tsx                ← QueryProvider + Header + Footer
  catalog/  book/[id]/  events/  favorites/  add-book/  dashboard/
  seller/[id]/  organization/create/  profile/  about/  contacts/
  auth/ (login/ sign-up/ forgot-password/ update-password/ confirm/ error/)
  not-found.tsx  error.tsx  loading.tsx

src/
  app/
    providers/QueryProvider.tsx   ← staleTime 1 min, gcTime 5 min
    styles/globals.css            ← @theme токены Tailwind v4

  pages/                    ← Оркестраторы страниц (тонкие, клиентские)
    home/  catalog/  book/  events/  favorites/  dashboard/
    seller/  organization/  profile/  about/  contacts/

  widgets/                  ← Переиспользуемые секции, собирают features/entities
    header/  footer/  hero/  featured-books/  book-grid/  book-slider/
    book-meta/  book-purchase/  categories-section/  cta-banner/
    quote-banner/  about-preview/  seller-block/

  features/                 ← Бизнес-логика, модалки, actions
    auth/           ← Server Actions (auth.actions.ts)
    book-search/    book-filter/    book-request/   (RequestModal → createOrder)
    favorites/      add-book/       dashboard/model/useDashboard.ts
    event-filter/   quotes/model/

  entities/                 ← Доменные модели, типы, хуки данных, базовые UI
    book/model/   book/ui/BookCard.tsx
    event/model/  event/ui/EventCard.tsx
    profile/model/ profile/ui/ProfileAvatar.tsx
    user/ui/UserAvatar.tsx
    organization/model/  organization/ui/

  shared/
    ui/             ← 22+ базовых компонента (Button, Select, Input, Dropzone…)
    lib/
      cn.ts         ← clsx + twMerge
      validation.ts ← rules: required, email, minLength, maxLength, url, year, number
      supabase/
        client.ts   server.ts   middleware.ts
        queries/    ← books, favorites, orders, organizations, profiles, queryKeys
    hooks/          ← useCurrentUser, useSupabaseUpload, useFormValidation
    config/
      constants.ts  ← CATEGORY_LABELS, CATEGORIES
    icons/

public/
  covers/   images/about-mission/

middleware.ts               ← updateSession + route protection
.github/workflows/ci.yml   ← typecheck → lint → build
```

---

## Команды

```bash
npm install          # установить зависимости
npm run dev          # dev-сервер (Next.js)
npm run build        # production build
npm run start        # запустить production
npm run lint         # ESLint
npx tsc --noEmit     # typecheck (нет отдельного npm-скрипта)
```

> Тестов нет. CI запускает: typecheck → lint → build.

---

## Правила работы с кодовой базой

### FSD импорты (строго)
```
pages → widgets → features → entities → shared
```
- Никаких импортов в обратном направлении
- Никаких cross-imports между слоями одного уровня
- Псевдоним `@/*` → `./src/*`

### Где создавать новый код
| Что создаём | Куда кладём |
|---|---|
| Новая страница | `app/<route>/page.tsx` + `src/pages/<name>/ui/<Name>Page.tsx` |
| Переиспользуемая секция из нескольких features | `src/widgets/<name>/ui/` |
| Бизнес-логика, модалки, Server Actions | `src/features/<name>/` |
| Доменная модель, типы, базовый UI | `src/entities/<name>/` |
| Базовый компонент без бизнес-логики | `src/shared/ui/` |
| Утилита / хук без зависимостей от домена | `src/shared/lib/` или `src/shared/hooks/` |

### Barrel exports
Каждый слой экспортирует через `index.ts`. Импортировать только из `index.ts`, не из внутренних файлов.

---

## Запреты

- Не трогать `middleware.ts` без явного запроса — роутинг и сессии
- Не изменять `.github/workflows/ci.yml` без явного запроса
- Не изменять `src/app/styles/globals.css` (токены) без явного запроса
- Не менять RLS-политики в Supabase без явного запроса
- Не добавлять новые npm-пакеты без явного запроса
- Не использовать `any` — TypeScript strict

---

## Осторожности

- **`QueryProvider`** — единственный, в `app/layout.tsx`. Не создавать новые инстансы.
- **`queryKeys.ts`** — единый реестр ключей. При добавлении нового запроса — сначала сюда.
- **RLS** — все операции с Supabase защищены Row Level Security. Тест через devtools может давать доступ, которого нет у реального пользователя.
- **`mapBookRow` / `mapEventRow` / `mapOrganizationRow`** — маппинг snake_case → camelCase обязателен при чтении из Supabase. Не обходить.
- **`status` у книг** — публичный каталог показывает только `active`. При смене статуса — проверить RLS в `queries/books.ts`.
- **Загрузка файлов** — `useSupabaseUpload` возвращает публичные URL. Bucket должен быть public.
- **Server Actions** только в `features/auth/actions/auth.actions.ts`. Не создавать actions в других местах без явного запроса.

---

## Что читать перед изменениями

| Задача | Читать |
|---|---|
| Любые изменения | `CLAUDE.md`, этот файл |
| Новая страница | `src/pages/` (любой существующий пример) |
| Новый запрос к БД | `src/shared/lib/supabase/queries/`, `queryKeys.ts` |
| Работа с авторизацией | `src/shared/lib/supabase/middleware.ts`, `features/auth/` |
| Изменение UI | `DESIGN.md`, `src/app/styles/globals.css` |
| Новые правила кода | `CODING_RULES.md`, `.eslintrc.json` |
| Новый компонент | `src/shared/ui/Button.tsx` или `Select.tsx` как эталон |

---

## Ссылки на документацию

- [ARCHITECTURE.md](ARCHITECTURE.md) — слои, взаимодействие, точки входа
- [CODING_RULES.md](CODING_RULES.md) — naming, структура компонента, TypeScript
- [DESIGN.md](DESIGN.md) — токены, типографика, компоненты, чеклист
- [ONBOARDING.md](ONBOARDING.md) — типовые задачи пошагово
- [README_AI.md](README_AI.md) — сверхкраткий навигатор
- [CLAUDE.md](CLAUDE.md) — полный контекст проекта (DB schema, бизнес-флоу)
