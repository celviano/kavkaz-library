import type { BookCategory } from '@/entities/book/model/types'

export const queryKeys = {
  books: {
    all: ['books'] as const,
    list: (params: { category?: BookCategory | 'all'; search?: string; page?: number }) =>
      ['books', 'list', params] as const,
    detail: (id: string) => ['books', 'detail', id] as const,
    featured: ['books', 'featured'] as const,
    similar: (id: string, category: BookCategory) =>
      ['books', 'similar', id, category] as const,
  },
  favorites: {
    all: (userId: string) => ['favorites', userId] as const,
    ids: (userId: string) => ['favorites', userId, 'ids'] as const,
    books: (userId: string) => ['favorites', userId, 'books'] as const,
  },
}
