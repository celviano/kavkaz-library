export type BookCategory =
  | 'history'
  | 'culture'
  | 'languages'
  | 'literature'
  | 'biography'
  | 'geography'
  | 'ethnography'
  | 'memoirs'
  | 'atlases'
  | 'other'

export type BookCondition = 'new' | 'good' | 'fair' | 'poor'

export type BookStatus = 'draft' | 'pending' | 'active' | 'sold' | 'archived'

export const CONDITION_LABELS: Record<BookCondition, string> = {
  new:  'Новое',
  good: 'Хорошее',
  fair: 'Удовлетворительное',
  poor: 'Потрёпанное',
}

export const STATUS_LABELS: Record<BookStatus, string> = {
  draft:    'Черновик',
  pending:  'На модерации',
  active:   'Активна',
  sold:     'Продана',
  archived: 'В архиве',
}

export const STATUS_COLORS: Record<BookStatus, string> = {
  draft:    'bg-surface2 text-ash border-surface3',
  pending:  'bg-gold/10 text-gold border-gold/20',
  active:   'bg-accent/10 text-accent border-accent/20',
  sold:     'bg-surface2 text-dim border-surface3',
  archived: 'bg-surface2 text-dim border-surface3',
}

export interface BookRow {
  id:             string
  title:          string
  author:         string
  year:           number
  category:       BookCategory
  description:    string | null
  pages:          number | null
  language:       string
  available:      boolean
  cover_url:      string | null
  images:         string[] | null
  tags:           string[] | null
  publisher_name: string | null
  publisher_city: string | null
  is_featured:    boolean
  price:          number | null
  currency:       string
  price_type:     'fixed' | 'negotiable' | 'exchange' | null
  condition:      BookCondition | null
  edition:        string | null
  copies_total:   number | null
  copies_left:    number | null
  status:         BookStatus
  owner_id:       string | null
  book_type:      'physical' | 'ebook' | null
  ebook_format:   string | null
  ebook_file_url: string | null
  ebook_size:     number | null
  created_at:     string
}

export interface Book {
  id:            string
  title:         string
  author:        string
  year:          number
  category:      BookCategory
  description:   string
  pages:         number
  language:      string
  available:     boolean
  coverUrl:      string | null
  images:        string[]
  tags:          string[]
  publisherName: string | null
  publisherCity: string | null
  isFeatured:    boolean
  price:         number | null
  currency:      string
  priceType:     'fixed' | 'negotiable' | 'exchange' | null
  condition:     BookCondition | null
  edition:       string | null
  copiesTotal:   number
  copiesLeft:    number
  status:        BookStatus
  ownerId:       string | null
  bookType:      'physical' | 'ebook'
  ebookFormat:   string | null
  ebookFileUrl:  string | null
  ebookSize:     number | null
}

export interface BookSlide {
  id:    number
  label: string
}

export function mapBookRow(row: BookRow): Book {
  return {
    id:            row.id,
    title:         row.title,
    author:        row.author,
    year:          row.year,
    category:      row.category,
    description:   row.description ?? '',
    pages:         row.pages ?? 0,
    language:      row.language,
    available:     row.available,
    coverUrl:      row.cover_url,
    images:        row.images ?? [],
    tags:          row.tags ?? [],
    publisherName: row.publisher_name,
    publisherCity: row.publisher_city,
    isFeatured:    row.is_featured,
    price:         row.price,
    currency:      row.currency ?? 'RUB',
    priceType:     row.price_type,
    condition:     row.condition,
    edition:       row.edition,
    copiesTotal:   row.copies_total ?? 0,
    copiesLeft:    row.copies_left ?? 0,
    status:        row.status ?? 'active',
    ownerId:       row.owner_id,
    bookType:      row.book_type ?? 'physical',
    ebookFormat:   row.ebook_format ?? null,
    ebookFileUrl:  row.ebook_file_url ?? null,
    ebookSize:     row.ebook_size ?? null,
  }
}
