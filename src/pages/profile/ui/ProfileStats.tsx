import { type FC } from 'react'

interface StatItem {
  label: string
  value: string | number
}

interface ProfileStatsProps {
  stats: StatItem[]
}

export const ProfileStats: FC<ProfileStatsProps> = ({ stats }) => (
  <div className="grid grid-cols-3 gap-px bg-surface2 rounded-2xl overflow-hidden">
    {stats.map(({ label, value }) => (
      <div key={label} className="bg-bg px-4 py-4 flex flex-col items-center gap-1 text-center">
        <span
          className="font-display font-semibold text-accent"
          style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', lineHeight: 1 }}
        >
          {value}
        </span>
        <span className="text-[11px] text-ash uppercase tracking-wider">{label}</span>
      </div>
    ))}
  </div>
)
