# KavkazLibrary — Project Context for Claude

## Project Overview

**KavkazLibrary** — маркетплейс исторических книг о Кавказе и Закавказье.
Физические книги: продажа, добавление пользователями, избранное, события.
Объединяет частных коллекционеров, книжные магазины и архивы на одной площадке.

**Live stack:**
- Next.js 15 (App Router), React 19, TypeScript (strict)
- Tailwind CSS v4 (`@theme` токены, никаких кастомных классов)
- Supabase (PostgreSQL, Auth, Storage, RLS)
- TanStack Query v5 (кэш, мутации, оптимистичные обновления)
- react-dropzone (загрузка файлов)
- FSD (Feature-Sliced Design) архитектура

---

## Architecture — Feature-Sliced Design

### FSD Import Rules (strict)
```
pages → widgets → features → entities → shared
```
Никаких импортов в обратном направлении. Никаких cross-imports между слоями одного уровня.

```
app/                          ← Next.js App Router (routing only, thin pages)
  layout.tsx                  ← QueryProvider + Header + Footer
  catalog/page.tsx
  book/[id]/page.tsx
  events/page.tsx
  favorites/page.tsx
  add-book/page.tsx
  dashboard/page.tsx
  seller/[id]/page.tsx
  organization/create/page.tsx
  profile/page.tsx + edit/
  about/page.tsx
  auth/ login/ sign-up/ forgot-password/ update-password/ confirm/ error/
  not-found.tsx  error.tsx  loading.tsx

src/
  app/providers/QueryProvider.tsx
  app/styles/globals.css        ← @theme tokens

  pages/
    home/ui/HomePage.tsx        ← thin: Hero + FeaturedBooks + CategoriesSection + CtaBanner
    catalog/ui/CatalogPage.tsx  ← URL-driven: ?page=&category=&q=
    book/ui/BookPage.tsx        ← Slider + MetaGrid + SellerBlock + PurchaseBlock
    events/ui/EventsPage.tsx    ← filter + announce banner
    favorites/ui/FavoritesPage.tsx
    dashboard/ui/
      DashboardPage.tsx         ← stats + tabs
      MyBooksTab.tsx            ← status filter, book list, actions
      MyOrdersTab.tsx           ← incoming orders, confirm/cancel
    seller/ui/
      SellerPage.tsx            ← public profile + stats + books
      SellerBooksGrid.tsx
    organization/ui/
      CreateOrganizationForm.tsx ← creates org, upgrades role to seller
    profile/ui/
      ProfilePage.tsx  ProfileEditForm.tsx  ProfileStats.tsx  ProfileInfoRow.tsx
    about/ui/
      AboutPage.tsx  AboutHero.tsx  AboutMission.tsx  AboutHow.tsx
      AboutForWhom.tsx  AboutCta.tsx

  widgets/
    header/           footer/         hero/
    about-preview/    quote-banner/   book-grid/
    book-slider/      book-meta/      book-purchase/  (triggers RequestModal)
    featured-books/   categories-section/  cta-banner/
    seller-block/                     ← shown on book detail page

  features/
    auth/             book-search/    book-filter/
    favorites/        event-filter/   add-book/
    book-request/                     ← RequestModal (sends order)
    dashboard/model/useDashboard.ts   ← useMyBooks, useMyOrders, status mutations

  entities/
    book/
      model/types.ts      ← Book, BookRow, BookCategory, BookCondition, BookStatus
                             STATUS_LABELS, STATUS_COLORS, CONDITION_LABELS, mapBookRow
      model/useBooks.ts   ← useBooks, useFeaturedBooks, useBook, useSimilarBooks, useCategoryCounts
      ui/BookCard.tsx     ← with FavoriteButton overlay
    event/
      model/types.ts      ← Event, EventRow, EventType, EVENT_TYPE_LABELS, mapEventRow
      model/mockEvents.ts ← 6 mock events (replace with DB later)
      ui/EventCard.tsx
    profile/
      model/types.ts      ← Profile, ProfileRow, UserRole, ROLE_LABELS
                             isAdmin(profile), isSeller(profile), getFullName(profile)
      model/useProfile.ts ← useProfile, useUpdateProfile, useSellerStats
      ui/ProfileAvatar.tsx ← reusable avatar, sizes: sm|md|lg|xl
    user/
      ui/UserAvatar.tsx   ← dropdown: Profile, Dashboard, Favorites, Catalog, Logout
    organization/
      model/types.ts      ← Organization, OrganizationRow, mapOrganizationRow
      model/useOrganization.ts ← useMyOrganization, useOrganization, useCreateOrganization

  shared/
    ui/
      Container.tsx       ← max-w-7xl, px-6 md:px-10 lg:px-16
      Badge.tsx           ← category color badges
      Button.tsx          ← primary|outline|ghost, sm|md|lg
      Select.tsx          ← fully custom accessible dropdown (Arrow/Enter/Escape)
      Dropzone.tsx        ← Supabase upload dropzone (no lucide-react)
      Pagination.tsx      ← URL-driven with ellipsis
      SectionHeading.tsx  ← eyebrow + h2
      PageHeading.tsx     ← eyebrow + h1 + subtitle
      PageLoader.tsx      ← full-page skeleton for loading.tsx files
      Breadcrumb.tsx      ← reusable breadcrumbs
      EmptyState.tsx      ← empty state with optional icon + CTA
      Skeleton.tsx        ← Skeleton + BookCardSkeleton
    lib/
      cn.ts               ← clsx + twMerge
      validation.ts       ← rules: required, email, minLength, maxLength, url, year, number
      supabase/
        client.ts         ← createBrowserClient
        server.ts         ← createServerClient (cookies)
        middleware.ts     ← updateSession + PROTECTED_ROUTES + GUEST_ONLY_ROUTES
        queries/
          books.ts        ← fetchBooks (active only), fetchBookById, fetchFeaturedBooks,
                             fetchSimilarBooks, fetchCategoryCounts, fetchMyBooks,
                             fetchPendingBooks, fetchSellerBooks, updateBookStatus
          favorites.ts    ← fetchFavoriteIds, fetchFavoriteBooks, addFavorite, removeFavorite
          orders.ts       ← createOrder, fetchMyOrders, fetchSentOrders, updateOrderStatus
          organizations.ts ← fetchMyOrganization, fetchOrganizationById, createOrganization
          profiles.ts     ← fetchProfile, fetchSellerStats, updateProfile
          queryKeys.ts    ← centralized query key registry
    hooks/
      useCurrentUser.ts      ← useCurrentUser, useCurrentUserName, useCurrentUserImage
      useSupabaseUpload.ts   ← returns { files, onUpload() → string[], loading, ... }
      useFormValidation.ts   ← touchField, validateAll, getFieldError (shows error after touch)
    config/
      constants.ts           ← CATEGORY_LABELS, CATEGORIES (NO mock data)
```

