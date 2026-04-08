'use client'

import { memo, useState, useEffect } from 'react'
import { cn } from '@/shared/lib/cn'
import { useCurrentUser } from '@/shared/hooks/useCurrentUser'
import { createOrder } from '@/shared/lib/supabase/queries/orders'
import type { DeliveryType } from '@/shared/lib/supabase/queries/orders'
import type { Book } from '@/entities/book'

interface RequestModalProps {
  book:     Book
  sellerId: string
  onClose:  () => void
}

// ─── SVG логотипы служб доставки ─────────────────────────────────────────────

const SdekLogo = () => (
  <svg width="48" height="20" viewBox="0 0 120 40" fill="none" aria-label="СДЭК">
    <rect width="120" height="40" rx="6" fill="#00B140"/>
    <text x="60" y="27" textAnchor="middle" fill="white" fontSize="18" fontWeight="700" fontFamily="Arial, sans-serif">СДЭК</text>
  </svg>
)

const PochtaLogo = () => (
  <svg width="48" height="20" viewBox="0 0 120 40" fill="none" aria-label="Почта России">
    <rect width="120" height="40" rx="6" fill="#0F5FA6"/>
    <text x="60" y="18" textAnchor="middle" fill="white" fontSize="9" fontWeight="600" fontFamily="Arial, sans-serif">ПОЧТА</text>
    <text x="60" y="32" textAnchor="middle" fill="white" fontSize="9" fontWeight="600" fontFamily="Arial, sans-serif">РОССИИ</text>
  </svg>
)

const DELIVERY_OPTIONS: { type: DeliveryType; label: string; desc: string; Logo: React.FC }[] = [
  { type: 'sdek',   label: 'СДЭК',          desc: 'Доставка 3–7 дней',    Logo: SdekLogo },
  { type: 'pochta', label: 'Почта России',   desc: 'Доставка 7–14 дней',   Logo: PochtaLogo },
]

// ─── Field primitive ──────────────────────────────────────────────────────────

const inputCls = cn(
  'h-11 w-full rounded-xl border border-surface2 bg-surface px-4 text-sm text-ink',
  'placeholder:text-dim outline-none',
  'hover:border-surface3 focus:border-accent/50 focus:ring-2 focus:ring-accent/10',
  'transition-all duration-150',
)

