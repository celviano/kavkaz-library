import { type FC } from 'react'

interface SectionHeadingProps {
  eyebrow?: string
  title: string
  id?: string
}

export const SectionHeading: FC<SectionHeadingProps> = ({ eyebrow, title, id }) => (
  <div>
    {eyebrow && (
      <p className="text-[11px] font-medium tracking-[2px] uppercase text-accent mb-2">
        {eyebrow}
      </p>
    )}
    <h2
      id={id}
      className="font-display font-semibold text-ink leading-tight"
      style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)' }}
    >
      {title}
    </h2>
  </div>
)
