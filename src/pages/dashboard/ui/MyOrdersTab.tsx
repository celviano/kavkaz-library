'use client'

import { memo } from 'react'
import Image from 'next/image'
import { cn } from '@/shared/lib/cn'
import { EmptyState } from '@/shared/ui/EmptyState'
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_COLORS,
  DELIVERY_LABELS,
} from '@/shared/lib/supabase/queries/orders'
import {
  useMyOrders,
  useUpdateOrderStatus,
} from '@/features/dashboard/model/useDashboard'
interface MyOrdersTabProps {
  userId: string
}

function InfoRow({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] text-dim uppercase tracking-wider">{label}</span>
      <span className="text-sm text-ink">{value}</span>
    </div>
  )
}

export const MyOrdersTab = memo<MyOrdersTabProps>(({ userId }) => {
  const { data: orders = [], isLoading } = useMyOrders(userId)
  const { mutate: changeStatus, isPending } = useUpdateOrderStatus(userId)

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-40 rounded-2xl bg-surface animate-pulse" />
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
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        }
        title="Заказов пока нет"
        description="Когда кто-то оформит заказ — он появится здесь"
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
            <div className="bg-surface border border-surface2 rounded-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-surface2 flex-wrap">
                <div className="flex items-center gap-3">
                  {/* Book cover */}
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
                    <p className="text-sm font-medium text-ink truncate">
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

                <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
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

              {/* Body — order details */}
              <div className="px-5 py-4 grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-3">
                <InfoRow label="Покупатель" value={order.fullName} />
                <InfoRow label="Телефон" value={order.phone} />
                <InfoRow label="Email" value={order.email} />
                <InfoRow
                  label="Доставка"
                  value={order.deliveryType ? DELIVERY_LABELS[order.deliveryType] : null}
                />
                <InfoRow label="Город" value={order.city} />
                <InfoRow label="Индекс" value={order.postalCode} />
                <div className="col-span-2 sm:col-span-3">
                  <InfoRow
                    label="Адрес"
                    value={[
                      order.address,
                      order.apartment ? `кв. ${order.apartment}` : null,
                    ]
                      .filter(Boolean)
                      .join(', ')}
                  />
                </div>
                {order.comment && (
                  <div className="col-span-2 sm:col-span-3">
                    <InfoRow label="Комментарий" value={order.comment} />
                  </div>
                )}
              </div>

              {/* Actions */}
              {(order.status === 'pending' || order.status === 'confirmed') && (
                <div className="px-5 pb-4 flex gap-2">
                  {order.status === 'pending' && (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          changeStatus({ orderId: order.id, status: 'confirmed' })
                        }
                        disabled={isPending}
                        className="h-9 px-5 rounded-xl text-sm font-medium bg-accent text-bg border border-accent hover:bg-accent2 transition-all cursor-pointer disabled:opacity-50"
                      >
                        Подтвердить
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          changeStatus({ orderId: order.id, status: 'cancelled' })
                        }
                        disabled={isPending}
                        className="h-9 px-5 rounded-xl text-sm font-medium border border-surface2 text-ash hover:text-ink hover:bg-surface2 transition-all cursor-pointer disabled:opacity-50"
                      >
                        Отклонить
                      </button>
                    </>
                  )}
                  {order.status === 'confirmed' && (
                    <button
                      type="button"
                      onClick={() =>
                        changeStatus({ orderId: order.id, status: 'completed' })
                      }
                      disabled={isPending}
                      className="h-9 px-5 rounded-xl text-sm font-medium border border-surface2 text-ash hover:text-ink hover:bg-surface2 transition-all cursor-pointer disabled:opacity-50"
                    >
                      Отметить завершённой
                    </button>
                  )}
                </div>
              )}
            </div>
          </li>
        )
      })}
    </ul>
  )
})

MyOrdersTab.displayName = 'MyOrdersTab'
