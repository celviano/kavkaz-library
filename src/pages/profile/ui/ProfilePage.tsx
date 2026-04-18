'use client'

import { memo } from 'react'
import Link from 'next/link'
import { Plus, Check } from 'lucide-react'
import { Mail } from 'lucide-react'
import { Container } from '@/shared/ui/Container'
import { EmptyState } from '@/shared/ui/EmptyState'
import { BookGrid } from '@/widgets/book-grid'
import { ProfileInfoRow } from './ProfileInfoRow'
import { ProfileHeader } from './ProfileHeader'
import { UserStatsStrip } from './UserStatsStrip'
import { OrdersPreview } from './OrdersPreview'
import { SellerBooksPreview } from './SellerBooksPreview'
import { useProfile, getFullName, isSeller, isAdmin, ROLE_LABELS, ROLE_BADGE_STYLE } from '@/entities/profile'
import { useCurrentUser } from '@/shared/hooks/useCurrentUser'
import { useFavoriteBooks } from '@/features/favorites'
import { useMyBooks, useMyOrders, useSentOrders } from '@/features/dashboard/model/useDashboard'
import { useSellerStats } from '@/entities/profile'

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function ProfileSkeleton() {
  return (
    <main id="main-content">
      <section className="py-12">
        <Container>
          <div className="max-w-4xl mx-auto flex flex-col gap-8">
            <div className="bg-surface border border-surface2 rounded-3xl overflow-hidden animate-pulse">
              <div className="h-28 bg-surface2" />
              <div className="px-6 pb-6">
                <div className="flex items-end justify-between -mt-12 mb-4">
                  <div className="w-24 h-24 rounded-full bg-surface2 ring-4 ring-surface" />
                </div>
                <div className="flex flex-col gap-2 mb-4">
                  <div className="h-7 w-48 bg-surface2 rounded-xl" />
                  <div className="h-4 w-64 bg-surface2 rounded-full" />
                </div>
                <div className="grid grid-cols-3 gap-px bg-surface2 rounded-2xl overflow-hidden">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="bg-bg h-20" />
                  ))}
                </div>
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
  const { data: favorites = [] }  = useFavoriteBooks(user?.id ?? null)
  const { data: myBooks = [] }    = useMyBooks(user?.id ?? null)
  const { data: myOrders = [] }   = useMyOrders(user?.id ?? null)
  const { data: sentOrders = [] } = useSentOrders(user?.id ?? null)
  const { data: stats }           = useSellerStats(user?.id ?? null)

  if (userLoading || profileLoading) return <ProfileSkeleton />

  if (!user) {
    return (
      <main id="main-content" className="flex-1 flex items-center justify-center py-24">
        <Container>
          <EmptyState
            title="Войдите в аккаунт"
            description="Чтобы открыть профиль, необходима авторизация"
            actionLabel="Войти"
            actionHref="/auth/login"
          />
        </Container>
      </main>
    )
  }

  const fullName    = getFullName(profile) || user.email?.split('@')[0] || 'Пользователь'
  const memberSince = new Date(user.created_at).toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })

  // Роль берём из профиля — единый источник правды
  const userIsSeller = isSeller(profile ?? null)
  const userIsAdmin  = isAdmin(profile ?? null)
  const hasSellerRole = userIsSeller || userIsAdmin

  const activeBooks  = myBooks.filter((b) => b.status === 'active')
  const pendingBooks = myBooks.filter((b) => b.status === 'pending')

  // ── Бейдж роли ───────────────────────────────────────────────────────────
  const roleBadge = profile ? (
    <div className="flex items-center gap-2 mb-2 flex-wrap">
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${ROLE_BADGE_STYLE[profile.role]}`}>
        {hasSellerRole && <Check size={10} strokeWidth={2.5}/>}
        {ROLE_LABELS[profile.role]}
      </span>
      {profile.isVerified && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gold/10 text-gold border border-gold/20">
          Верифицирован
        </span>
      )}
      {pendingBooks.length > 0 && (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gold/10 text-gold border border-gold/20">
          {pendingBooks.length} на модерации
        </span>
      )}
    </div>
  ) : null

  // ── Дополнительный инфо для продавца ─────────────────────────────────────
  const sellerExtraInfo = hasSellerRole && user.email ? (
    <ProfileInfoRow icon={<Mail size={14} strokeWidth={1.8}/>} label="Email" value={user.email} />
  ) : null

  // ── Статистика — разная для покупателя и продавца ─────────────────────────
  const statsNode = hasSellerRole ? (
    <UserStatsStrip
      dark
      cols={4}
      stats={[
        { label: 'В продаже',  value: activeBooks.length },
        { label: 'Продано',    value: stats?.soldBooks ?? 0 },
        { label: 'Заказов',    value: myOrders.length },
        { label: 'На сайте с', value: new Date(user.created_at).getFullYear() },
      ]}
    />
  ) : (
    <UserStatsStrip
      cols={3}
      stats={[
        { label: 'Избранных',  value: favorites.length },
        { label: 'Заказов',    value: sentOrders.length },
        { label: 'На сайте с', value: new Date(user.created_at).getFullYear() },
      ]}
    />
  )

  // ── Трастовые пилюли (только для продавца) ─────────────────────────────
  const trustNode = hasSellerRole && stats && stats.soldBooks > 0 ? (
    <div className="flex flex-wrap gap-2 mb-4">
      {stats.soldBooks >= 10 && (
        <span className="inline-flex items-center gap-1.5 text-xs text-accent bg-accent/8 border border-accent/20 rounded-full px-3 py-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#27a560]" />
          Опытный продавец
        </span>
      )}
      <span className="inline-flex items-center gap-1.5 text-xs text-accent bg-accent/8 border border-accent/20 rounded-full px-3 py-1">
        <span className="w-1.5 h-1.5 rounded-full bg-[#27a560]" />
        {stats.soldBooks} {stats.soldBooks === 1 ? 'книга продана' : stats.soldBooks < 5 ? 'книги продано' : 'книг продано'}
      </span>
    </div>
  ) : null

  return (
    <main id="main-content">
      <section className="py-12">
        <Container>
          <div className="max-w-4xl mx-auto flex flex-col gap-10">

            <ProfileHeader
              name={fullName}
              profile={profile ?? null}
              email={user.email ?? ''}
              memberSince={memberSince}
              isSeller={hasSellerRole}
              statsNode={statsNode}
              badgeNode={roleBadge}
              extraInfo={sellerExtraInfo}
              trustNode={trustNode}
            />

            {/* ── ПРОДАВЕЦ ──────────────────────────────────────────────── */}
            {hasSellerRole && (
              <>
                <SellerBooksPreview books={myBooks} />

                <OrdersPreview
                  orders={myOrders}
                  title="Входящие заказы"
                  href="/dashboard"
                  empty="Когда покупатели оформят заказы — они появятся здесь"
                />

                <hr className="border-surface2" />

                {favorites.length > 0 && (
                  <section aria-labelledby="fav-heading">
                    <div className="flex items-end justify-between mb-6">
                      <div>
                        <p className="text-[11px] font-medium tracking-[2px] uppercase text-accent mb-1">Коллекция</p>
                        <h2 id="fav-heading" className="font-display font-semibold text-ink"
                          style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.2rem, 2vw, 1.5rem)' }}>
                          Избранные книги
                        </h2>
                      </div>
                      <Link href="/favorites" className="text-sm text-ash hover:text-ink transition-colors inline-flex items-center gap-1 group">
                        Все <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                      </Link>
                    </div>
                    <BookGrid books={favorites.slice(0, 4)} />
                  </section>
                )}
              </>
            )}

            {/* ── ПОКУПАТЕЛЬ ────────────────────────────────────────────── */}
            {!hasSellerRole && (
              <>
                <OrdersPreview
                  orders={sentOrders}
                  title="Мои заказы"
                  href="/dashboard"
                  empty="Вы ещё не оформляли заказы"
                />

                <section aria-labelledby="fav-heading">
                  <div className="flex items-end justify-between mb-6">
                    <div>
                      <p className="text-[11px] font-medium tracking-[2px] uppercase text-accent mb-1">Коллекция</p>
                      <h2 id="fav-heading" className="font-display font-semibold text-ink"
                        style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.2rem, 2vw, 1.5rem)' }}>
                        Избранные книги
                      </h2>
                    </div>
                    {favorites.length > 0 && (
                      <Link href="/favorites" className="text-sm text-ash hover:text-ink transition-colors hidden sm:inline-flex items-center gap-1 group">
                        Все <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                      </Link>
                    )}
                  </div>

                  {favorites.length === 0 ? (
                    <EmptyState
                      title="Нет избранных книг"
                      description="Нажмите на закладку на карточке книги, чтобы сохранить её"
                      actionLabel="Перейти в каталог"
                      actionHref="/catalog"
                    />
                  ) : (
                    <BookGrid books={favorites.slice(0, 4)} />
                  )}
                </section>

                {/* CTA — стать продавцом */}
                <div className="bg-surface border border-surface2 rounded-2xl px-6 py-5 flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <p className="text-sm font-medium text-ink mb-0.5">Хотите продавать книги?</p>
                    <p className="text-xs text-ash">Добавьте первую книгу — профиль автоматически станет витриной продавца</p>
                  </div>
                  <Link
                    href="/add-book"
                    className="inline-flex items-center gap-1.5 h-9 px-5 rounded-xl text-sm font-medium bg-accent text-bg hover:bg-accent2 transition-all flex-shrink-0"
                  >
                    <Plus size={12} strokeWidth={2.5}/>
                    Добавить книгу
                  </Link>
                </div>
              </>
            )}

          </div>
        </Container>
      </section>
    </main>
  )
})

ProfilePage.displayName = 'ProfilePage'
