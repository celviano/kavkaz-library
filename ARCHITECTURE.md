# ARCHITECTURE.md — Архитектура CaucasusLibrary

## Паттерн организации: Feature-Sliced Design (FSD)

```
pages → widgets → features → entities → shared
```

Импорты строго однонаправленные. Нижние слои не знают о верхних.

---

## Слои и их ответственность

### `app/` (Next.js App Router)
**Только маршрутизация.** Файл `page.tsx` импортирует `<NamePage>` из `src/pages/` и рендерит его.
`layout.tsx` — единственное место для `QueryProvider`, `Header`, `Footer`.
`loading.tsx` — рендерит `<PageLoader>` (skeleton).

```tsx
// app/catalog/page.tsx — эталонный тонкий page
import { CatalogPage } from '@/pages/catalog'
export default function Page() { return <CatalogPage /> }
```

### `src/pages/`
**Оркестраторы страниц.** Клиентские компоненты (`'use client'`), обёрнутые в `memo()`.
Держат локальный state (фильтры, пагинация), вызывают хуки данных, обрабатывают loading/error,
собирают виджеты в разметку. Бизнес-логики нет.

### `src/widgets/`
**Переиспользуемые секции.** Крупные UI-блоки, которые собирают несколько features/entities.
Пример: `book-purchase/` показывает кнопку покупки и открывает `RequestModal` из `features/book-request/`.

### `src/features/`
**Бизнес-логика и взаимодействие.** Содержит:
- `actions/` — Next.js Server Actions (только в `features/auth/`)
- `model/` — хуки с мутациями TanStack Query
- `ui/` — модалки, формы с логикой

### `src/entities/`
**Доменные модели.** Типы, маппинг из БД, хуки только для чтения данных, базовые UI-компоненты.
Не содержит бизнес-логику (мутации, Server Actions).

### `src/shared/`
**Независимый слой.** Утилиты, базовые компоненты, конфиги Supabase, хуки без домена.
Ничего не импортирует из FSD-слоёв.

---

## Схема взаимодействия

```
UI (pages/widgets)
  ↓ вызывает хуки
features/entities (TanStack Query хуки)
  ↓ вызывают функции запросов
shared/lib/supabase/queries/*.ts
  ↓ вызывают Supabase JS SDK
Supabase (PostgreSQL + RLS + Auth + Storage)
```

**Дополнительно:**
- Server Actions (`features/auth/actions/`) — вызов от форм напрямую
- `middleware.ts` — защита маршрутов до рендера страницы

---

## Ключевые зависимости между модулями

```
BookCard (entities/book)
  ← используется в: BookGrid (widgets), FeaturedBooks (widgets)

useBooks / useBook (entities/book/model)
  ← используется в: CatalogPage (pages), BookPage (pages), FeaturedBooks (widgets)

useFavorites (features/favorites/model)
  ← используется в: BookCard через FavoriteButton overlay

RequestModal (features/book-request)
  ← открывается из: book-purchase (widgets)

useDashboard → useMyBooks + useMyOrders (features/dashboard/model)
  ← используется в: DashboardPage (pages)

useProfile / useUpdateProfile (entities/profile/model)
  ← используется в: ProfilePage, ProfileEditForm (pages)

useCreateOrganization (entities/organization/model)
  ← используется в: CreateOrganizationForm (pages)
  ← после создания: role меняется на 'seller'
```

---

## Точки входа

| Точка | Файл |
|---|---|
| App root | `app/layout.tsx` |
| Главная страница | `app/page.tsx` → `src/pages/home/ui/HomePage.tsx` |
| Глобальные стили + токены | `src/app/styles/globals.css` |
| Провайдер кэша | `src/app/providers/QueryProvider.tsx` |
| Route protection | `middleware.ts` |
| Supabase browser client | `src/shared/lib/supabase/client.ts` |
| Supabase server client | `src/shared/lib/supabase/server.ts` |
| Query keys registry | `src/shared/lib/supabase/queries/queryKeys.ts` |

---

## Внешние сервисы

### Supabase
- **PostgreSQL** — хранение всех данных (books, profiles, favorites, orders, organizations, events)
- **Auth** — JWT-сессии, email/password
- **Storage** — 4 bucket'а: `book-covers`, `book-images`, `avatars`, `logos` (все public)
- **RLS** — политики безопасности на уровне БД

### Next.js Middleware
`middleware.ts` вызывает `updateSession()` при каждом запросе (обновляет cookie сессии).
Защищённые маршруты: `/profile`, `/favorites`, `/add-book`, `/dashboard`, `/organization`.
Guest-only маршруты: `/auth/login`, `/auth/sign-up`, `/auth/forgot-password`.

---

## Управление состоянием

**Серверное состояние** — TanStack Query v5:
- `staleTime: 60s`, `gcTime: 5 min`, `retry: 1`, `refetchOnWindowFocus: false`
- Оптимистичные обновления в `features/favorites/` (мгновенный UI → rollback при ошибке)
- Инвалидация через `queryClient.invalidateQueries` после мутаций

**Локальное состояние** — `useState` в page-компонентах (фильтры, пагинация, форм-стейт)

**URL-driven state** — `CatalogPage` читает `?page=`, `?category=`, `?q=` из URL

---

## Структура entity (эталон)

```
entities/book/
  model/
    types.ts      ← BookRow (snake_case из БД) + Book (camelCase) + mapBookRow()
    useBooks.ts   ← TanStack Query хуки только для чтения
  ui/
    BookCard.tsx  ← базовый UI компонент
  index.ts        ← barrel export
```

Все entities следуют этому паттерну.
