export type BookCategory =
  | 'history'
  | 'geography'
  | 'ethnography'
  | 'memoirs'
  | 'atlases'
  | 'other'

export type BookCondition = 'new' | 'good' | 'fair' | 'poor'

export const CONDITION_LABELS: Record<BookCondition, string> = {
  new: 'Новое',
  good: 'Хорошее',
  fair: 'Удовлетворительное',
  poor: 'Потрёпанное',
}

// Shape coming from Supabase (snake_case)
export interface BookRow {
  id: string
  title: string
  author: string
  year: number
  category: BookCategory
  description: string | null
  pages: number | null
  language: string
  available: boolean
  cover_url: string | null
  images: string[] | null
  tags: string[] | null
  publisher_name: string | null
  publisher_city: string | null
  is_featured: boolean
  price: number | null
  currency: string
  condition: BookCondition | null
  edition: string | null
  copies_total: number | null
  copies_left: number | null
  created_at: string
}

// Normalised frontend model
export interface Book {
  id: string
  title: string
  author: string
  year: number
  category: BookCategory
  description: string
  pages: number
  language: string
  available: boolean
  coverUrl: string | null
  images: string[]
  tags: string[]
  publisherName: string | null
  publisherCity: string | null
  isFeatured: boolean
  price: number | null
  currency: string
  condition: BookCondition | null
  edition: string | null
  copiesTotal: number
  copiesLeft: number
}

export interface BookSlide {
  id: number
  label: string
}

// Mapper: DB row → frontend model
export function mapBookRow(row: BookRow): Book {
  return {
    id: row.id,
    title: row.title,
    author: row.author,
    year: row.year,
    category: row.category,
    description: row.description ?? '',
    pages: row.pages ?? 0,
    language: row.language,
    available: row.available,
    coverUrl: row.cover_url,
    images: row.images ?? [],
    tags: row.tags ?? [],
    publisherName: row.publisher_name,
    publisherCity: row.publisher_city,
    isFeatured: row.is_featured,
    price: row.price,
    currency: row.currency ?? 'RUB',
    condition: row.condition,
    edition: row.edition,
    copiesTotal: row.copies_total ?? 0,
    copiesLeft: row.copies_left ?? 0,
  }
}
