import { type FC } from 'react'
import { cn } from '@/shared/lib/cn'
import type { BookCategory } from '@/entities/book'

interface BadgeProps {
  category: BookCategory
  label: string
  className?: string
}

const CATEGORY_COLORS: Record<BookCategory, string> = {
  history:     'bg-accent/10 text-accent border-accent/20',
  geography:   'bg-steel2/10 text-steel2 border-steel2/20',
  ethnography: 'bg-gold/10 text-gold border-gold/20',
  memoirs:     'bg-ash/10 text-ash border-ash/20',
  atlases:     'bg-ink/6 text-text border-ink/12',
  other:       'bg-dim/10 text-dim border-dim/20',
  culture:     'bg-accent2/10 text-accent2 border-accent2/20',
  languages:   'bg-dim/10 text-dim border-dim/20',
  literature:  'bg-accent/10 text-accent border-accent/20',
  biography:   'bg-ash/10 text-ash border-ash/20',
}

export const Badge: FC<BadgeProps> = ({ category, label, className }) => {
  return (
    <span
      className={cn(
        'flex w-fit items-center rounded-full px-2.5 py-[3px]',
        'text-[11px] font-medium border',
        CATEGORY_COLORS[category],
        className,
      )}
    >
      {label}
    </span>
  )
}
