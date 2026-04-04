# KavkazLibrary — Project Context for Claude

## Project Overview

**KavkazLibrary** — онлайн-каталог исторических книг о Кавказе и Закавказье.
Физические книги: продажа, добавление пользователями, избранное, события.

**Live stack:**
- Next.js 15 (App Router), React 19, TypeScript (strict)
- Tailwind CSS v4 (`@theme` токены, никаких кастомных классов)
- Supabase (PostgreSQL, Auth, Storage, RLS)
- TanStack Query v5 (кэш, мутации, оптимистичные обновления)
- react-dropzone (загрузка файлов)
- FSD (Feature-Sliced Design) архитектура

---

## Architecture — Feature-Sliced Design

```
app/                          ← Next.js App Router (routing only, thin pages)
  layout.tsx                  ← QueryProvider + Header + Footer
  page.tsx                    ← renders <HomePage />
  catalog/page.tsx
  book/[id]/page.tsx
  events/page.tsx
  favorites/page.tsx
  add-book/page.tsx
  auth/
    login/        sign-up/    forgot-password/
    update-password/   confirm/route.ts   error/
  not-found.tsx

src/
  app/
    providers/QueryProvider.tsx
    styles/globals.css         ← @theme tokens here

  pages/                      ← FSD Pages layer (orchestrators, no logic)
    home/ui/HomePage.tsx
    catalog/ui/CatalogPage.tsx
    book/ui/BookPage.tsx
    events/ui/EventsPage.tsx
    favorites/ui/FavoritesPage.tsx

  widgets/                    ← Compositional UI blocks
    header/          footer/          hero/
    about-preview/   quote-banner/    book-grid/
    book-slider/     book-meta/       book-purchase/
    featured-books/  categories-section/  cta-banner/

  features/                   ← User interactions
    auth/            book-search/     book-filter/
    favorites/       event-filter/    add-book/

  entities/                   ← Domain models
    book/
      model/types.ts           ← Book, BookRow, BookCategory, BookCondition, mapBookRow
      model/useBooks.ts        ← useBooks, useFeaturedBooks, useBook, useSimilarBooks, useCategoryCounts
      ui/BookCard.tsx
    event/
      model/types.ts           ← Event, EventRow, EventType, mapEventRow
      model/mockEvents.ts
      ui/EventCard.tsx
    user/
      ui/UserAvatar.tsx        ← dropdown with Favorites + Logout

  shared/
    ui/
      Container.tsx            ← max-w-7xl, px-6 md:px-10 lg:px-16
      Badge.tsx                ← category color badges
      Button.tsx               ← primary | outline | ghost, size sm|md|lg
      Select.tsx               ← fully custom accessible dropdown
      Dropzone.tsx             ← Supabase upload dropzone (no lucide)
      SectionHeading.tsx       ← eyebrow + h2
      PageHeading.tsx          ← eyebrow + h1 + subtitle
      Breadcrumb.tsx           ← reusable breadcrumbs
      EmptyState.tsx           ← empty state with icon + CTA
      Skeleton.tsx             ← Skeleton + BookCardSkeleton
    lib/
      cn.ts                    ← clsx + twMerge
      supabase/
        client.ts              ← createBrowserClient
        server.ts              ← createServerClient (cookies)
        middleware.ts          ← updateSession
        queries/
          books.ts             ← fetchBooks, fetchBookById, fetchFeaturedBooks, fetchSimilarBooks, fetchCategoryCounts
          favorites.ts         ← fetchFavoriteIds, fetchFavoriteBooks, addFavorite, removeFavorite
          queryKeys.ts         ← centralized query key registry
    hooks/
      useCurrentUser.ts        ← useCurrentUser, useCurrentUserName, useCurrentUserImage
      useSupabaseUpload.ts     ← upload hook for Dropzone
    config/
      constants.ts             ← CATEGORY_LABELS, CATEGORIES (NO mock data)
```

### FSD Import Rules (strict)
```
pages → widgets → features → entities → shared
```
Никаких импортов в обратном направлении. Никаких cross-imports между слоями одного уровня.

---

## Database Schema (Supabase)

