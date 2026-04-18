'use client'

import { type FC, type ReactNode } from 'react'
import Link from 'next/link'
import { MapPin, Calendar, Link2, Mail, Pencil } from 'lucide-react'
import { ProfileAvatar } from '@/entities/profile'
import { ProfileBanner } from './ProfileBanner'
import { ProfileInfoRow } from './ProfileInfoRow'
import type { Profile } from '@/entities/profile'

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
            <Pencil size={13} strokeWidth={1.8} aria-hidden="true"/>
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
          {location && <ProfileInfoRow icon={<MapPin size={14} strokeWidth={1.8}/>} label="Местоположение" value={location} />}
          <ProfileInfoRow icon={<Calendar size={14} strokeWidth={1.8}/>} label="С нами с" value={memberSince} />
          {profile?.website && <ProfileInfoRow icon={<Link2 size={14} strokeWidth={1.8}/>} label="Сайт" value={profile.website} href={profile.website} />}
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
