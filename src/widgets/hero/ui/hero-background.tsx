import React from 'react'
import Image from 'next/image'

import heroPainting from '../../../../public/images/hero-painting.jpg'

export const HeroBackground = () => {
  return (
    <div>
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src={heroPainting}
          alt=""
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
          quality={90}
        />
      </div>

      {/* Layer 1: heavy top fade so text is always readable */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, rgba(242,237,230,0.92) 0%, rgba(242,237,230,0.78) 45%, rgba(242,237,230,0.45) 75%, rgba(242,237,230,0.15) 100%)',
        }}
        aria-hidden="true"
      />

      {/* Layer 2: warm tint */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'rgba(242,237,230,0.18)' }}
        aria-hidden="true"
      />

      {/* Layer 3: carpet pattern */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.025]"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="carpet"
            x="0"
            y="0"
            width="80"
            height="80"
            patternUnits="userSpaceOnUse"
          >
            <polygon
              points="40,6 74,40 40,74 6,40"
              fill="none"
              stroke="#2a5c45"
              strokeWidth="1.5"
            />
            <polygon
              points="40,18 62,40 40,62 18,40"
              fill="none"
              stroke="#8B6914"
              strokeWidth="1"
            />
            <polygon points="40,28 52,40 40,52 28,40" fill="#2a5c45" opacity="0.4" />
            <line
              x1="0"
              y1="40"
              x2="80"
              y2="40"
              stroke="#2a5c45"
              strokeWidth="0.5"
              opacity="0.5"
            />
            <line
              x1="40"
              y1="0"
              x2="40"
              y2="80"
              stroke="#2a5c45"
              strokeWidth="0.5"
              opacity="0.5"
            />
            <circle cx="0" cy="0" r="2" fill="#8B6914" />
            <circle cx="80" cy="0" r="2" fill="#8B6914" />
            <circle cx="0" cy="80" r="2" fill="#8B6914" />
            <circle cx="80" cy="80" r="2" fill="#8B6914" />
            <circle cx="40" cy="0" r="2" fill="#2a5c45" />
            <circle cx="40" cy="80" r="2" fill="#2a5c45" />
            <circle cx="0" cy="40" r="2" fill="#2a5c45" />
            <circle cx="80" cy="40" r="2" fill="#2a5c45" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#carpet)" />
      </svg>
    </div>
  )
}
