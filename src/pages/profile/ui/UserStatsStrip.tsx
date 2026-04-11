import { type FC } from 'react'

interface Stat { label: string; value: string | number }

interface UserStatsStripProps {
  stats:    Stat[]
  cols?:    3 | 4
  dark?:    boolean
}

export const UserStatsStrip: FC<UserStatsStripProps> = ({ stats, cols = 3, dark = false }) => (
  <div
    className={`grid gap-px rounded-2xl overflow-hidden ${dark ? 'bg-dark/80' : 'bg-surface2'}`}
    style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
  >
    {stats.map(({ label, value }) => (
      <div
        key={label}
        className={`px-4 py-4 flex flex-col items-center text-center gap-0.5 ${dark ? 'bg-dark' : 'bg-bg'}`}
      >
        <span
          className={`font-display font-semibold leading-none ${dark ? 'text-accent3' : 'text-accent'}`}
          style={{ fontFamily: 'var(--font-display)', fontSize: '1.45rem' }}
        >
          {value}
        </span>
        <span className={`text-[10px] uppercase tracking-wider ${dark ? 'text-ash/60' : 'text-ash'}`}>
          {label}
        </span>
      </div>
    ))}
  </div>
)
