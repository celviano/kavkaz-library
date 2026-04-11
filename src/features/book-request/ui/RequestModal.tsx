'use client'

import { memo, useState, useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import { FormField } from '@/shared/ui/FormField'
import { Input } from '@/shared/ui/Input'
import { Textarea } from '@/shared/ui/Textarea'
import { ErrorBanner } from '@/shared/ui/ErrorBanner'
import { QuantityInput } from '@/shared/ui/QuantityInput'
import { DeliveryPicker } from './DeliveryPicker'
import { useCurrentUser } from '@/shared/hooks/useCurrentUser'
import { createOrder } from '@/shared/lib/supabase/queries/orders'
import type { DeliveryType } from '@/shared/lib/supabase/queries/orders'
import type { Book } from '@/entities/book'

interface RequestModalProps {
  book:     Book
  sellerId: string
  onClose:  () => void
}

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

  const { mutate: sendOrder, isPending, isSuccess, error } = useMutation({
    mutationFn: () => createOrder({
      bookId: book.id, sellerId,
      fullName, phone, email,
      deliveryType, address, city, postalCode, apartment,
      quantity, comment,
    }),
  })

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

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={onClose} aria-hidden="true"/>

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
          <button type="button" onClick={onClose} aria-label="Закрыть"
            className="w-8 h-8 rounded-full flex items-center justify-center text-ash hover:text-ink hover:bg-surface2 transition-colors cursor-pointer">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Success */}
        {isSuccess ? (
          <div className="flex flex-col items-center gap-5 py-12 px-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2a5c45" strokeWidth="2" strokeLinecap="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <div>
              <p className="text-ink font-semibold text-lg mb-1">Заказ оформлен!</p>
              <p className="text-ash text-sm leading-relaxed max-w-xs">Продавец получит уведомление и свяжется с вами</p>
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
          <form onSubmit={(e) => { e.preventDefault(); sendOrder() }} className="flex flex-col overflow-hidden">
            <div className="overflow-y-auto px-6 py-5 flex flex-col gap-6">

              <section>
                <p className="text-[11px] font-medium tracking-[2px] uppercase text-accent mb-4">Личные данные</p>
                <div className="flex flex-col gap-3">
                  <FormField label="ФИО" required>
                    <Input value={fullName} onChange={e => setFullName(e.target.value)}
                      placeholder="Иванов Иван Иванович" required maxLength={200} />
                  </FormField>
                  <div className="grid grid-cols-2 gap-3">
                    <FormField label="Телефон" required>
                      <Input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                        placeholder="+7 999 000-00-00" required maxLength={20} />
                    </FormField>
                    <FormField label="Email" required>
                      <Input type="email" value={email} onChange={e => setEmail(e.target.value)}
                        placeholder="you@mail.ru" required maxLength={200} />
                    </FormField>
                  </div>
                </div>
              </section>

              <section>
                <p className="text-[11px] font-medium tracking-[2px] uppercase text-accent mb-4">Способ доставки</p>
                <DeliveryPicker value={deliveryType} onChange={setDeliveryType} />
              </section>

              <section>
                <p className="text-[11px] font-medium tracking-[2px] uppercase text-accent mb-4">Адрес доставки</p>
                <div className="flex flex-col gap-3">
                  <div className="grid grid-cols-2 gap-3">
                    <FormField label="Город" required>
                      <Input value={city} onChange={e => setCity(e.target.value)}
                        placeholder="Москва" required maxLength={100} />
                    </FormField>
                    <FormField label="Индекс" required>
                      <Input value={postalCode} onChange={e => setPostalCode(e.target.value)}
                        placeholder="123456" required maxLength={10} />
                    </FormField>
                  </div>
                  <FormField label="Улица, дом" required>
                    <Input value={address} onChange={e => setAddress(e.target.value)}
                      placeholder="ул. Арбат, д. 1" required maxLength={300} />
                  </FormField>
                  <FormField label="Квартира / офис">
                    <Input value={apartment} onChange={e => setApartment(e.target.value)}
                      placeholder="кв. 10" maxLength={20} />
                  </FormField>
                </div>
              </section>

              <section>
                <div className="flex flex-col gap-3">
                  <FormField label="Количество экземпляров" required>
                    <QuantityInput value={quantity} min={1} max={book.copiesLeft || 99} onChange={setQuantity} />
                  </FormField>
                  <FormField label="Комментарий">
                    <Textarea value={comment} onChange={e => setComment(e.target.value)}
                      placeholder="Уточните детали или задайте вопрос..." rows={2} maxLength={500} />
                  </FormField>
                </div>
              </section>

              <ErrorBanner message={error instanceof Error ? error.message : null} />
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-surface2 flex-shrink-0 bg-bg rounded-b-3xl">
              {totalPrice != null && (
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-ash">Итого за {quantity} экз.</span>
                  <span className="font-display font-semibold text-ink text-lg" style={{ fontFamily: 'var(--font-display)' }}>
                    {new Intl.NumberFormat('ru-RU', { style: 'currency', currency: book.currency, maximumFractionDigits: 0 }).format(totalPrice)}
                  </span>
                </div>
              )}
              <button type="submit" disabled={isPending}
                className="w-full h-12 rounded-xl text-sm font-medium bg-accent text-bg border border-accent hover:bg-accent2 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-wait shadow-accent-sm hover:shadow-accent">
                {isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 rounded-full border-2 border-bg/30 border-t-bg animate-spin"/>
                    Оформляем...
                  </span>
                ) : totalPrice != null
                  ? `Оформить заказ · ${new Intl.NumberFormat('ru-RU', { style: 'currency', currency: book.currency, maximumFractionDigits: 0 }).format(totalPrice)}`
                  : 'Оформить заказ'
                }
              </button>
              <p className="text-[11px] text-dim text-center mt-2">Нажимая кнопку, вы соглашаетесь с условиями оферты</p>
            </div>
          </form>
        )}
      </div>
    </div>
  )
})

RequestModal.displayName = 'RequestModal'