### `books`
```sql
id             uuid PK default gen_random_uuid()
title          text NOT NULL
author         text NOT NULL
year           integer NOT NULL
category       text  -- 'history'|'geography'|'ethnography'|'memoirs'|'atlases'|'other'
description    text
pages          integer
language       text default 'Русский'
available      boolean default true
cover_url      text  -- Supabase Storage: book-covers bucket
images         text[]  -- Supabase Storage: book-images bucket
tags           text[]
publisher_name text
publisher_city text
is_featured    boolean default false  -- показывать на главной
price          numeric(10,2)
currency       text default 'RUB'
condition      text  -- 'new'|'good'|'fair'|'poor'
edition        text
copies_total   integer default 1
copies_left    integer default 1
owner_id       uuid → auth.users(id)  -- кто добавил
created_at     timestamptz default now()
```

### `favorites`
```sql
id        uuid PK
user_id   uuid → auth.users(id) ON DELETE CASCADE
book_id   uuid → books(id) ON DELETE CASCADE
created_at timestamptz
UNIQUE(user_id, book_id)
```

### `events`
```sql
id         uuid PK
title      text NOT NULL
description text
type       text  -- 'lecture'|'meeting'|'exhibition'|'tour'|'other'
location   text
address    text
starts_at  timestamptz NOT NULL
ends_at    timestamptz
cover_url  text
is_free    boolean default true
price      numeric(10,2)
currency   text default 'RUB'
max_seats  integer
is_online  boolean default false
online_url text
created_at timestamptz default now()
```

### RLS Policies
- `books` — SELECT: all; INSERT/UPDATE/DELETE: owner_id = auth.uid()
- `favorites` — SELECT/INSERT/DELETE: user_id = auth.uid()
- `events` — SELECT: all

---

## Supabase Storage Buckets

| Bucket | Public | Max size | MIME types |
|--------|--------|----------|-----------|
| `book-covers` | ✓ | 5 MB | jpeg, png, webp |
| `book-images` | ✓ | 5 MB | jpeg, png, webp |

---

## Theme — Tailwind v4 `@theme` Tokens

```css
/* Backgrounds */
--color-bg:       #f2ede6   /* main bg */
--color-surface:  #e8e0d4   /* card bg */
--color-surface2: #d6ccbf   /* borders */
--color-surface3: #c4b9aa   /* deeper borders */

/* Text */
--color-ink:      #1B2212   /* headings */
--color-text:     #50433D   /* body text */
--color-ash:      #7D7060   /* muted text */
--color-dim:      #a8998a   /* hints, labels */

/* Accent — forest green */
--color-accent:   #2a5c45
--color-accent2:  #3d7a5e   /* hover */
--color-accent3:  #6abf99   /* on dark bg */

/* Secondary */
--color-steel:    #B7C9D5
--color-steel2:   #4a6e7a
--color-gold:     #8B6914
--color-gold2:    #b8902a

/* Dark (CTA blocks) */
--color-dark:     #1B2212

/* Shadows */
--shadow-accent:    0 4px 24px rgb(42 92 69 / 0.14)
--shadow-accent-sm: 0 2px 10px rgb(42 92 69 / 0.10)
--shadow-card:      0 1px 3px rgb(27 34 18 / 0.06), 0 4px 16px rgb(27 34 18 / 0.05)
```

