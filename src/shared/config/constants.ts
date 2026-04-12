import type { BookCategory } from '@/entities/book'

export const CATEGORY_LABELS: Record<BookCategory, string> = {
  history:     'История',
  culture:     'Культура',
  languages:   'Языки',
  literature:  'Литература',
  biography:   'Биографии',
  geography:   'География',
  ethnography: 'Этнография',
  memoirs:     'Мемуары',
  atlases:     'Атласы',
  other:       'Другое',
}

export const CATEGORIES: BookCategory[] = [
  'history',
  'culture',
  'languages',
  'literature',
  'biography',
  'geography',
  'ethnography',
  'memoirs',
  'atlases',
  'other',
]