---

## Database Schema

### `books`
```sql
id, title, author, year, category, description, pages, language, available,
cover_url, images[], tags[], publisher_name, publisher_city, is_featured,
price, currency, price_type ('fixed'|'negotiable'|'exchange'),
condition ('new'|'good'|'fair'|'poor'), edition, copies_total, copies_left,
status ('draft'|'pending'|'active'|'sold'|'archived') default 'active',
owner_id → auth.users, created_at
```

### `profiles`
```sql
id (= auth.users.id), display_name, first_name, last_name, bio,
city, country, avatar_url, website, born_year,
role ('user'|'seller'|'admin') default 'user',
is_verified boolean default false,
created_at, updated_at
```
Auto-created on signup via trigger `handle_new_user()`.

### `favorites`
```sql
id, user_id → auth.users CASCADE, book_id → books CASCADE,
created_at. UNIQUE(user_id, book_id)
```

### `orders`
```sql
id, book_id → books CASCADE, buyer_id → auth.users CASCADE,
seller_id → auth.users CASCADE,
status ('pending'|'confirmed'|'cancelled'|'completed') default 'pending',
message, buyer_contact, created_at
```

### `organizations`
```sql
id, owner_id → auth.users CASCADE UNIQUE,
name, description, logo_url, website, email, phone, city, address, inn,
is_verified boolean default false, created_at
```

### `events`
```sql
id, title, description,
type ('lecture'|'meeting'|'exhibition'|'tour'|'other'),
location, address, starts_at, ends_at, cover_url,
is_free, price, currency, max_seats, is_online, online_url, created_at
```

### RLS Summary
- `books` — read: active OR owner OR admin; write: owner OR admin
- `favorites` — all ops: user_id = auth.uid()
- `profiles` — read: all; write: id = auth.uid()
- `orders` — read: buyer OR seller; insert: buyer; update: seller
- `organizations` — read: all; insert: owner; update: owner OR admin
- `events` — read: all

---

## Storage Buckets

| Bucket | Public | Max | Types |
|--------|--------|-----|-------|
| `book-covers` | ✓ | 5 MB | jpeg, png, webp |
| `book-images` | ✓ | 5 MB | jpeg, png, webp |
| `avatars` | ✓ | 3 MB | jpeg, png, webp |
| `logos` | ✓ | 3 MB | jpeg, png, webp, svg |

---

## User Roles

