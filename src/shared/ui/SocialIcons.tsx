import { type FC, type SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

export const IconTelegram: FC<IconProps> = ({ size = 18, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M21.94 4.3L18.6 19.6c-.25 1.1-.9 1.37-1.82.85l-5-3.68-2.41 2.32c-.27.27-.49.49-.99.49l.35-5.03L17.6 7.4c.42-.37-.09-.58-.65-.21L6.05 14.4 1.15 12.9c-1.07-.33-1.09-1.07.22-1.58L20.46 2.8c.9-.33 1.68.2 1.48 1.5z"/>
  </svg>
)

export const IconVK: FC<IconProps> = ({ size = 18, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M12.6 16s.4-.04.6-.26c.18-.2.18-.57.18-.57s-.03-1.74.79-2 1.94 1.7 3.1 2.44c.87.57 1.54.44 1.54.44l3.08-.04s1.61-.1.85-1.36c-.06-.1-.44-.94-2.28-2.65-1.92-1.78-1.66-1.5.65-4.57 1.41-1.88 1.97-3.02 1.79-3.51-.17-.47-1.19-.35-1.19-.35l-3.47.02s-.26-.03-.45.07c-.19.1-.31.34-.31.34s-.54 1.44-1.26 2.67c-1.52 2.57-2.13 2.71-2.38 2.55-.58-.37-.43-1.5-.43-2.3 0-2.51.38-3.55-.74-3.82C11.5 3 10.93 3 9.6 3 7.94 3 6.53 3.02 5.73 3.43c-.54.27-.95.88-.7.91.31.04 1.01.19 1.38.7.49.65.47 2.12.47 2.12s.28 2.96-.65 3.33c-.64.25-1.52-.26-3.4-2.6C2.07 6.42 1.54 5.3 1.54 5.3s-.13-.22-.31-.33c-.22-.13-.53-.17-.53-.17L.24 4.83s-1.72-.04-.18 2.44C1.1 8.68 4.5 13 8.2 13c0 0 .4.04.62-.17.2-.2.19-.57.19-.57s-.04-1.75.78-2 1.93 1.69 3.08 2.43c.87.57 1.54.44 1.54.44l3.08-.04s1.61-.1.85-1.36z"/>
  </svg>
)

export const IconMax: FC<IconProps> = ({ size = 18, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
    <rect width="24" height="24" rx="5" fill="currentColor" opacity="0.15"/>
    <text x="12" y="16" textAnchor="middle" fontSize="9" fontWeight="700" fill="currentColor" fontFamily="Arial">MAX</text>
  </svg>
)
