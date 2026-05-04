'use client'

import { memo, useState } from 'react'
import { cn } from '@/shared/lib/cn'
import { EmptyState } from '@/shared/ui/EmptyState'
import {
  EBOOK_STATUS_LABELS,
  EBOOK_STATUS_COLORS,
  EBOOK_FORMAT_LABELS,
  formatFileSize,
} from '@/entities/ebook/model/types'
import { useAllEbooks, useUpdateEbookStatus } from '@/features/ebooks/model/useEbooks'
import type { Ebook } from '@/entities/ebook/model/types'

function EbookAdminCard({ ebook }: { ebook: Ebook }) {
  const [rejectReason, setRejectReason] = useState('')
  const [showReject,   setShowReject]   = useState(false)
  const { mutate: updateStatus, isPending } = useUpdateEbookStatus()

  function handleApprove() {
    updateStatus({ ebookId: ebook.id, status: 'approved' })
  }

  function handleReject() {
    if (!showReject) { setShowReject(true); return }
    updateStatus({ ebookId: ebook.id, status: 'rejected', reason: rejectReason })
    setShowReject(false)
  }

  return (
    <div className="bg-bg border border-surface2 rounded-2xl p-5 flex flex-col gap-3 shadow-card">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-ink">{ebook.title}</p>
          <p className="text-xs text-ash mt-0.5">{ebook.author}{ebook.year ? `, ${ebook.year}` : ''}</p>
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
        {ebook.fileFormat && (
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200">
            {EBOOK_FORMAT_LABELS[ebook.fileFormat]}
          </span>
        )}
        <span className="text-xs text-dim">{formatFileSize(ebook.fileSize)}</span>
        <span className="text-xs text-dim">{ebook.createdAt.toLocaleDateString('ru-RU')}</span>
      </div>

      {/* Reject reason input */}
      {showReject && (
        <textarea
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          placeholder="Причина отклонения (необязательно)..."
          rows={2}
          className="w-full px-3 py-2 text-sm rounded-xl border border-surface2 bg-surface resize-none focus:outline-none focus:border-accent/40"
        />
      )}

      {/* Actions */}
      {ebook.status === 'pending' && (
        <div className="flex items-center gap-2 pt-1 border-t border-surface2 flex-wrap">
          <button
            type="button"
            disabled={isPending}
            onClick={() => { setShowReject(false); handleApprove() }}
            className="h-8 px-4 rounded-lg text-xs font-medium bg-accent text-bg border border-accent hover:bg-accent2 transition-all disabled:opacity-50"
          >
            Одобрить
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={handleReject}
            className="h-8 px-4 rounded-lg text-xs font-medium border border-red-200 text-red-500 hover:bg-red-50 transition-all disabled:opacity-50"
          >
            {showReject ? 'Подтвердить отклонение' : 'Отклонить'}
          </button>
          {showReject && (
            <button
              type="button"
              onClick={() => setShowReject(false)}
              className="h-8 px-3 rounded-lg text-xs text-ash hover:text-ink transition-colors"
            >
              Отмена
            </button>
          )}
        </div>
      )}

      {ebook.status === 'rejected' && ebook.rejectionReason && (
        <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          Причина: {ebook.rejectionReason}
        </p>
      )}
    </div>
  )
}

export const AdminEbooksTab = memo(() => {
  const { data: ebooks = [], isLoading } = useAllEbooks()

  const pending  = ebooks.filter(e => e.status === 'pending')
  const approved = ebooks.filter(e => e.status === 'approved')
  const rejected = ebooks.filter(e => e.status === 'rejected')

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-28 rounded-2xl bg-surface border border-surface2 animate-pulse" />
        ))}
      </div>
    )
  }

  if (ebooks.length === 0) {
    return (
      <EmptyState
        title="Нет электронных книг"
        description="Пользователи ещё не загрузили ни одной электронной книги"
      />
    )
  }

  return (
    <div className="flex flex-col gap-8">
      {pending.length > 0 && (
        <div>
          <h3 className="text-[11px] font-medium tracking-[2px] uppercase text-gold mb-3">
            На рассмотрении · {pending.length}
          </h3>
          <div className="flex flex-col gap-3">
            {pending.map(e => <EbookAdminCard key={e.id} ebook={e} />)}
          </div>
        </div>
      )}
      {approved.length > 0 && (
        <div>
          <h3 className="text-[11px] font-medium tracking-[2px] uppercase text-accent mb-3">
            Одобрены · {approved.length}
          </h3>
          <div className="flex flex-col gap-3">
            {approved.map(e => <EbookAdminCard key={e.id} ebook={e} />)}
          </div>
        </div>
      )}
      {rejected.length > 0 && (
        <div>
          <h3 className="text-[11px] font-medium tracking-[2px] uppercase text-dim mb-3">
            Отклонены · {rejected.length}
          </h3>
          <div className="flex flex-col gap-3">
            {rejected.map(e => <EbookAdminCard key={e.id} ebook={e} />)}
          </div>
        </div>
      )}
    </div>
  )
})

AdminEbooksTab.displayName = 'AdminEbooksTab'