| Role | How assigned | Book status | Extra |
|------|-------------|-------------|-------|
| `user` | default on signup | `pending` | Browse, favorite, send requests, add books |
| `seller` | after creating org | `pending` | Full dashboard |
| `admin` | set in DB manually | `active` immediately | Approves books, sees all |

---

## Book Statuses

```
draft → pending → active → sold
                         → archived
```

- Public catalog: only `active`
- Owner: sees all own books regardless of status
- Admin: sees everything including `pending`

---

## Theme — Tailwind v4 `@theme` Tokens

```css
--color-bg:       #f2ede6   --color-surface:  #e8e0d4
--color-surface2: #d6ccbf   --color-surface3: #c4b9aa
--color-ink:      #1B2212   --color-text:     #50433D
--color-ash:      #7D7060   --color-dim:      #a8998a
--color-accent:   #2a5c45   --color-accent2:  #3d7a5e   --color-accent3: #6abf99
--color-gold:     #8B6914   --color-dark:     #1B2212

--shadow-accent:    0 4px 24px rgb(42 92 69 / 0.14)
--shadow-accent-sm: 0 2px 10px rgb(42 92 69 / 0.10)
--shadow-card:      0 1px 3px rgb(27 34 18 / 0.06), 0 4px 16px rgb(27 34 18 / 0.05)
```

**Rules:** только Tailwind utility классы с этими токенами. Никаких inline `#hex` в JSX.

**Fonts:**
- `Cormorant Garamond` → `--font-display` (заголовки, лого, цены) — всегда `style={{ fontFamily: 'var(--font-display)' }}`
- `Inter` → `--font-sans` (основной текст)

---

## Auth Flow

Server Actions в `features/auth/actions/auth.actions.ts`.
`middleware.ts` — `updateSession` + route protection.

Protected routes: `/profile`, `/favorites`, `/add-book`, `/dashboard`, `/organization`
Guest-only routes: `/auth/login`, `/auth/sign-up`, `/auth/forgot-password`

---

## Data Fetching Pattern

```tsx
// Server Component (metadata only)
const book = await fetchBookById(id)

// Client Component
const { data: book, isLoading, error } = useBook(bookId)
if (isLoading) return <BookPageSkeleton />
if (error || !book) return <EmptyState ... />

// Optimistic update
const { mutate } = useToggleFavorite(userId)
// onMutate → instant UI, onError → rollback, onSettled → invalidate
```

---

## Key Business Flows

**Add book:**
`AddBookForm` → upload images → `addBookAction()` → admin: active → `/book/[id]`; others: pending → `/dashboard`

**Purchase request:**
Book page "Приобрести" → `RequestModal` → `createOrder()` → seller `/dashboard` → confirm/cancel

**Become seller:**
`/organization/create` → `createOrganization()` → role → `seller` → admin sets `is_verified`

---

## SQL Migrations (run in order)

1. `supabase-setup.sql` — books + favorites + seed 12 books
2. `supabase-profiles.sql` — profiles + auto-create trigger
3. `supabase-seller.sql` — role/is_verified in profiles, status/price_type in books, orders, updated RLS
4. `supabase-organizations.sql` — organizations table + storage policies

---

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

---

## Component Patterns

### Page component (thin orchestrator)
```tsx
'use client'
export const SomePage = memo(() => {
  const [state, setState] = useState(...)
  const { data, isLoading, error } = useSomeData()
  if (isLoading) return <Skeleton />
  if (error) return <EmptyState />
  return (
    <main id="main-content">
      <section className="py-12">
        <Container>
          <PageHeading eyebrow="..." title="..." />
          <SomeWidget data={data} />
        </Container>
      </section>
    </main>
  )
})
```

### Barrel exports
```ts
// entities/book/index.ts
export type { Book, BookRow, BookCategory, BookStatus } from './model/types'
export { mapBookRow, STATUS_LABELS, STATUS_COLORS } from './model/types'
export { BookCard } from './ui/BookCard'
export { useBooks, useBook, useFeaturedBooks } from './model/useBooks'
```

---

## What NOT to do

- Do NOT use `any` — strict typing always
- Do NOT violate FSD import rules
- Do NOT skip `memo()` on heavy components
- Do NOT put business logic in page components
- Do NOT cross-import between same-level FSD slices
- Do NOT skip loading/error states
- Do NOT use inline `#hex` colors — use CSS tokens
- Do NOT hardcode values — use constants
- Do NOT skip `aria-*`, `role`, labels
- Do NOT leave `console.log` in code
- Do NOT make direct API calls inside components — use hooks/queries
- Do NOT skip input validation
- Do NOT create memory leaks — clean up effects and subscriptions
