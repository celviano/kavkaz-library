export type EventType = 'lecture' | 'meeting' | 'exhibition' | 'tour' | 'other'

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  lecture:    'Лекция',
  meeting:    'Встреча',
  exhibition: 'Выставка',
  tour:       'Экскурсия',
  other:      'Другое',
}

export interface EventRow {
  id:          string
  title:       string
  description: string | null
  type:        EventType
  location:    string | null
  address:     string | null
  starts_at:   string
  ends_at:     string | null
  cover_url:   string | null
  is_free:     boolean
  price:       number | null
  currency:    string
  max_seats:   number | null
  is_online:   boolean
  online_url:  string | null
  created_at:  string
}

export interface Event {
  id:          string
  title:       string
  description: string
  type:        EventType
  location:    string | null
  address:     string | null
  startsAt:    Date
  endsAt:      Date | null
  coverUrl:    string | null
  isFree:      boolean
  price:       number | null
  currency:    string
  maxSeats:    number | null
  isOnline:    boolean
  onlineUrl:   string | null
  createdAt:   Date
}

export function mapEventRow(row: EventRow): Event {
  return {
    id:          row.id,
    title:       row.title,
    description: row.description ?? '',
    type:        row.type,
    location:    row.location,
    address:     row.address,
    startsAt:    new Date(row.starts_at),
    endsAt:      row.ends_at ? new Date(row.ends_at) : null,
    coverUrl:    row.cover_url,
    isFree:      row.is_free,
    price:       row.price,
    currency:    row.currency ?? 'RUB',
    maxSeats:    row.max_seats,
    isOnline:    row.is_online,
    onlineUrl:   row.online_url,
    createdAt:   new Date(row.created_at),
  }
}
