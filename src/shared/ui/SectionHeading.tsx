import { type FC } from 'react'

interface SectionHeadingProps {
  eyebrow?: string
  title: string
  id?: string
}

export const SectionHeading: FC<SectionHeadingProps> = ({ eyebrow, title, id }) => (
  <div>
    {eyebrow && (
      <p className="text-[11px] font-normal tracking-[2px] uppercase text-accent mb-2">
        {eyebrow}
      </p>
    )}
    <h2
      id={id}
      className="font-display font-normal text-4xl text-ink leading-tight"
    >
      {title}
    </h2>
  </div>
)
