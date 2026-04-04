import { type FC } from 'react'
import { cn } from '@/shared/lib/cn'

interface ProfileAvatarProps {
  avatarUrl?: string | null
  name?:      string | null
  size?:      'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const SIZES = {
  sm: 'w-8  h-8  text-[11px]',
  md: 'w-10 h-10 text-xs',
  lg: 'w-16 h-16 text-lg',
  xl: 'w-24 h-24 text-2xl',
}

function getInitials(name: string | null | undefined): string {
  if (!name) return '?'
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export const ProfileAvatar: FC<ProfileAvatarProps> = ({
  avatarUrl,
  name,
  size = 'md',
  className,
}) => {
  const initials = getInitials(name)

  if (avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={avatarUrl}
        alt={name ?? 'Аватар пользователя'}
        className={cn('rounded-full object-cover border-2 border-surface2', SIZES[size], className)}
      />
    )
  }

  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center flex-shrink-0',
        'bg-accent font-semibold text-bg border-2 border-accent/20',
        SIZES[size],
        className,
      )}
      aria-label={name ?? 'Пользователь'}
    >
      {initials}
    </div>
  )
}
