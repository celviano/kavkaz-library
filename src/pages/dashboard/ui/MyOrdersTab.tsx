'use client'

import { memo } from 'react'
import { cn } from '@/shared/lib/cn'
import { EmptyState } from '@/shared/ui/EmptyState'
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/shared/lib/supabase/queries/orders'
import { useMyOrders, useUpdateOrderStatus } from '@/features/dashboard/model/useDashboard'

interface MyOrdersTabProps {
  userId: string
}

export const MyOrdersTab = memo<MyOrdersTabProps>(({ userId }) => {
  const { data: orders = [], isLoading } = useMyOrders(userId)
  const { mutate: changeStatus, isPending } = useUpdateOrderStatus(userId)

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
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7D7060" strokeWidth="1.5" strokeLinecap="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        }
        title="Запросов пока нет"
        description="Когда кто-то заинтересуется вашими книгами — запросы появятся здесь"
      />
    )
  }

  return (
    <ul className="flex flex-col gap-3">
      {orders.map((order) => (
        <li key={order.id}>
          <div className="bg-surface border border-surface2 rounded-2xl p-5 flex flex-col gap-4">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex flex-col gap-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={cn(
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium border',
                    ORDER_STATUS_COLORS[order.status],
                  )}>
                    {ORDER_STATUS_LABELS[order.status]}
                  </span>
                  <span className="text-[11px] text-dim">
                    {order.createdAt.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>
                <p className="text-sm font-medium text-ink">{order.bookTitle ?? 'Книга удалена'}</p>
                {order.buyerName && (
                  <p className="text-xs text-ash">Покупатель: {order.buyerName}</p>
                )}
              </div>
            </div>

            {order.message && (
              <div className="bg-bg border border-surface2 rounded-xl px-4 py-3">
                <p className="text-[10px] text-dim uppercase tracking-wider mb-1">Сообщение</p>
                <p className="text-sm text-text leading-relaxed">{order.message}</p>
              </div>
            )}

            {order.buyerContact && (
              <div className="flex items-center gap-2 text-xs text-ash">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.17h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.91A16 16 0 0 0 13 15.91l.27-.45a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 20 17.72v-.8"/>
                </svg>
                <span>Контакт: <strong className="text-ink">{order.buyerContact}</strong></span>
              </div>
            )}

            {order.status === 'pending' && (
              <div className="flex gap-2 pt-1 border-t border-surface2">
                <button
                  type="button"
                  onClick={() => changeStatus({ orderId: order.id, status: 'confirmed' })}
                  disabled={isPending}
                  className="h-9 px-5 rounded-xl text-sm font-medium bg-accent text-bg border border-accent hover:bg-accent2 transition-all cursor-pointer disabled:opacity-50"
                >
                  Подтвердить
                </button>
                <button
                  type="button"
                  onClick={() => changeStatus({ orderId: order.id, status: 'cancelled' })}
                  disabled={isPending}
                  className="h-9 px-5 rounded-xl text-sm font-medium border border-surface2 text-ash hover:text-ink hover:bg-surface2 transition-all cursor-pointer disabled:opacity-50"
                >
                  Отклонить
                </button>
              </div>
            )}

            {order.status === 'confirmed' && (
              <div className="pt-1 border-t border-surface2">
                <button
                  type="button"
                  onClick={() => changeStatus({ orderId: order.id, status: 'completed' })}
                  disabled={isPending}
                  className="h-9 px-5 rounded-xl text-sm font-medium border border-surface2 text-ash hover:text-ink hover:bg-surface2 transition-all cursor-pointer disabled:opacity-50"
                >
                  Отметить как завершённую
                </button>
              </div>
            )}
          </div>
        </li>
      ))}
    </ul>
  )
})

MyOrdersTab.displayName = 'MyOrdersTab'
