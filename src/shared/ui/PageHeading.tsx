import { type FC } from 'react'

interface PageHeadingProps {
  eyebrow?: string
  title: string
  subtitle?: string
  id?: string
}

export const PageHeading: FC<PageHeadingProps> = ({ eyebrow, title, subtitle, id }) => (
  <div>
    {eyebrow && (
      <p className="text-[11px] font-medium tracking-[2px] uppercase text-accent mb-2">
        {eyebrow}
      </p>
    )}
    <h1
      id={id}
      className="font-display font-semibold text-ink leading-tight mb-2"
      style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)' }}
    >
      {title}
    </h1>
    {subtitle && <p className="text-ash text-base">{subtitle}</p>}
  </div>
)
