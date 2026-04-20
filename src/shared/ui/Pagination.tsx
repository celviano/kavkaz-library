'use client'

import { type FC } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { cn } from '@/shared/lib/cn'

interface PaginationProps {
  currentPage:  number
  totalPages:   number
  className?:   string
}

export const Pagination: FC<PaginationProps> = ({ currentPage, totalPages, className }) => {
  const router      = useRouter()
  const pathname    = usePathname()
  const searchParams = useSearchParams()

  if (totalPages <= 1) return null

  function goToPage(page: number) {
    const params = new URLSearchParams(searchParams?.toString() ?? '')
    if (page === 1) {
      params.delete('page')
    } else {
      params.set('page', String(page))
    }
    const query = params.toString()
    router.push(`${pathname}${query ? `?${query}` : ''}`)
  }

  // Build page numbers to show: always first, last, current ±1, with ellipsis
  function getPages(): (number | '...')[] {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)

    const pages: (number | '...')[] = [1]

    if (currentPage > 3) pages.push('...')

    const start = Math.max(2, currentPage - 1)
    const end   = Math.min(totalPages - 1, currentPage + 1)

    for (let i = start; i <= end; i++) pages.push(i)

    if (currentPage < totalPages - 2) pages.push('...')
    pages.push(totalPages)

    return pages
  }

  const pages = getPages()

  return (
    <nav
      aria-label="Пагинация"
      className={cn('flex items-center justify-center gap-1', className)}
    >
      {/* Prev */}
      <button
        type="button"
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(
          'w-9 h-9 rounded-xl flex items-center justify-center text-sm',
          'border border-surface2 transition-all',
          'focus-visible:outline-2 focus-visible:outline-accent',
          currentPage === 1
            ? 'opacity-40 cursor-not-allowed text-ash'
            : 'text-ash hover:text-ink hover:bg-surface hover:border-surface3 cursor-pointer',
        )}
        aria-label="Предыдущая страница"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
      </button>

      {/* Page numbers */}
      {pages.map((page, i) =>
        page === '...' ? (
          <span key={`ellipsis-${i}`} className="w-9 h-9 flex items-center justify-center text-dim text-sm">
            …
          </span>
        ) : (
          <button
            key={page}
            type="button"
            onClick={() => goToPage(page)}
            aria-current={page === currentPage ? 'page' : undefined}
            className={cn(
              'w-9 h-9 rounded-xl flex items-center justify-center text-sm font-medium',
              'border transition-all cursor-pointer',
              'focus-visible:outline-2 focus-visible:outline-accent',
              page === currentPage
                ? 'bg-accent text-bg border-accent shadow-accent-sm'
                : 'border-surface2 text-ash hover:text-ink hover:bg-surface hover:border-surface3',
            )}
            aria-label={`Страница ${page}`}
          >
            {page}
          </button>
        ),
      )}

      {/* Next */}
      <button
        type="button"
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(
          'w-9 h-9 rounded-xl flex items-center justify-center text-sm',
          'border border-surface2 transition-all',
          'focus-visible:outline-2 focus-visible:outline-accent',
          currentPage === totalPages
            ? 'opacity-40 cursor-not-allowed text-ash'
            : 'text-ash hover:text-ink hover:bg-surface hover:border-surface3 cursor-pointer',
        )}
        aria-label="Следующая страница"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </button>
    </nav>
  )
}
