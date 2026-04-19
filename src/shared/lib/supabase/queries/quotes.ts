import { createClient } from '@/shared/lib/supabase/client'

export type QuoteStatus = 'pending' | 'approved' | 'rejected'

export const QUOTE_STATUS_LABELS: Record<QuoteStatus, string> = {
  pending:  'На рассмотрении',
  approved: 'Принята',
  rejected: 'Отклонена',
}

export const QUOTE_STATUS_COLORS: Record<QuoteStatus, string> = {
  pending:  'bg-gold/10 text-gold border-gold/20',
  approved: 'bg-accent/10 text-accent border-accent/20',
  rejected: 'bg-red-50 text-red-500 border-red-200',
}

export interface QuoteRow {
  id:         string
  text:       string
  author:     string
  source:     string
  user_id:    string
  status:     QuoteStatus
  queue_date: string | null
  created_at: string
}

export interface Quote {
  id:        string
  text:      string
  author:    string
  source:    string
  userId:    string
  status:    QuoteStatus
  queueDate: Date | null
  createdAt: Date
}

export function mapQuoteRow(row: QuoteRow): Quote {
  return {
    id:        row.id,
    text:      row.text,
    author:    row.author,
    source:    row.source,
    userId:    row.user_id,
    status:    row.status,
    queueDate: row.queue_date ? new Date(row.queue_date) : null,
    createdAt: new Date(row.created_at),
  }
}

// Получить цитату дня (approved, по queue_date <= today, самая ближайшая к сегодня)
export async function fetchDailyQuote(): Promise<Quote | null> {
  const supabase = createClient()
  const today = new Date().toISOString().slice(0, 10)

  const { data, error } = await supabase
    .from('quotes')
    .select('*')
    .eq('status', 'approved')
    .not('queue_date', 'is', null)
    .lte('queue_date', today)
    .order('queue_date', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error || !data) return null
  return mapQuoteRow(data as QuoteRow)
}

// Добавить цитату (пользователь)
export async function submitQuote(params: {
  text:   string
  author: string
  source: string
  userId: string
}): Promise<Quote> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('quotes')
    .insert({
      text:    params.text,
      author:  params.author,
      source:  params.source,
      user_id: params.userId,
    })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return mapQuoteRow(data as QuoteRow)
}

// Мои цитаты (для кабинета пользователя)
export async function fetchMyQuotes(userId: string): Promise<Quote[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('quotes')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return (data as QuoteRow[]).map(mapQuoteRow)
}

// Все цитаты на модерации (для админа)
export async function fetchPendingQuotes(): Promise<Quote[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('quotes')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: true })

  if (error) throw new Error(error.message)
  return (data as QuoteRow[]).map(mapQuoteRow)
}

// Все цитаты для админа (все статусы)
export async function fetchAllQuotes(): Promise<Quote[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('quotes')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return (data as QuoteRow[]).map(mapQuoteRow)
}

// Апрув/отклонение цитаты (для админа)
// При апруве вычисляем следующую свободную дату в очереди
export async function updateQuoteStatus(
  quoteId: string,
  status:  'approved' | 'rejected',
): Promise<void> {
  const supabase = createClient()

  if (status === 'rejected') {
    const { error } = await supabase
      .from('quotes')
      .update({ status: 'rejected', queue_date: null })
      .eq('id', quoteId)
    if (error) throw new Error(error.message)
    return
  }

  // Найти последнюю занятую дату в очереди
  const { data: lastQueued } = await supabase
    .from('quotes')
    .select('queue_date')
    .eq('status', 'approved')
    .not('queue_date', 'is', null)
    .order('queue_date', { ascending: false })
    .limit(1)
    .maybeSingle()

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  let nextDate: Date
  if (lastQueued?.queue_date) {
    const last = new Date(lastQueued.queue_date)
    last.setHours(0, 0, 0, 0)
    // Следующая дата после последней в очереди (но не раньше завтра)
    const candidate = new Date(last)
    candidate.setDate(candidate.getDate() + 1)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    nextDate = candidate > tomorrow ? candidate : tomorrow
  } else {
    // Нет одобренных — ставим на завтра
    nextDate = new Date(today)
    nextDate.setDate(nextDate.getDate() + 1)
  }

  const queueDate = nextDate.toISOString().slice(0, 10)

  const { error } = await supabase
    .from('quotes')
    .update({ status: 'approved', queue_date: queueDate })
    .eq('id', quoteId)

  if (error) throw new Error(error.message)
}
