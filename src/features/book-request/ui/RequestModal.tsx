'use client'

import { memo, useState, useEffect } from 'react'
import { cn } from '@/shared/lib/cn'
import { useCurrentUser } from '@/shared/hooks/useCurrentUser'
import { createOrder } from '@/shared/lib/supabase/queries/orders'

interface RequestModalProps {
  bookId:   string
  bookTitle: string
  sellerId: string
  onClose:  () => void
}

export const RequestModal = memo<RequestModalProps>(({ bookId, bookTitle, sellerId, onClose }) => {
  const { user } = useCurrentUser()
  const [message, setMessage]   = useState('')
  const [contact, setContact]   = useState('')
  const [sending, setSending]   = useState(false)
  const [success, setSuccess]   = useState(false)
  const [error,   setError]     = useState<string | null>(null)

  // Close on Escape
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [onClose])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    if (!contact.trim()) { setError('Укажите контакт для связи'); return }

    setSending(true)
    setError(null)

    try {
      await createOrder({ bookId, sellerId, message, buyerContact: contact.trim() })
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось отправить запрос')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="relative z-10 w-full max-w-md bg-bg rounded-3xl border border-surface2 shadow-accent-lg p-6 flex flex-col gap-5"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-ash hover:text-ink hover:bg-surface2 transition-colors cursor-pointer"
          aria-label="Закрыть"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        {success ? (
          <div className="flex flex-col items-center gap-4 py-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2a5c45" strokeWidth="2" strokeLinecap="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <div>
              <p className="text-ink font-medium mb-1">Запрос отправлен</p>
              <p className="text-ash text-sm">Продавец получит ваше сообщение и свяжется с вами</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-6 rounded-xl text-sm font-medium bg-accent text-bg hover:bg-accent2 transition-all cursor-pointer"
            >
              Закрыть
            </button>
          </div>
        ) : (
          <>
            <div>
              <p className="text-[11px] font-medium tracking-[2px] uppercase text-accent mb-1">Запрос на книгу</p>
              <h2
                id="modal-title"
                className="font-display font-semibold text-ink leading-snug"
                style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem' }}
              >
                {bookTitle}
              </h2>
            </div>

            {!user ? (
              <div className="flex flex-col items-center gap-4 py-4 text-center">
                <p className="text-ash text-sm">Для отправки запроса необходимо войти в аккаунт</p>
                <a
                  href="/auth/login"
                  className="h-10 px-6 rounded-xl text-sm font-medium bg-accent text-bg hover:bg-accent2 transition-all inline-flex items-center"
                >
                  Войти
                </a>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-ink">
                    Контакт для связи <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="Телефон, email или Telegram"
                    required
                    maxLength={200}
                    className={cn(
                      'h-11 w-full rounded-xl border border-surface2 bg-surface px-4 text-sm text-ink',
                      'placeholder:text-dim outline-none',
                      'hover:border-surface3 focus:border-accent/50 focus:ring-2 focus:ring-accent/10 transition-all',
                    )}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-ink">
                    Сообщение продавцу
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Уточните детали: способ оплаты, доставку или другие вопросы..."
                    rows={3}
                    maxLength={1000}
                    className={cn(
                      'w-full rounded-xl border border-surface2 bg-surface px-4 py-3 text-sm text-ink',
                      'placeholder:text-dim outline-none resize-none',
                      'hover:border-surface3 focus:border-accent/50 focus:ring-2 focus:ring-accent/10 transition-all',
                    )}
                  />
                </div>

                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={sending}
                  className="h-11 w-full rounded-xl text-sm font-medium bg-accent text-bg border border-accent hover:bg-accent2 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-wait"
                >
                  {sending ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 rounded-full border-2 border-bg/30 border-t-bg animate-spin" />
                      Отправляем...
                    </span>
                  ) : 'Отправить запрос'}
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  )
})

RequestModal.displayName = 'RequestModal'
