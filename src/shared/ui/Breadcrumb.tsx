import { type FC } from 'react'
import Link from 'next/link'

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export const Breadcrumb: FC<BreadcrumbProps> = ({ items }) => (
  <nav aria-label="Навигация по разделам" className="mb-10">
    <ol className="flex flex-wrap items-center gap-2 text-sm text-ash">
      {items.map((item, i) => (
        <li key={i} className="flex items-center gap-2">
          {i > 0 && (
            <span aria-hidden="true" className="text-surface3">›</span>
          )}
          {item.href ? (
            <Link
              href={item.href}
              className="hover:text-accent transition-colors focus-visible:outline-accent rounded"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-text line-clamp-1">{item.label}</span>
          )}
        </li>
      ))}
    </ol>
  </nav>
)
