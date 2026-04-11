'use client'

import { type FC } from 'react'
import Link from 'next/link'
import { cn } from '@/shared/lib/cn'
import { EmptyState } from '@/shared/ui/EmptyState'
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/shared/lib/supabase/queries/orders'
import type { Order } from '@/shared/lib/supabase/queries/orders'

interface OrdersPreviewProps {
  orders:  Order[]
  title:   string
  href:    string
  empty:   string
}

export const OrdersPreview: FC<OrdersPreviewProps> = ({ orders, title, href, empty }) => (
  <section aria-labelledby="orders-heading">
    <div className="flex items-end justify-between mb-4">
      <div>
        <p className="text-[11px] font-medium tracking-[2px] uppercase text-accent mb-1">История</p>
        <h2
          id="orders-heading"
          className="font-display font-semibold text-ink"
          style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.2rem, 2vw, 1.5rem)' }}
        >
          {title}
        </h2>
      </div>
      {orders.length > 0 && (
        <Link href={href} className="text-sm text-ash hover:text-ink transition-colors inline-flex items-center gap-1 group">
          Все
          <span className="group-hover:translate-x-0.5 transition-transform" aria-hidden="true">→</span>
        </Link>
      )}
    </div>

    {orders.length === 0 ? (
      <EmptyState
        title="Заказов пока нет"
        description={empty}
        actionLabel="Перейти в каталог"
        actionHref="/catalog"
      />
    ) : (
      <ul className="flex flex-col gap-2">
        {orders.slice(0, 3).map((order) => (
          <li key={order.id}>
            <div className="flex items-center gap-4 bg-surface border border-surface2 rounded-2xl px-4 py-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-ink truncate">{order.bookTitle ?? 'Книга'}</p>
                <div className="flex items-center gap-3 mt-0.5">
                  {order.bookPrice != null && (
                    <span className="text-xs text-ash">
                      {new Intl.NumberFormat('ru-RU', { style: 'currency', currency: order.bookCurrency, maximumFractionDigits: 0 }).format(order.bookPrice * order.quantity)}
                    </span>
                  )}
                  {order.deliveryType && (
                    <span className="text-xs text-dim">{order.deliveryType === 'sdek' ? 'СДЭК' : 'Почта России'}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={cn(
                  'inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-medium border',
                  ORDER_STATUS_COLORS[order.status],
                )}>
                  {ORDER_STATUS_LABELS[order.status]}
                </span>
                <span className="text-[10px] text-dim hidden sm:block">
                  {order.createdAt.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    )}
  </section>
)
