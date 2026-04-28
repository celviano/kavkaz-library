'use client'

import { memo } from 'react'
import { EBOOK_FORMAT_LABELS, formatFileSize } from '@/entities/ebook/model/types'
import { useDownloadEbook } from '@/features/ebooks/model/useEbooks'
import type { Book } from '@/entities/book'
import type { EbookFormat } from '@/entities/ebook/model/types'

interface EbookDownloadBlockProps {
  book: Book
}

export const EbookDownloadBlock = memo<EbookDownloadBlockProps>(({ book }) => {
  const { mutate: download, isPending } = useDownloadEbook()

  const format = book.ebookFormat as EbookFormat | null
  const size   = book.ebookSize

  function handleDownload() {
    if (!book.ebookFileUrl) return
    download({
      ebookId:  book.id,
      fileUrl:  book.ebookFileUrl,
      fileName: `${book.title}${format ? '.' + format : ''}`,
    })
  }

  return (
    <div className="flex flex-col gap-4 bg-surface rounded-2xl border border-surface2 px-5 py-5">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] text-dim uppercase tracking-wider">Формат</span>
          <span className="text-base font-semibold text-ink">
            {format ? EBOOK_FORMAT_LABELS[format] : 'Электронная книга'}
          </span>
        </div>
        {size != null && (
          <div className="flex flex-col items-end gap-0.5">
            <span className="text-[10px] text-dim uppercase tracking-wider">Размер</span>
            <span className="text-sm font-medium text-ash">{formatFileSize(size)}</span>
          </div>
        )}
      </div>

      <div className="h-px bg-surface2" />

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-xs text-dim">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Бесплатно
        </div>

        <button
          type="button"
          onClick={handleDownload}
          disabled={isPending || !book.ebookFileUrl}
          className="inline-flex items-center gap-2 h-11 px-6 rounded-xl text-sm font-medium bg-accent text-bg border border-accent hover:bg-accent2 shadow-accent-sm hover:shadow-accent transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <>
              <span className="w-4 h-4 rounded-full border-2 border-bg/30 border-t-bg animate-spin" />
              Загрузка...
            </>
          ) : (
            <>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Скачать {format ? EBOOK_FORMAT_LABELS[format] : ''}
            </>
          )}
        </button>
      </div>

      <p className="text-[11px] text-dim">
        Убедитесь, что произведение находится в общественном достоянии в вашей стране
      </p>
    </div>
  )
})

EbookDownloadBlock.displayName = 'EbookDownloadBlock'
