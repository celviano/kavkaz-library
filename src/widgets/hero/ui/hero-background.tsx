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
    </div>
  )
}
