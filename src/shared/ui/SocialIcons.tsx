import { type FC, type SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

export const IconTelegram: FC<IconProps> = ({ size = 18, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M21.94 4.3L18.6 19.6c-.25 1.1-.9 1.37-1.82.85l-5-3.68-2.41 2.32c-.27.27-.49.49-.99.49l.35-5.03L17.6 7.4c.42-.37-.09-.58-.65-.21L6.05 14.4 1.15 12.9c-1.07-.33-1.09-1.07.22-1.58L20.46 2.8c.9-.33 1.68.2 1.48 1.5z"/>
  </svg>
)

export const IconVK: FC<IconProps> = ({ size = 18, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 101 100" fill="none" aria-hidden="true" {...props}>
    <path d="M0.5 48C0.5 25.3726 0.5 14.0589 7.52944 7.02944C14.5589 0 25.8726 0 48.5 0H52.5C75.1274 0 86.4411 0 93.4706 7.02944C100.5 14.0589 100.5 25.3726 100.5 48V52C100.5 74.6274 100.5 85.9411 93.4706 92.9706C86.4411 100 75.1274 100 52.5 100H48.5C25.8726 100 14.5589 100 7.52944 92.9706C0.5 85.9411 0.5 74.6274 0.5 52V48Z" fill="#0077FF"/>
    <path d="M53.7085 72.042C30.9168 72.042 17.9169 56.417 17.3752 30.417H28.7919C29.1669 49.5003 37.5834 57.5836 44.25 59.2503V30.417H55.0004V46.8752C61.5837 46.1669 68.4995 38.667 70.8329 30.417H81.5832C79.7915 40.5837 72.2915 48.0836 66.9582 51.1669C72.2915 53.6669 80.8336 60.2086 84.0836 72.042H72.2499C69.7082 64.1253 63.3754 58.0003 55.0004 57.1669V72.042H53.7085Z" fill="white"/>
  </svg>
)

export const IconMax: FC<IconProps> = ({ size = 18, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 1000 1000" aria-hidden="true" {...props}>
    <defs>
      <linearGradient id="max-icon-b">
        <stop offset="0" stopColor="#00f"/>
        <stop offset="1" stopOpacity="0"/>
      </linearGradient>
      <linearGradient id="max-icon-a">
        <stop offset="0" stopColor="#4cf"/>
        <stop offset=".662" stopColor="#53e"/>
        <stop offset="1" stopColor="#93d"/>
      </linearGradient>
      <linearGradient id="max-icon-c" x1="117.847" x2="1000" y1="760.536" y2="500" gradientUnits="userSpaceOnUse" href="#max-icon-a"/>
      <radialGradient id="max-icon-d" cx="-87.392" cy="1166.116" r="500" fx="-87.392" fy="1166.116" gradientTransform="rotate(51.356 1551.478 559.3)scale(2.42703433 1)" gradientUnits="userSpaceOnUse" href="#max-icon-b"/>
    </defs>
    <rect width="1000" height="1000" fill="url(#max-icon-c)" ry="249.681"/>
    <rect width="1000" height="1000" fill="url(#max-icon-d)" ry="249.681"/>
    <path fill="#fff" fillRule="evenodd" clipRule="evenodd" d="M508.211 878.328c-75.007 0-109.864-10.95-170.453-54.75-38.325 49.275-159.686 87.783-164.979 21.9 0-49.456-10.95-91.248-23.36-136.873-14.782-56.21-31.572-118.807-31.572-209.508 0-216.626 177.754-379.597 388.357-379.597 210.785 0 375.947 171.001 375.947 381.604.707 207.346-166.595 376.118-373.94 377.224m3.103-571.585c-102.564-5.292-182.499 65.7-200.201 177.024-14.6 92.162 11.315 204.398 33.397 210.238 10.585 2.555 37.23-18.98 53.837-35.587a189.8 189.8 0 0 0 92.71 33.032c106.273 5.112 197.08-75.794 204.215-181.95 4.154-106.382-77.67-196.486-183.958-202.574Z"/>
  </svg>
)