**Rules:**
- Использовать только Tailwind utility классы с этими токенами
- Никаких inline цветов (#hex) в JSX — только CSS переменные или Tailwind классы
- Никаких кастомных CSS классов

---

## Fonts

```tsx
// app/layout.tsx
Cormorant_Garamond  → --font-display  (заголовки, лого, цены — serif с характером)
Inter               → --font-sans     (основной текст — читаемый, нейтральный)
```

Заголовки всегда с `style={{ fontFamily: 'var(--font-display)' }}` + `font-display` класс.

---

## Auth Flow

```
/auth/login          → LoginForm (Server Action: loginAction)
/auth/sign-up        → SignUpForm (Server Action: signUpAction)
/auth/forgot-password → ForgotPasswordForm
/auth/update-password → UpdatePasswordForm (after email link)
/auth/confirm/route.ts → OTP handler
/auth/error          → error page
/auth/sign-up-success → check email page
```

- Все формы используют **Server Actions** из `features/auth/actions/auth.actions.ts`
- `middleware.ts` в корне — `updateSession` для refresh сессии на каждом запросе
- Защита страниц: server-side `supabase.auth.getUser()` → redirect если нет юзера

---

## Data Fetching Pattern

```tsx
// Server Component (metadata, SEO)
export async function generateMetadata({ params }) {
  const book = await fetchBookById(id)  // прямой запрос
}

// Client Component (interactive)
const { data, isLoading, error } = useBook(bookId)  // TanStack Query

// Optimistic updates (favorites)
const { mutate } = useToggleFavorite(userId)
// → onMutate обновляет кэш мгновенно
// → onError откатывает
// → onSettled инвалидирует
```

**Query Keys** (centralized в `queryKeys.ts`):
```ts
queryKeys.books.list({ category, search, page })
queryKeys.books.detail(id)
queryKeys.books.featured
queryKeys.favorites.ids(userId)
queryKeys.favorites.books(userId)
```

---

## Component Patterns

### Page component (thin orchestrator)
```tsx
'use client'
export const EventsPage = memo(() => {
  const [filter, setFilter] = useState<FilterValue>('upcoming')
  return (
    <main id="main-content">
      <section className="py-12">
        <Container>
          <PageHeading eyebrow="..." title="..." subtitle="..." />
          <EventFilter selected={filter} onChange={setFilter} />
          <EventsGrid events={filtered} />
        </Container>
      </section>
    </main>
  )
})
```

### Entity with loading/error states
```tsx
const { data: book, isLoading, error } = useBook(bookId)
if (isLoading) return <BookPageSkeleton />
if (error || !book) return <EmptyState ... />
```

### Server action form
```tsx
<form action={loginAction}>
  <AuthInput name="email" label="Email" type="email" required />
  <button type="submit">Войти</button>
</form>
```

---

## File Naming & Barrel Exports

Каждая папка экспортирует через `index.ts`:
```ts
// entities/book/index.ts
export type { Book, BookRow, BookCategory } from './model/types'
export { mapBookRow } from './model/types'
export { BookCard } from './ui/BookCard'
export { useBooks, useBook, useFeaturedBooks } from './model/useBooks'
```

Компоненты — PascalCase, хуки — camelCase с `use` префиксом.

---

## Key Decisions & Conventions

1. **Нет моковых данных** — все данные из Supabase. `constants.ts` содержит только словари (CATEGORY_LABELS, CATEGORIES).
2. **Server Actions** для мутаций аутентификации, **TanStack Query mutations** для данных (favorites, add-book).
3. **Оптимистичные обновления** в `useFavorites` — UI реагирует мгновенно.
4. **`mapBookRow`** — всегда маппить snake_case из БД в camelCase для фронтенда.
5. **Dropzone** — кастомный, без lucide-react, через `useSupabaseUpload` хук.
6. **Select** — полностью кастомный с keyboard navigation (Arrow, Enter, Escape).
7. **Events** пока на моках (`mockEvents.ts`) — таблица `events` в БД готова для подключения.
8. **`owner_id`** в таблице `books` — каждый авторизованный пользователь может добавить книгу.

---

## What NOT to do

### General
- Do NOT leave tasks unfinished — complete them fully
- Do NOT write long explanations unless asked — be brief and to the point
- Do NOT create files without an explicit request
- Do NOT suggest solutions that were not requested

### TypeScript
- Do NOT use `any` types — always use strict typing
- Do NOT introduce TypeScript errors — fix them
- Do NOT use `@ts-ignore` unless absolutely necessary
- Do NOT create types with `unknown` without explicit need

### React & Components
- Do NOT create components without memoization when needed
- Do NOT ignore FSD import rules
- Do NOT create components without proper error boundaries where needed

### Code & Architecture
- Do NOT duplicate code — use reusable patterns
- Do NOT create deep component nesting
- Do NOT ignore performance implications
- Do NOT create side effects without clear intent

### UI/UX
- Do NOT create interfaces without accessibility considerations (aria-*, role, labels)
- Do NOT ignore responsive design — all breakpoints must work
- Do NOT create components without loading states where data is fetched
- Do NOT use hardcoded values — use constants or CSS tokens

### Quality
- Do NOT write code without proper error handling
- Do NOT ignore linting errors
- Do NOT leave `console.log` in code

### Data
- Do NOT ignore loading and error states
- Do NOT create memory leaks — clean up effects, subscriptions, event listeners
- Do NOT make direct API calls inside components — use hooks or services

### Security
- Do NOT create XSS vulnerabilities
- Do NOT skip input validation
- Do NOT use `dangerouslySetInnerHTML` without sanitization
