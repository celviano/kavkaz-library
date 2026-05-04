'use client'

import { memo, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { FormField } from '@/shared/ui/FormField'
import { Input } from '@/shared/ui/Input'
import { Textarea } from '@/shared/ui/Textarea'
import { ErrorBanner } from '@/shared/ui/ErrorBanner'
import { QuantityInput } from '@/shared/ui/QuantityInput'
import { DeliveryPicker } from './DeliveryPicker'
import { useCurrentUser } from '@/shared/hooks/useCurrentUser'
import { createOrder } from '@/shared/lib/supabase/queries/orders'
import { requestOrderSchema } from '@/shared/lib/zod/schemas'
import type { RequestOrderValues } from '@/shared/lib/zod/schemas'
import type { Book } from '@/entities/book'

interface RequestModalProps {
  book:     Book
  sellerId: string
  onClose:  () => void
}

export const RequestModal = memo<RequestModalProps>(({ book, sellerId, onClose }) => {
  const { user } = useCurrentUser()

  const { register, control, handleSubmit, watch, formState: { errors } } = useForm<RequestOrderValues>({
    resolver: zodResolver(requestOrderSchema),
    defaultValues: {
      email:        user?.email ?? '',
      deliveryType: 'sdek',
      quantity:     1,
    },
  })

  const quantity = watch('quantity') ?? 1
  const totalPrice = book.price != null ? book.price * quantity : null

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const { mutate: sendOrder, isPending, isSuccess, error } = useMutation({
    mutationFn: (data: RequestOrderValues) => createOrder({
      bookId: book.id, sellerId,
      fullName: data.fullName, phone: data.phone, email: data.email,
      deliveryType: data.deliveryType, address: data.address,
      city: data.city, postalCode: data.postalCode,
      apartment: data.apartment ?? '', quantity: data.quantity,
      comment: data.comment ?? '',
    }),
  })

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={onClose} aria-hidden="true"/>

      <div className="relative z-10 w-full sm:max-w-xl bg-bg rounded-t-3xl sm:rounded-3xl border border-surface2 shadow-accent-lg flex flex-col max-h-[92vh]"
        role="dialog" aria-modal="true" aria-labelledby="order-modal-title">

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
          <form onSubmit={handleSubmit((data) => sendOrder(data))} className="flex flex-col overflow-hidden">
            <div className="overflow-y-auto px-6 py-5 flex flex-col gap-6">

              <section>
                <p className="text-[11px] font-medium tracking-[2px] uppercase text-accent mb-4">Личные данные</p>
                <div className="flex flex-col gap-3">
                  <FormField label="ФИО" required error={errors.fullName?.message}>
                    <Input placeholder="Иванов Иван Иванович" maxLength={200} error={errors.fullName?.message} {...register('fullName')} />
                  </FormField>
                  <div className="grid grid-cols-2 gap-3">
                    <FormField label="Телефон" required error={errors.phone?.message}>
                      <Input type="tel" placeholder="+7 999 000-00-00" maxLength={20} error={errors.phone?.message} {...register('phone')} />
                    </FormField>
                    <FormField label="Email" required error={errors.email?.message}>
                      <Input type="email" placeholder="you@mail.ru" maxLength={200} error={errors.email?.message} {...register('email')} />
                    </FormField>
                  </div>
                </div>
              </section>

              <section>
                <p className="text-[11px] font-medium tracking-[2px] uppercase text-accent mb-4">Способ доставки</p>
                <Controller
                  control={control}
                  name="deliveryType"
                  render={({ field }) => <DeliveryPicker value={field.value} onChange={field.onChange} />}
                />
              </section>

              <section>
                <p className="text-[11px] font-medium tracking-[2px] uppercase text-accent mb-4">Адрес доставки</p>
                <div className="flex flex-col gap-3">
                  <div className="grid grid-cols-2 gap-3">
                    <FormField label="Город" required error={errors.city?.message}>
                      <Input placeholder="Москва" maxLength={100} error={errors.city?.message} {...register('city')} />
                    </FormField>
                    <FormField label="Индекс" required error={errors.postalCode?.message}>
                      <Input placeholder="123456" maxLength={10} error={errors.postalCode?.message} {...register('postalCode')} />
                    </FormField>
                  </div>
                  <FormField label="Улица, дом" required error={errors.address?.message}>
                    <Input placeholder="ул. Арбат, д. 1" maxLength={300} error={errors.address?.message} {...register('address')} />
                  </FormField>
                  <FormField label="Квартира / офис">
                    <Input placeholder="кв. 10" maxLength={20} {...register('apartment')} />
                  </FormField>
                </div>
              </section>

              <section>
                <div className="flex flex-col gap-3">
                  <FormField label="Количество экземпляров" required>
                    <Controller
                      control={control}
                      name="quantity"
                      render={({ field }) => (
                        <QuantityInput value={field.value} min={1} max={book.copiesLeft || 99} onChange={field.onChange} />
                      )}
                    />
                  </FormField>
                  <FormField label="Комментарий">
                    <Textarea placeholder="Уточните детали или задайте вопрос..." rows={2} maxLength={500} {...register('comment')} />
                  </FormField>
                </div>
              </section>

              <ErrorBanner message={error instanceof Error ? error.message : null} />
            </div>

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