function Field({ label, required, children }: {
  label: string; required?: boolean; children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-ash uppercase tracking-wider">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  )
}

// ─── Modal ────────────────────────────────────────────────────────────────────

export const RequestModal = memo<RequestModalProps>(({ book, sellerId, onClose }) => {
  const { user } = useCurrentUser()

  const [fullName,     setFullName]     = useState('')
  const [phone,        setPhone]        = useState('')
  const [email,        setEmail]        = useState(user?.email ?? '')
  const [city,         setCity]         = useState('')
  const [address,      setAddress]      = useState('')
  const [apartment,    setApartment]    = useState('')
  const [postalCode,   setPostalCode]   = useState('')
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('sdek')
  const [quantity,     setQuantity]     = useState(1)
  const [comment,      setComment]      = useState('')
  const [sending,      setSending]      = useState(false)
  const [success,      setSuccess]      = useState(false)
  const [error,        setError]        = useState<string | null>(null)

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const totalPrice = book.price != null ? book.price * quantity : null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    setSending(true)
    setError(null)
    try {
      await createOrder({
        bookId: book.id, sellerId,
        fullName, phone, email,
        deliveryType, address, city, postalCode, apartment,
        quantity, comment,
      })
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось оформить заказ')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={onClose} aria-hidden="true"/>

      {/* Modal */}
      <div
        className="relative z-10 w-full sm:max-w-xl bg-bg rounded-t-3xl sm:rounded-3xl border border-surface2 shadow-accent-lg flex flex-col max-h-[92vh]"
        role="dialog" aria-modal="true" aria-labelledby="order-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-surface2 flex-shrink-0">
          <div>
            <p className="text-[10px] font-medium tracking-[2px] uppercase text-accent">Оформление заказа</p>
            <h2 id="order-modal-title" className="text-base font-semibold text-ink leading-snug line-clamp-1 mt-0.5">
              {book.title}
            </h2>
          </div>
          <button type="button" onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-ash hover:text-ink hover:bg-surface2 transition-colors cursor-pointer"
            aria-label="Закрыть">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Success */}
        {success ? (
          <div className="flex flex-col items-center gap-5 py-12 px-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2a5c45" strokeWidth="2" strokeLinecap="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <div>
              <p className="text-ink font-semibold text-lg mb-1">Заказ оформлен!</p>
              <p className="text-ash text-sm leading-relaxed max-w-xs">
                Продавец получит уведомление и свяжется с вами в ближайшее время
              </p>
            </div>
            <button type="button" onClick={onClose}
              className="h-11 px-8 rounded-xl text-sm font-medium bg-accent text-bg hover:bg-accent2 transition-all cursor-pointer">
              Закрыть
            </button>
          </div>
        ) : !user ? (
          <div className="flex flex-col items-center gap-4 py-12 px-6 text-center">
            <p className="text-ash text-sm">Для оформления заказа войдите в аккаунт</p>
            <a href="/auth/login" className="h-11 px-8 rounded-xl text-sm font-medium bg-accent text-bg hover:bg-accent2 transition-all inline-flex items-center">
              Войти
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col overflow-hidden">
            {/* Scrollable body */}
            <div className="overflow-y-auto px-6 py-5 flex flex-col gap-6">

              {/* Личные данные */}
              <section>
                <p className="text-[11px] font-medium tracking-[2px] uppercase text-accent mb-4">Личные данные</p>
                <div className="flex flex-col gap-3">
                  <Field label="ФИО" required>
                    <input type="text" value={fullName} onChange={e => setFullName(e.target.value)}
                      placeholder="Иванов Иван Иванович" required maxLength={200} className={inputCls} />
                  </Field>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Телефон" required>
                      <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                        placeholder="+7 999 000-00-00" required maxLength={20} className={inputCls} />
                    </Field>
                    <Field label="Email" required>
                      <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                        placeholder="you@mail.ru" required maxLength={200} className={inputCls} />
                    </Field>
                  </div>
                </div>
              </section>

              {/* Способ доставки */}
              <section>
                <p className="text-[11px] font-medium tracking-[2px] uppercase text-accent mb-4">Способ доставки</p>
                <div className="grid grid-cols-2 gap-3">
                  {DELIVERY_OPTIONS.map(({ type, label, desc, Logo }) => {
                    const active = deliveryType === type
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setDeliveryType(type)}
                        className={cn(
                          'flex flex-col gap-3 p-4 rounded-2xl border text-left transition-all cursor-pointer',
                          'focus-visible:outline-2 focus-visible:outline-accent',
                          active
                            ? 'border-accent bg-accent/6 shadow-accent-sm'
                            : 'border-surface2 bg-surface hover:border-surface3',
                        )}
                        aria-pressed={active}
                      >
                        <div className="flex items-center justify-between">
                          <Logo />
                          <span className={cn(
                            'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors',
                            active ? 'border-accent bg-accent' : 'border-surface3 bg-bg',
                          )}>
                            {active && (
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
                                <polyline points="20 6 9 17 4 12"/>
                              </svg>
                            )}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-ink">{label}</p>
                          <p className="text-xs text-ash mt-0.5">{desc}</p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </section>

              {/* Адрес */}
              <section>
                <p className="text-[11px] font-medium tracking-[2px] uppercase text-accent mb-4">Адрес доставки</p>
                <div className="flex flex-col gap-3">
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Город" required>
                      <input type="text" value={city} onChange={e => setCity(e.target.value)}
                        placeholder="Москва" required maxLength={100} className={inputCls} />
                    </Field>
                    <Field label="Индекс" required>
                      <input type="text" value={postalCode} onChange={e => setPostalCode(e.target.value)}
                        placeholder="123456" required maxLength={10} className={inputCls} />
                    </Field>
                  </div>
                  <Field label="Улица, дом" required>
                    <input type="text" value={address} onChange={e => setAddress(e.target.value)}
                      placeholder="ул. Арбат, д. 1" required maxLength={300} className={inputCls} />
                  </Field>
                  <Field label="Квартира / офис">
                    <input type="text" value={apartment} onChange={e => setApartment(e.target.value)}
                      placeholder="кв. 10" maxLength={20} className={inputCls} />
                  </Field>
                </div>
              </section>

              {/* Количество + комментарий */}
              <section>
                <div className="flex flex-col gap-3">
                  <Field label="Количество экземпляров" required>
                    <div className="flex items-center gap-3">
                      <button type="button" onClick={() => setQuantity(q => Math.max(1, q - 1))}
                        className="w-11 h-11 rounded-xl border border-surface2 flex items-center justify-center text-ash hover:text-ink hover:bg-surface2 transition-colors cursor-pointer text-lg font-medium flex-shrink-0">
                        −
                      </button>
                      <span className="flex-1 h-11 flex items-center justify-center text-sm font-medium text-ink bg-surface rounded-xl border border-surface2">
                        {quantity}
                      </span>
                      <button type="button"
                        onClick={() => setQuantity(q => Math.min(book.copiesLeft || 99, q + 1))}
                        className="w-11 h-11 rounded-xl border border-surface2 flex items-center justify-center text-ash hover:text-ink hover:bg-surface2 transition-colors cursor-pointer text-lg font-medium flex-shrink-0">
                        +
                      </button>
                    </div>
                  </Field>
                  <Field label="Комментарий к заказу">
                    <textarea value={comment} onChange={e => setComment(e.target.value)}
                      placeholder="Уточните детали или задайте вопрос продавцу..."
                      rows={2} maxLength={500}
                      className={cn(inputCls, 'h-auto py-3 resize-none')} />
                  </Field>
                </div>
              </section>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}
            </div>

            {/* Footer — итог + кнопка */}
            <div className="px-6 py-4 border-t border-surface2 flex-shrink-0 bg-bg rounded-b-3xl">
              {totalPrice != null && (
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-ash">Итого за {quantity} экз.</span>
                  <span className="font-display font-semibold text-ink text-lg" style={{ fontFamily: 'var(--font-display)' }}>
                    {new Intl.NumberFormat('ru-RU', { style: 'currency', currency: book.currency, maximumFractionDigits: 0 }).format(totalPrice)}
                  </span>
                </div>
              )}
              <button type="submit" disabled={sending}
                className="w-full h-12 rounded-xl text-sm font-medium bg-accent text-bg border border-accent hover:bg-accent2 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-wait shadow-accent-sm hover:shadow-accent">
                {sending ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 rounded-full border-2 border-bg/30 border-t-bg animate-spin"/>
                    Оформляем...
                  </span>
                ) : totalPrice != null
                  ? `Оформить заказ · ${new Intl.NumberFormat('ru-RU', { style: 'currency', currency: book.currency, maximumFractionDigits: 0 }).format(totalPrice)}`
                  : 'Оформить заказ'
                }
              </button>
              <p className="text-[11px] text-dim text-center mt-2">
                Нажимая кнопку, вы соглашаетесь с условиями оферты
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  )
})

RequestModal.displayName = 'RequestModal'
