import { createClient } from '@/shared/lib/supabase/client'

export type OrderStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed'

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending:   'Ожидает ответа',
  confirmed: 'Подтверждён',
  cancelled: 'Отклонён',
  completed: 'Завершён',
}

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  pending:   'bg-gold/10 text-gold border-gold/20',
  confirmed: 'bg-accent/10 text-accent border-accent/20',
  cancelled: 'bg-red-50 text-red-500 border-red-200',
  completed: 'bg-surface2 text-ash border-surface3',
}

export interface OrderRow {
  id:           string
  book_id:      string
  buyer_id:     string
  seller_id:    string
  status:       OrderStatus
  message:      string | null
  buyer_contact:string | null
  created_at:   string
  // joined
  books?:       { title: string; cover_url: string | null } | null
  buyer?:       { display_name: string | null; first_name: string | null; last_name: string | null } | null
}

export interface Order {
  id:           string
  bookId:       string
  buyerId:      string
  sellerId:     string
  status:       OrderStatus
  message:      string | null
  buyerContact: string | null
  createdAt:    Date
  bookTitle:    string | null
  bookCoverUrl: string | null
  buyerName:    string | null
}

function mapOrderRow(row: OrderRow): Order {
  const buyerName = row.buyer
    ? [row.buyer.first_name, row.buyer.last_name].filter(Boolean).join(' ')
      || row.buyer.display_name
    : null

  return {
    id:           row.id,
    bookId:       row.book_id,
    buyerId:      row.buyer_id,
    sellerId:     row.seller_id,
    status:       row.status,
    message:      row.message,
    buyerContact: row.buyer_contact,
    createdAt:    new Date(row.created_at),
    bookTitle:    row.books?.title ?? null,
    bookCoverUrl: row.books?.cover_url ?? null,
    buyerName,
  }
}

export async function createOrder(data: {
  bookId:       string
  sellerId:     string
  message:      string
  buyerContact: string
}): Promise<Order> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Необходима авторизация')

  const { data: order, error } = await supabase
    .from('orders')
    .insert({
      book_id:       data.bookId,
      buyer_id:      user.id,
      seller_id:     data.sellerId,
      status:        'pending',
      message:       data.message,
      buyer_contact: data.buyerContact,
    })
    .select('*')
    .single()

  if (error) throw new Error(error.message)
  return mapOrderRow(order as OrderRow)
}

// Seller's incoming orders
export async function fetchMyOrders(sellerId: string): Promise<Order[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('orders')
    .select('*, books(title, cover_url), buyer:profiles!orders_buyer_id_fkey(display_name, first_name, last_name)')
    .eq('seller_id', sellerId)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return (data as OrderRow[]).map(mapOrderRow)
}

// Buyer's sent orders
export async function fetchSentOrders(buyerId: string): Promise<Order[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('orders')
    .select('*, books(title, cover_url)')
    .eq('buyer_id', buyerId)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return (data as OrderRow[]).map(mapOrderRow)
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId)

  if (error) throw new Error(error.message)
}
