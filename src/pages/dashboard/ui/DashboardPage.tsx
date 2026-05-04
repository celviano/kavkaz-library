'use client'

import { memo, useState } from 'react'
import Link from 'next/link'
import { cn } from '@/shared/lib/cn'
import { Container } from '@/shared/ui/Container'
import { PageHeading } from '@/shared/ui/PageHeading'
import { EmptyState } from '@/shared/ui/EmptyState'
import { useCurrentUser } from '@/shared/hooks/useCurrentUser'
import { useProfile, isAdmin } from '@/entities/profile'
import { useMyBooks, useMyOrders } from '@/features/dashboard/model/useDashboard'
import { useMyQuotes, useAllQuotes } from '@/features/quotes/model/useQuotes'
import { useMyEbooks, useAllEbooks } from '@/features/ebooks/model/useEbooks'
import { MyBooksTab } from './MyBooksTab'
import { MyOrdersTab } from './MyOrdersTab'
import { MyQuotesTab } from './MyQuotesTab'
import { AdminQuotesTab } from './AdminQuotesTab'
import { MyEbooksTab } from './MyEbooksTab'
import { AdminEbooksTab } from './AdminEbooksTab'

type Tab = 'books' | 'orders' | 'quotes' | 'admin-quotes' | 'ebooks' | 'admin-ebooks'

export const DashboardPage = memo(() => {
  const { user, loading: userLoading } = useCurrentUser()
  const { data: profile } = useProfile(user?.id ?? null)
  const [activeTab, setActiveTab] = useState<Tab>('books')

  const { data: books = [] } = useMyBooks(user?.id ?? null)
  const { data: orders = [] } = useMyOrders(user?.id ?? null)
  const { data: myQuotes = [] } = useMyQuotes(user?.id ?? null)
  const { data: allQuotes = [] } = useAllQuotes()
  const { data: myEbooks = [] } = useMyEbooks(user?.id ?? null)
  const { data: allEbooks = [] } = useAllEbooks()

  const admin = isAdmin(profile ?? null)

  const pendingOrders = orders.filter((o) => o.status === 'pending').length
  const pendingBooks = books.filter((b) => b.status === 'pending').length
  const pendingQuotes = admin
    ? allQuotes.filter((q) => q.status === 'pending').length
    : myQuotes.filter((q) => q.status === 'pending').length
  const pendingEbooks = admin
    ? allEbooks.filter((e) => e.status === 'pending').length
    : myEbooks.filter((e) => e.status === 'pending').length

  if (!userLoading && !user) {
    return (
      <main id="main-content" className="flex-1 flex items-center justify-center py-24">
        <Container>
          <EmptyState
            title="Войдите в аккаунт"
            description="Для доступа к кабинету необходима авторизация"
            actionLabel="Войти"
            actionHref="/auth/login"
          />
        </Container>
      </main>
    )
  }

  const tabs: { id: Tab; label: string; shortLabel?: string; count?: number }[] = [
    { id: 'books', label: 'Мои книги', count: books.length },
    { id: 'orders', label: 'Запросы', count: orders.length },
    {
      id: admin ? 'admin-ebooks' : 'ebooks',
      label: admin ? 'Эл. книги (модерация)' : 'Эл. книги',
      shortLabel: 'Эл. книги',
      count: pendingEbooks || undefined,
    },
    {
      id: admin ? 'admin-quotes' : 'quotes',
      label: admin ? 'Цитаты (модерация)' : 'Мои цитаты',
      shortLabel: 'Цитаты',
      count: pendingQuotes || undefined,
    },
  ]

  return (
    <main id="main-content">
      <section className="py-12">
        <Container>
          <div className="max-w-7xl mx-auto flex flex-col gap-8">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <PageHeading eyebrow="Личный кабинет" title="Мои книги и запросы" />
              <Link
                href="/add-book"
                className="inline-flex items-center gap-1.5 h-10 px-5 rounded-xl text-sm font-medium bg-accent text-bg border border-accent hover:bg-accent2 hover:border-accent2 transition-all"
              >
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Добавить книгу
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl">
              {[
                { label: 'Всего книг', value: books.length },
                { label: 'На модерации', value: pendingBooks, accent: pendingBooks > 0 },
                {
                  label: admin ? 'Эл. книг на проверке' : 'Моих эл. книг',
                  value: admin ? pendingEbooks : myEbooks.length,
                  accent: admin && pendingEbooks > 0,
                },
                {
                  label: admin ? 'Цитат на проверке' : 'Новых запросов',
                  value: admin ? pendingQuotes : pendingOrders,
                  accent: (admin ? pendingQuotes : pendingOrders) > 0,
                },
              ].map(({ label, value, accent }) => (
                <div
                  key={label}
                  className="bg-surface border border-surface2 rounded-2xl px-4 py-4 flex flex-col items-center text-center gap-1"
                >
                  <span
                    className={cn(
                      'font-display font-semibold leading-none',
                      accent ? 'text-gold' : 'text-accent',
                    )}
                    style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem' }}
                  >
                    {value}
                  </span>
                  <span className="text-[11px] text-ash uppercase tracking-wider">
                    {label}
                  </span>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="overflow-x-auto no-scrollbar -mx-1 px-1 sm:overflow-x-visible sm:mx-0 sm:px-0">
              <div className="flex gap-1 bg-surface border min-w-max sm:min-w-0 border-surface2 rounded-xl p-1">
                {tabs.map(({ id, label, shortLabel, count }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setActiveTab(id)}
                    className={cn(
                      'flex-1 flex items-center justify-center gap-2 h-9 px-3 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap',
                      activeTab === id
                        ? 'bg-bg text-ink shadow-card'
                        : 'text-ash hover:text-ink',
                    )}
                  >
                    <span className="md:hidden">{shortLabel ?? label}</span>
                    <span className="hidden md:inline">{label}</span>
                    {count != null && count > 0 && (
                      <span
                        className={cn(
                          'text-[11px] font-medium px-1.5 py-0.5 rounded-full',
                          activeTab === id
                            ? 'bg-accent/10 text-accent'
                            : 'bg-surface2 text-dim',
                        )}
                      >
                        {count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab content */}
            {user && activeTab === 'books' && <MyBooksTab userId={user.id} />}
            {user && activeTab === 'orders' && <MyOrdersTab userId={user.id} />}
            {user && activeTab === 'quotes' && <MyQuotesTab userId={user.id} />}
            {user && activeTab === 'admin-quotes' && <AdminQuotesTab />}
            {user && activeTab === 'ebooks' && <MyEbooksTab userId={user.id} />}
            {user && activeTab === 'admin-ebooks' && <AdminEbooksTab />}
          </div>
        </Container>
      </section>
    </main>
  )
})

DashboardPage.displayName = 'DashboardPage'
