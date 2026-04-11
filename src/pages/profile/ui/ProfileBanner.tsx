import { type FC } from 'react'
import { cn } from '@/shared/lib/cn'

interface ProfileBannerProps {
  variant?: 'default' | 'seller'
  className?: string
}

export const ProfileBanner: FC<ProfileBannerProps> = ({ variant = 'default', className }) => (
  <div
    className={cn(
      'relative h-28 overflow-hidden',
      variant === 'seller' ? 'bg-dark' : 'bg-surface2',
      className,
    )}
    aria-hidden="true"
  >
    <svg
      className="absolute inset-0 w-full h-full"
      preserveAspectRatio="xMidYMid slice"
      style={{ opacity: variant === 'seller' ? 0.12 : 0.06 }}
    >
      <defs>
        <pattern id={`banner-pat-${variant}`} x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
          <polygon points="30,4 56,30 30,56 4,30" fill="none" stroke="#2a5c45" strokeWidth="1"/>
          <polygon points="30,14 46,30 30,46 14,30" fill="none" stroke="#8B6914" strokeWidth="0.7"/>
          <circle cx="30" cy="30" r="3" fill="#2a5c45"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#banner-pat-${variant})`}/>
    </svg>
  </div>
)
