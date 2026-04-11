'use client'

import { type FC, type ReactNode } from 'react'
import Link from 'next/link'
import { ProfileAvatar } from '@/entities/profile'
import { ProfileBanner } from './ProfileBanner'
import { ProfileInfoRow } from './ProfileInfoRow'
import type { Profile } from '@/entities/profile'

// ─── Icons ────────────────────────────────────────────────────────────────────
const IconLocation = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
)
const IconCalendar = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
)
const IconLink = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
  </svg>
)
const IconMail = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
)

interface ProfileHeaderProps {
  name:        string
  profile:     Profile | null
  email:       string
  memberSince: string
  isSeller:    boolean
  statsNode:   ReactNode
  extraInfo?:  ReactNode   // extra info rows for seller
  badgeNode?:  ReactNode   // seller badge
  trustNode?:  ReactNode   // trust pills
}

export const ProfileHeader: FC<ProfileHeaderProps> = ({
  name,
  profile,
  email,
  memberSince,
  isSeller,
  statsNode,
  extraInfo,
  badgeNode,
  trustNode,
}) => {
  const location = [profile?.city, profile?.country].filter(Boolean).join(', ')

  return (
    <div className="bg-surface border border-surface2 rounded-3xl overflow-hidden">
      <ProfileBanner variant={isSeller ? 'seller' : 'default'} />

      <div className="px-6 pb-6">
        {/* Avatar row — avatar overlaps banner, edit button top right */}
        <div className="flex items-end justify-between -mt-12 mb-4">
          <ProfileAvatar
            avatarUrl={profile?.avatarUrl}
            name={name}
            size="xl"
            className="ring-4 ring-surface relative z-10"
          />
          <Link
            href="/profile/edit"
            className="inline-flex items-center gap-2 h-9 px-4 rounded-lg text-sm font-medium border border-surface2 text-ash hover:text-ink hover:bg-surface2 transition-all focus-visible:outline-2 focus-visible:outline-accent"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            Редактировать
          </Link>
        </div>

        {/* Badge + name + bio */}
        <div className="flex flex-col gap-1 mb-4">
          {badgeNode}
          <h1
            className="font-display font-semibold text-ink leading-tight"
            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem, 3vw, 2rem)' }}
          >
            {name}
          </h1>
          {profile?.displayName && (profile.firstName || profile.lastName) && (
            <p className="text-dim text-sm">@{profile.displayName}</p>
          )}
          {profile?.bio && (
            <p className="text-ash text-sm leading-relaxed mt-0.5 max-w-lg">{profile.bio}</p>
          )}
        </div>

        {/* Info rows */}
        <div className="flex flex-col gap-2 mb-4">
          {location && <ProfileInfoRow icon={<IconLocation />} label="Местоположение" value={location} />}
          <ProfileInfoRow icon={<IconCalendar />} label="С нами с" value={memberSince} />
          {profile?.website && <ProfileInfoRow icon={<IconLink />} label="Сайт" value={profile.website} href={profile.website} />}
          {extraInfo}
        </div>

        {/* Trust pills */}
        {trustNode}

        {/* Stats */}
        {statsNode}
      </div>
    </div>
  )
}
