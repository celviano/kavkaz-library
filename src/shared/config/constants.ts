import type { BookCategory } from '@/entities/book'

export const CATEGORY_LABELS: Record<BookCategory, string> = {
  history:     'История',
  geography:   'География',
  ethnography: 'Этнография',
  memoirs:     'Мемуары',
  atlases:     'Атласы',
  other:       'Другое',
}

export const CATEGORIES: BookCategory[] = [
  'history',
  'geography',
  'ethnography',
  'memoirs',
  'atlases',
  'other',
]
