'use client'

import { memo } from 'react'
import { cn } from '@/shared/lib/cn'
import { EmptyState } from '@/shared/ui/EmptyState'
import {
  EBOOK_STATUS_LABELS,
  EBOOK_STATUS_COLORS,
  EBOOK_FORMAT_LABELS,
  formatFileSize,
} from '@/entities/ebook/model/types'
import { useMyEbooks } from '@/features/ebooks/model/useEbooks'

interface MyEbooksTabProps {
  userId: string
}

export const MyEbooksTab = memo<MyEbooksTabProps>(({ userId }) => {
  const { data: ebooks = [], isLoading } = useMyEbooks(userId)

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="h-24 rounded-2xl bg-surface border border-surface2 animate-pulse" />
        ))}
      </div>
    )
  }

  if (ebooks.length === 0) {
    return (
      <EmptyState
        title="Нет загруженных книг"
        description="Загрузите электронную книгу в общественном достоянии — она появится в каталоге после проверки"
      />
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {ebooks.map((ebook) => (
        <div key={ebook.id} className="bg-bg border border-surface2 rounded-2xl p-5 flex flex-col gap-3 shadow-card">
          {/* Header */}
          <div className="flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-ink">{ebook.title}</p>
              <p className="text-xs text-ash mt-0.5">
                {ebook.author}{ebook.year ? `, ${ebook.year}` : ''}
              </p>
            </div>
            <span className={cn(
              'inline-flex items-center h-6 px-2.5 rounded-full text-[11px] font-medium border flex-shrink-0',
              EBOOK_STATUS_COLORS[ebook.status],
            )}>
              {EBOOK_STATUS_LABELS[ebook.status]}
            </span>
          </div>

          {/* Meta */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200">
              {EBOOK_FORMAT_LABELS[ebook.fileFormat]}
            </span>
            <span className="text-xs text-dim">{formatFileSize(ebook.fileSize)}</span>
            {ebook.status === 'approved' && (
              <span className="text-xs text-dim">📥 {ebook.downloadCount} загрузок</span>
            )}
          </div>

          {/* Status message */}
          {ebook.status === 'pending' && (
            <p className="text-xs text-ash bg-gold/5 border border-gold/20 rounded-lg px-3 py-2">
              Книга отправлена на проверку. Обычно это занимает 1–2 рабочих дня.
            </p>
          )}
          {ebook.status === 'rejected' && ebook.rejectionReason && (
            <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              Причина отклонения: {ebook.rejectionReason}
            </p>
          )}
          {ebook.status === 'rejected' && !ebook.rejectionReason && (
            <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              К сожалению, книга не прошла модерацию
            </p>
          )}
        </div>
      ))}
    </div>
  )
})

MyEbooksTab.displayName = 'MyEbooksTab'
