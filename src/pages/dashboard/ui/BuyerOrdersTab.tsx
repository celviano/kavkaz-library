'use client'

import { memo } from 'react'
import Image from 'next/image'

import {
  useCancelMyOrder,
  useSentOrders,
} from '@/features/dashboard/model/useDashboard'
import { cn } from '@/shared/lib/cn'
import {
  DELIVERY_LABELS,
  ORDER_STATUS_COLORS,
  ORDER_STATUS_LABELS,
} from '@/shared/lib/supabase/queries/orders'
import { EmptyState } from '@/shared/ui/EmptyState'

interface BuyerOrdersTabProps {
  userId: string
}

export const BuyerOrdersTab = memo<BuyerOrdersTabProps>(({ userId }) => {
  const { data: orders = [], isLoading } = useSentOrders(userId)
  const { mutate: cancelOrder, isPending } = useCancelMyOrder(userId)

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-28 rounded-2xl bg-surface animate-pulse" />
        ))}
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <EmptyState
        icon={
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#7D7060"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
        }
        title="Заказов пока нет"
        description="Оформите заказ на понравившуюся книгу — он появится здесь"
        actionLabel="Перейти в каталог"
        actionHref="/catalog"
      />
    )
  }

  return (
    <ul className="flex flex-col gap-4">
      {orders.map((order) => {
        const totalPrice =
          order.bookPrice != null ? order.bookPrice * order.quantity : null

        return (
          <li key={order.id}>
            <div className="bg-surface border border-surface2 rounded-2xl overflow-hidden min-w-0">
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between md:gap-4 px-5 py-4 border-b border-surface2 gap-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-10 h-14 rounded-lg bg-surface2 overflow-hidden flex-shrink-0 relative">
                    {order.bookCoverUrl ? (
                      <Image
                        src={order.bookCoverUrl}
                        alt={order.bookTitle ?? ''}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#9e9080"
                          strokeWidth="1.5"
                        >
                          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink wrap-break-word">
                      {order.bookTitle ?? 'Книга удалена'}
                    </p>
                    <p className="text-xs text-ash">
                      {order.quantity} экз.
                      {totalPrice != null && (
                        <>
                          {' '}
                          ·{' '}
                          <span className="text-accent font-medium">
                            {new Intl.NumberFormat('ru-RU', {
                              style: 'currency',
                              currency: order.bookCurrency,
                              maximumFractionDigits: 0,
                            }).format(totalPrice)}
                          </span>
                        </>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap w-full md:w-auto md:ml-auto md:flex-shrink-0">
                  <span
                    className={cn(
                      'inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium border',
                      ORDER_STATUS_COLORS[order.status],
                    )}
                  >
                    {ORDER_STATUS_LABELS[order.status]}
                  </span>
                  <span className="text-[11px] text-dim">
                    {order.createdAt.toLocaleDateString('ru-RU', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="px-5 py-4 grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-3 text-sm">
                {order.deliveryType && (
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-dim uppercase tracking-wider">
                      Доставка
                    </span>
                    <span className="text-ink">{DELIVERY_LABELS[order.deliveryType]}</span>
                  </div>
                )}
                {order.city && (
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-dim uppercase tracking-wider">Город</span>
                    <span className="text-ink">{order.city}</span>
                  </div>
                )}
                {order.address && (
                  <div className="flex flex-col gap-0.5 md:col-span-2">
                    <span className="text-[10px] text-dim uppercase tracking-wider">Адрес</span>
                    <span className="text-ink">
                      {[order.address, order.apartment ? `кв. ${order.apartment}` : null]
                        .filter(Boolean)
                        .join(', ')}
                    </span>
                  </div>
                )}
                {order.comment && (
                  <div className="flex flex-col gap-0.5 col-span-2 md:col-span-4">
                    <span className="text-[10px] text-dim uppercase tracking-wider">
                      Комментарий
                    </span>
                    <span className="text-ink">{order.comment}</span>
                  </div>
                )}
              </div>

              {/* Cancel action */}
              {order.status === 'pending' && (
                <div className="px-5 pb-4">
                  <button
                    type="button"
                    onClick={() => cancelOrder(order.id)}
                    disabled={isPending}
                    className="h-9 px-5 rounded-xl text-sm font-medium border border-surface2 text-ash hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all cursor-pointer disabled:opacity-50"
                  >
                    Отменить заказ
                  </button>
                </div>
              )}
            </div>
          </li>
        )
      })}
    </ul>
  )
})

BuyerOrdersTab.displayName = 'BuyerOrdersTab'
