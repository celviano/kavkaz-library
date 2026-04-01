import { type FC, type ReactNode } from 'react'

interface AuthCardProps {
  title: string
  subtitle?: string
  children: ReactNode
}

export const AuthCard: FC<AuthCardProps> = ({ title, subtitle, children }) => {
  return (
    <div className="w-full max-w-md mx-auto">
      {/* Logo mark */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center gap-2.5">
          <svg width="28" height="22" viewBox="0 0 28 22" fill="none" aria-hidden="true">
            <path d="M10 20L18 5L26 20H10Z" fill="#1B2212" opacity="0.2"/>
            <path d="M2 20L11 4L20 20H2Z" fill="#2a5c45"/>
            <path d="M11 4L14 9.5H8L11 4Z" fill="#f2ede6" opacity="0.7"/>
          </svg>
          <span
            className="font-display text-xl font-semibold text-ink"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Kavkaz<span className="text-accent italic">Library</span>
          </span>
        </div>
      </div>

      <div className="bg-surface border border-surface2 rounded-3xl p-8 shadow-card">
        <div className="mb-7 text-center">
          <h1
            className="font-display font-semibold text-ink mb-1.5"
            style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem' }}
          >
            {title}
          </h1>
          {subtitle && <p className="text-sm text-ash">{subtitle}</p>}
        </div>
        {children}
      </div>
    </div>
  )
}
