'use client'

import { memo } from 'react'
import Link from 'next/link'
import { Container } from '@/shared/ui/Container'
import { BookGrid } from '@/widgets/book-grid'
import { useCurrentUser } from '@/shared/hooks/useCurrentUser'
import { useFavoriteBooks } from '@/features/favorites'

export const FavoritesPage = memo(() => {
  const { user, loading: userLoading } = useCurrentUser()
  const { data: books = [], isLoading, error } = useFavoriteBooks(user?.id ?? null)

  // Not logged in
  if (!userLoading && !user) {
    return (
      <main id="main-content" className="flex-1 flex items-center justify-center py-24">
        <Container>
          <div className="max-w-md mx-auto text-center flex flex-col items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-surface border border-surface2 flex items-center justify-center">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#7D7060"
                strokeWidth="1.5"
                strokeLinecap="round"
              >
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <div>
              <h1
                className="font-display font-semibold text-ink mb-2"
                style={{ fontFamily: 'var(--font-display)', fontSize: '1.7rem' }}
              >
                Войдите в аккаунт
              </h1>
              <p className="text-ash text-sm leading-relaxed">
                Чтобы сохранять книги в избранное, необходимо авторизоваться.
              </p>
            </div>
            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center h-11 px-7 rounded-xl text-sm font-medium bg-accent text-bg border border-accent hover:bg-accent2 transition-all"
            >
              Войти
            </Link>
          </div>
        </Container>
      </main>
    )
  }

  return (
    <main id="main-content">
      <section className="py-12">
        <Container>
          {/* Header */}
          <div className="mb-10">
            <p className="text-[11px] font-medium tracking-[2px] uppercase text-accent mb-2">
              Личное
            </p>
            <h1
              className="font-display font-semibold text-ink leading-tight mb-2"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 4vw, 3rem)',
              }}
            >
              Избранные книги
            </h1>
            {!isLoading && (
              <p className="text-ash text-base">
                {books.length === 0
                  ? 'Вы ещё не добавили ни одной книги'
                  : `${books.length} ${books.length === 1 ? 'книга' : books.length < 5 ? 'книги' : 'книг'} в избранном`}
              </p>
            )}
          </div>

          {/* Loading */}
          {(isLoading || userLoading) && (
            <div className="grid gap-5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-surface border border-surface2 overflow-hidden animate-pulse"
                >
                  <div className="aspect-[3/4] bg-surface2" />
                  <div className="p-4 flex flex-col gap-2">
                    <div className="h-4 bg-surface2 rounded-full w-1/2" />
                    <div className="h-3 bg-surface2 rounded-full w-3/4" />
                    <div className="h-3 bg-surface2 rounded-full w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-600">
              Не удалось загрузить избранное. Попробуйте обновить страницу.
            </div>
          )}

          {/* Empty state */}
          {!isLoading && !error && books.length === 0 && (
            <div className="flex flex-col items-center gap-5 py-24 text-center">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#d6ccbf"
                strokeWidth="1.2"
                strokeLinecap="round"
              >
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
              <div>
                <p className="text-ink font-medium mb-1">Здесь пока пусто</p>
                <p className="text-ash text-sm">
                  Нажмите на флажок на карточке книги, чтобы сохранить её
                </p>
              </div>
              <Link
                href="/catalog"
                className="inline-flex items-center justify-center h-10 px-6 rounded-xl text-sm font-medium bg-accent text-bg hover:bg-accent2 transition-all"
              >
                Перейти в каталог
              </Link>
            </div>
          )}

          {/* Books grid */}
          {!isLoading && !error && books.length > 0 && <BookGrid books={books} />}
        </Container>
      </section>
    </main>
  )
})

FavoritesPage.displayName = 'FavoritesPage'
