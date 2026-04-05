# KavkazLibrary — Project Context

## Stack
Next.js 15 (App Router), React 19, TypeScript strict, Tailwind CSS v4, FSD architecture,
Supabase (auth + DB + storage), TanStack Query v5, react-dropzone

## Architecture — FSD layers
```
app/                    Next.js routing
src/
  app/providers/        QueryProvider
  entities/
    book/               Book types, BookCard, useBooks hooks
    event/              Event types, EventCard, mock data
    profile/            Profile types, ProfileAvatar, useProfile, useSellerStats
    user/               UserAvatar (with dropdown)
    organization/       Organization types, useOrganization hooks
  features/
    auth/               LoginForm, SignUpForm, auth actions
    add-book/           AddBookForm, addBookAction (status based on role)
    book-filter/        BookFilter
    book-search/        BookSearch
    book-request/       RequestModal (send order to seller)
    event-filter/       EventFilter
    favorites/          FavoriteButton, useFavorites (optimistic)
    dashboard/          useDashboard hooks (useMyBooks, useMyOrders)
  pages/
    book/               BookPage (with SellerBlock)
    catalog/            CatalogPage (paginated, URL-driven)
    dashboard/          DashboardPage, MyBooksTab, MyOrdersTab
    events/             EventsPage
    favorites/          FavoritesPage
    home/               HomePage (thin orchestrator)
    profile/            ProfilePage, ProfileEditForm
    seller/             SellerPage (public seller profile)
    organization/       CreateOrganizationForm
    about/              AboutPage (split into sections)
  shared/
    config/             CATEGORY_LABELS, CATEGORIES
    hooks/              useCurrentUser, useSupabaseUpload, useFormValidation
    lib/                cn, validation, supabase (client/server/middleware/queries)
    ui/                 Container, Badge, Button, Select, Dropzone, Pagination,
                        Breadcrumb, EmptyState, Skeleton, PageHeading, SectionHeading,
                        PageLoader
  widgets/
    header/             Header (with role-aware nav)
    footer/             Footer
    hero/               Hero
    book-grid/          BookGrid
    book-slider/        BookSlider (modal/loader)
    book-meta/          BookMetaGrid
    book-purchase/      BookPurchaseBlock (with RequestModal trigger)
    seller-block/       SellerBlock (shown on book page)
    featured-books/     FeaturedBooks
    categories-section/ CategoriesSection
    cta-banner/         CtaBanner
    about-preview/      AboutPreview
    quote-banner/       QuoteBanner
```

## User roles
- `user`   — default, can browse, favorite, send requests, add books (→ pending)
- `seller` — verified seller, created via organization form
- `admin`  — books go active immediately, sees all statuses, can moderate

## Book statuses
`draft` → `pending` → `active` → `sold` | `archived`
- New books from user/seller: pending (needs admin approval)
- New books from admin: active immediately
- Public catalog shows only `active` books

## Key flows
1. User adds book → status: pending → admin approves → active in catalog
2. Buyer clicks "Приобрести" → RequestModal → order created in DB
3. Seller sees orders in /dashboard → confirms/cancels
4. Seller creates organization → role upgraded to seller

## DB tables
- `books` — with status, price_type, owner_id
- `profiles` — with role, is_verified
- `favorites` — user_id + book_id
- `orders` — book_id, buyer_id, seller_id, status, message, buyer_contact
- `organizations` — owner_id, name, logo_url, contacts, inn

## Routes
- `/` — home
- `/catalog` — paginated catalog (URL-driven filters)
- `/book/[id]` — book detail with seller block + purchase modal
- `/seller/[id]` — public seller profile + their books
- `/dashboard` — seller dashboard (my books + incoming orders)
- `/organization/create` — create org (upgrades role to seller)
- `/favorites` — saved books
- `/events` — events page
- `/profile` — user profile
- `/profile/edit` — edit profile
- `/about` — about page
- `/add-book` — add book form
- `/auth/*` — auth pages

## SQL migrations (in order)
1. supabase-setup.sql — books + favorites + seed
2. supabase-profiles.sql — profiles table + trigger
3. supabase-seller.sql — roles, statuses, orders table

## Env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_BASE_URL=http://localhost:3000
