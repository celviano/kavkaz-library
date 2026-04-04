'use client'

import { memo } from 'react'
import Link from 'next/link'
import { Container } from '@/shared/ui/Container'
import { PageHeading } from '@/shared/ui/PageHeading'
import { EmptyState } from '@/shared/ui/EmptyState'
import { BookGrid } from '@/widgets/book-grid'
import { ProfileAvatar } from '@/entities/profile'
import { ProfileStats } from './ProfileStats'
import { ProfileInfoRow } from './ProfileInfoRow'
import { useProfile, getFullName } from '@/entities/profile'
import { useCurrentUser } from '@/shared/hooks/useCurrentUser'
import { useFavoriteBooks } from '@/features/favorites'

// ─── Icons ────────────────────────────────────────────────────────────────────

const IconLocation = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
  >
    <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)
const IconCalendar = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
)
const IconLink = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
  >
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
)

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function ProfileSkeleton() {
  return (
    <main id="main-content">
      <section className="py-12">
        <Container>
          <div className="max-w-4xl mx-auto flex flex-col gap-8">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-surface animate-pulse" />
              <div className="flex flex-col gap-2">
                <div className="h-8 w-48 bg-surface rounded-xl animate-pulse" />
                <div className="h-4 w-32 bg-surface rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        </Container>
      </section>
    </main>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export const ProfilePage = memo(() => {
  const { user, loading: userLoading } = useCurrentUser()
  const { data: profile, isLoading: profileLoading } = useProfile(user?.id ?? null)
  const { data: favorites = [] } = useFavoriteBooks(user?.id ?? null)

  if (userLoading || profileLoading) return <ProfileSkeleton />

  if (!user) {
    return (
      <main id="main-content" className="flex-1 flex items-center justify-center py-24">
        <Container>
          <EmptyState
            icon={
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#7D7060"
                strokeWidth="1.5"
                strokeLinecap="round"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
              </svg>
            }
            title="Войдите в аккаунт"
            description="Чтобы открыть профиль, необходима авторизация"
            actionLabel="Войти"
            actionHref="/auth/login"
          />
        </Container>
      </main>
    )
  }

  const fullName = getFullName(profile) || user.email?.split('@')[0] || 'Пользователь'
  const location = [profile?.city, profile?.country].filter(Boolean).join(', ')
  const memberSince = new Date(user.created_at).toLocaleDateString('ru-RU', {
    month: 'long',
    year: 'numeric',
  })

  const stats = [
    { label: 'Избранных', value: favorites.length },
    { label: 'Год вступления', value: new Date(user.created_at).getFullYear() },
    { label: 'Книг добавлено', value: 0 },
  ]

  return (
    <main id="main-content">
      <section className="py-12">
        <Container>
          <div className="max-w-4xl mx-auto flex flex-col gap-10">
            {/* Header card */}
            <div className="bg-surface border border-surface2 rounded-3xl overflow-hidden">
              {/* Banner */}
              <div className="relative h-32 bg-surface2">
                <svg
                  className="absolute inset-0 w-full h-full opacity-[0.06]"
                  preserveAspectRatio="xMidYMid slice"
                  aria-hidden="true"
                >
                  <defs>
                    <pattern
                      id="profile-pat"
                      x="0"
                      y="0"
                      width="60"
                      height="60"
                      patternUnits="userSpaceOnUse"
                    >
                      <polygon
                        points="30,4 56,30 30,56 4,30"
                        fill="none"
                        stroke="#2a5c45"
                        strokeWidth="1"
                      />
                      <polygon
                        points="30,14 46,30 30,46 14,30"
                        fill="none"
                        stroke="#8B6914"
                        strokeWidth="0.7"
                      />
                      <circle cx="30" cy="30" r="3" fill="#2a5c45" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#profile-pat)" />
                </svg>
              </div>

              {/* Info */}
              <div className="px-6 pb-6">
                {/* Avatar overlapping banner */}
                <div className="flex items-end justify-between -mt-14 mb-4">
                  <ProfileAvatar
                    avatarUrl={profile?.avatarUrl}
                    name={fullName}
                    size="xl"
                    className="ring-4 ring-surface z-10 relative"
                  />
                  <Link
                    href="/profile/edit"
                    className="inline-flex items-center gap-2 h-9 px-4 rounded-lg text-sm font-medium border border-surface2 text-ash hover:text-ink hover:bg-surface2 transition-all focus-visible:outline-2 focus-visible:outline-accent"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      aria-hidden="true"
                    >
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    Редактировать
                  </Link>
                </div>

                {/* Name & bio */}
                <div className="flex flex-col gap-1 mb-5">
                  <h1
                    className="font-display font-semibold text-ink"
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'clamp(1.4rem, 3vw, 2rem)',
                    }}
                  >
                    {fullName}
                  </h1>
                  {profile?.displayName && (profile.firstName || profile.lastName) && (
                    <p className="text-dim text-sm">@{profile.displayName}</p>
                  )}
                  {profile?.bio && (
                    <p className="text-ash text-sm leading-relaxed mt-1 max-w-lg">
                      {profile.bio}
                    </p>
                  )}
                </div>

                {/* Info rows */}
                <div className="flex flex-col gap-2.5 mb-5">
                  <ProfileInfoRow
                    icon={<IconLocation />}
                    label="Местоположение"
                    value={location || null}
                  />
                  <ProfileInfoRow
                    icon={<IconCalendar />}
                    label="С нами с"
                    value={memberSince}
                  />
                  <ProfileInfoRow
                    icon={<IconLink />}
                    label="Сайт"
                    value={profile?.website ?? null}
                    href={profile?.website ?? undefined}
                  />
                </div>

                {/* Stats */}
                <ProfileStats stats={stats} />
              </div>
            </div>

            {/* Favorites section */}
            <section aria-labelledby="fav-heading">
              <div className="flex items-end justify-between mb-6">
                <div>
                  <p className="text-[11px] font-medium tracking-[2px] uppercase text-accent mb-1">
                    Коллекция
                  </p>
                  <h2
                    id="fav-heading"
                    className="font-display font-semibold text-ink"
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'clamp(1.3rem, 2.5vw, 1.7rem)',
                    }}
                  >
                    Избранные книги
                  </h2>
                </div>
                {favorites.length > 0 && (
                  <Link
                    href="/favorites"
                    className="text-sm text-ash hover:text-ink transition-colors hidden sm:inline-flex items-center gap-1 group"
                  >
                    Все избранные
                    <span
                      className="group-hover:translate-x-0.5 transition-transform"
                      aria-hidden="true"
                    >
                      →
                    </span>
                  </Link>
                )}
              </div>

              {favorites.length === 0 ? (
                <EmptyState
                  icon={
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#7D7060"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    >
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                    </svg>
                  }
                  title="Нет избранных книг"
                  description="Нажмите на флажок на карточке книги, чтобы сохранить её"
                  actionLabel="Перейти в каталог"
                  actionHref="/catalog"
                />
              ) : (
                <BookGrid books={favorites.slice(0, 4)} />
              )}
            </section>
          </div>
        </Container>
      </section>
    </main>
  )
})

ProfilePage.displayName = 'ProfilePage'
