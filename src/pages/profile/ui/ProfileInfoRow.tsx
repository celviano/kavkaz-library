import { type FC, type ReactNode } from 'react'

interface ProfileInfoRowProps {
  icon:     ReactNode
  label:    string
  value:    string | null | undefined
  href?:    string
}

export const ProfileInfoRow: FC<ProfileInfoRowProps> = ({ icon, label, value, href }) => {
  if (!value) return null

  return (
    <div className="flex items-center gap-3">
      <span className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center text-ash flex-shrink-0">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-[10px] text-dim uppercase tracking-wider">{label}</p>
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-accent hover:text-accent2 transition-colors truncate block"
          >
            {value}
          </a>
        ) : (
          <p className="text-sm text-ink truncate">{value}</p>
        )}
      </div>
    </div>
  )
}
