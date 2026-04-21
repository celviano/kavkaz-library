'use client'

import { memo, useState, useEffect } from 'react'
import { FormField } from '@/shared/ui/FormField'
import { Input } from '@/shared/ui/Input'
import { Textarea } from '@/shared/ui/Textarea'
import { ErrorBanner } from '@/shared/ui/ErrorBanner'
import { useSubmitQuote } from '@/features/quotes/model/useQuotes'

interface AddQuoteModalProps {
  userId: string
  onClose: () => void
}

export const AddQuoteModal = memo<AddQuoteModalProps>(({ userId, onClose }) => {
  const [text, setText] = useState('')
  const [author, setAuthor] = useState('')
  const [source, setSource] = useState('')

  const { mutate, isPending, isSuccess, error } = useSubmitQuote(userId)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [onClose])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim() || !author.trim() || !source.trim()) return
    mutate({ text: text.trim(), author: author.trim(), source: source.trim() })
  }

  return (
    <div className="fixed inset-0 z-[100]  flex items-end sm:items-center justify-center">
      <div
        className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full sm:max-w-lg bg-bg rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-surface2 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-base font-semibold text-ink">Предложить цитату</h2>
            <p className="text-xs text-ash mt-0.5">
              После проверки цитата появится на главной странице
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-ash hover:text-ink hover:bg-surface2 transition-all"
            aria-label="Закрыть"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {isSuccess ? (
          <div className="flex flex-col items-center gap-5 px-6 py-12 text-center">
            {/* Success icon */}
            <div className="w-16 h-16 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#2a5c45"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div>
              <p className="text-base font-semibold text-ink mb-1">Цитата отправлена!</p>
              <p className="text-sm text-ash leading-relaxed max-w-xs">
                Мы рассмотрим её в ближайшее время. Статус можно отследить в личном
                кабинете.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-6 rounded-xl text-sm font-medium bg-accent text-bg border border-accent hover:bg-accent2 transition-all"
            >
              Отлично
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col overflow-y-auto">
            <div className="px-6 py-5 flex flex-col gap-4">
              <FormField label="Текст цитаты" required>
                <Textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Кавказ — это целый мир, сжатый между двух морей."
                  rows={4}
                  maxLength={600}
                  required
                />
                <p className="text-[11px] text-dim mt-1 text-right">{text.length}/600</p>
              </FormField>

              <FormField label="Автор" required>
                <Input
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Александр Дюма"
                  maxLength={150}
                  required
                />
              </FormField>

              <FormField label="Источник" required>
                <Input
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  placeholder="«Кавказ», 1859"
                  maxLength={200}
                  required
                />
              </FormField>

              <ErrorBanner message={error instanceof Error ? error.message : null} />
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-surface2 flex-shrink-0 bg-bg rounded-b-3xl">
              <button
                type="submit"
                disabled={isPending || !text.trim() || !author.trim() || !source.trim()}
                className="w-full h-12 rounded-xl text-sm font-medium bg-accent text-bg border border-accent hover:bg-accent2 transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-accent-sm hover:shadow-accent"
              >
                {isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 rounded-full border-2 border-bg/30 border-t-bg animate-spin" />
                    Отправляем...
                  </span>
                ) : (
                  'Предложить цитату'
                )}
              </button>
              <p className="text-[11px] text-dim text-center mt-2">
                Цитата будет проверена модератором перед публикацией
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  )
})

AddQuoteModal.displayName = 'AddQuoteModal'
