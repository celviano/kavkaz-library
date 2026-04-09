'use client'

import { memo } from 'react'
import Link from 'next/link'
import { Container } from '@/shared/ui/Container'
import { EmptyState } from '@/shared/ui/EmptyState'
import { SectionHeading } from '@/shared/ui/SectionHeading'
import { ProfileAvatar } from '@/entities/profile'
import { useProfile, useSellerStats, getFullName, ROLE_LABELS } from '@/entities/profile'
import { SellerBooksGrid } from './SellerBooksGrid'

interface SellerPageProps {
  sellerId: string
}

function SellerSkeleton() {
  return (
    <main id="main-content" className="py-12">
      <Container>
        <div className="max-w-4xl mx-auto flex flex-col gap-10">
          <div className="bg-surface border border-surface2 rounded-3xl overflow-hidden">
            <div className="h-28 bg-surface2 animate-pulse" />
            <div className="px-6 pb-6">
              <div className="flex items-end justify-between -mt-10 mb-4">
                <div className="w-20 h-20 rounded-full bg-surface2 ring-4 ring-surface animate-pulse" />
              </div>
              <div className="flex flex-col gap-2">
                <div className="h-7 w-48 bg-surface2 rounded-xl animate-pulse" />
                <div className="h-4 w-64 bg-surface2 rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </main>
  )
}

export const SellerPage = memo<SellerPageProps>(({ sellerId }) => {
  const { data: profile, isLoading } = useProfile(sellerId)
  const { data: stats } = useSellerStats(sellerId)

  if (isLoading) return <SellerSkeleton />

  if (!profile) {
    return (
      <main id="main-content" className="flex-1 flex items-center justify-center py-24">
        <Container>
          <EmptyState
            title="Продавец не найден"
            description="Возможно, аккаунт был удалён"
            actionLabel="В каталог"
            actionHref="/catalog"
          />
        </Container>
      </main>
    )
  }

  const name     = getFullName(profile) || 'Пользователь'
  const location = [profile.city, profile.country].filter(Boolean).join(', ')
  const joinYear = profile.createdAt.getFullYear()

  return (
    <main id="main-content">
      <section className="py-12">
        <Container>
          <div className="max-w-4xl mx-auto flex flex-col gap-10">

            {/* Profile card */}
            <div className="bg-surface border border-surface2 rounded-3xl overflow-hidden">
              {/* Banner */}
              <div className="relative h-28 bg-surface2">
                <svg className="absolute inset-0 w-full h-full opacity-[0.06]" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                  <defs>
                    <pattern id="seller-pat" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                      <polygon points="30,4 56,30 30,56 4,30" fill="none" stroke="#2a5c45" strokeWidth="1"/>
                      <polygon points="30,14 46,30 30,46 14,30" fill="none" stroke="#8B6914" strokeWidth="0.7"/>
                      <circle cx="30" cy="30" r="3" fill="#2a5c45"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#seller-pat)"/>
                </svg>
              </div>

              <div className="px-6 pb-6">
                {/* Avatar */}
                <div className="flex items-end justify-between -mt-10 mb-4">
                  <ProfileAvatar
                    avatarUrl={profile.avatarUrl}
                    name={name}
                    size="xl"
                    className="ring-4 ring-surface"
                  />
                  {/* Verified badge */}
                  {profile.isVerified && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-accent/10 text-accent border border-accent/20">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      Верифицирован
                    </span>
                  )}
                </div>

                {/* Name + role */}
                <div className="flex flex-col gap-1 mb-4">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <h1
                      className="font-display font-semibold text-ink"
                      style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.3rem, 3vw, 1.8rem)' }}
                    >
                      {name}
                    </h1>
                    {profile.role !== 'user' && (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20 uppercase tracking-wider">
                        {ROLE_LABELS[profile.role]}
                      </span>
                    )}
                  </div>
                  {profile.bio && (
                    <p className="text-ash text-sm leading-relaxed max-w-lg">{profile.bio}</p>
                  )}
                </div>

                {/* Info row */}
                <div className="flex flex-wrap gap-4 mb-5 text-xs text-ash">
                  {location && (
                    <span className="flex items-center gap-1.5">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                        <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/>
                        <circle cx="12" cy="10" r="3"/>
                      </svg>
                      {location}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                      <rect x="3" y="4" width="18" height="18" rx="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    На платформе с {joinYear} г.
                  </span>
                  {profile.website && (
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-accent hover:text-accent2 transition-colors"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                      </svg>
                      Сайт
                    </a>
                  )}
                </div>

                {/* Stats */}
                {stats && (
                  <div className="grid grid-cols-3 gap-px bg-surface2 rounded-2xl overflow-hidden">
                    {[
                      { label: 'Книг в продаже', value: stats.activeBooks },
                      { label: 'Продано',         value: stats.soldBooks },
                      { label: 'Всего добавлено', value: stats.totalBooks },
                    ].map(({ label, value }) => (
                      <div key={label} className="bg-bg px-4 py-3.5 flex flex-col items-center text-center gap-0.5">
                        <span
                          className="font-display font-semibold text-accent leading-none"
                          style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem' }}
                        >
                          {value}
                        </span>
                        <span className="text-[10px] text-ash uppercase tracking-wider">{label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Books */}
            <section aria-labelledby="seller-books-heading">
              <div className="flex items-end justify-between mb-6">
                <SectionHeading
                  eyebrow="Предложения"
                  title={`Книги продавца`}
                  id="seller-books-heading"
                />
              </div>
              <SellerBooksGrid sellerId={sellerId} />
            </section>

          </div>
        </Container>
      </section>
    </main>
  )
})

SellerPage.displayName = 'SellerPage'
