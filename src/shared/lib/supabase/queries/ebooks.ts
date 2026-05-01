import { createClient } from '@/shared/lib/supabase/client'
import { mapEbookRow } from '@/entities/ebook/model/types'
import type { Ebook, EbookRow, EbookStatus } from '@/entities/ebook/model/types'
import type { BookCategory } from '@/entities/book/model/types'

export interface EbooksQueryParams {
  category?: BookCategory | 'all'
<<<<<<< Updated upstream
  search?:   string
  page?:     number
=======
  search?: string
  page?: number
>>>>>>> Stashed changes
  pageSize?: number
}

export interface EbooksQueryResult {
<<<<<<< Updated upstream
  ebooks:     Ebook[]
  total:      number
  page:       number
  pageSize:   number
=======
  ebooks: Ebook[]
  total: number
  page: number
  pageSize: number
>>>>>>> Stashed changes
  totalPages: number
}

// Все одобренные электронные книги (каталог)
<<<<<<< Updated upstream
export async function fetchEbooks(params: EbooksQueryParams = {}): Promise<EbooksQueryResult> {
  const supabase = createClient()
  const { category, search, page = 1, pageSize = 12 } = params
  const from = (page - 1) * pageSize
  const to   = from + pageSize - 1
=======
export async function fetchEbooks(
  params: EbooksQueryParams = {},
): Promise<EbooksQueryResult> {
  const supabase = createClient()
  const { category, search, page = 1, pageSize = 12 } = params
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1
>>>>>>> Stashed changes

  let query = supabase
    .from('ebooks')
    .select('*', { count: 'exact' })
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .range(from, to)

  if (category && category !== 'all') {
    query = query.eq('category', category)
  }
  if (search && search.trim().length > 0) {
    query = query.or(`title.ilike.%${search.trim()}%,author.ilike.%${search.trim()}%`)
  }

  const { data, error, count } = await query
  if (error) throw new Error(error.message)

  const total = count ?? 0
  return {
<<<<<<< Updated upstream
    ebooks:     (data as EbookRow[]).map(mapEbookRow),
=======
    ebooks: (data as EbookRow[]).map(mapEbookRow),
>>>>>>> Stashed changes
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  }
}

// Одна книга по id
export async function fetchEbookById(id: string): Promise<Ebook | null> {
  const supabase = createClient()
<<<<<<< Updated upstream
  const { data, error } = await supabase
    .from('ebooks')
    .select('*')
    .eq('id', id)
    .single()
=======
  const { data, error } = await supabase.from('ebooks').select('*').eq('id', id).single()
>>>>>>> Stashed changes

  if (error) return null
  return mapEbookRow(data as EbookRow)
}

// Мои электронные книги
export async function fetchMyEbooks(userId: string): Promise<Ebook[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('ebooks')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return (data as EbookRow[]).map(mapEbookRow)
}

// Все ebooks для модерации (только pending)
export async function fetchPendingEbooks(): Promise<Ebook[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('ebooks')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: true })

  if (error) throw new Error(error.message)
  return (data as EbookRow[]).map(mapEbookRow)
}

// Все ebooks для модерации (все статусы — для админа)
export async function fetchAllEbooks(): Promise<Ebook[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('ebooks')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return (data as EbookRow[]).map(mapEbookRow)
}

// Обновить статус ebook (апрув/отклонение)
export async function updateEbookStatus(
  ebookId: string,
<<<<<<< Updated upstream
  status:  'approved' | 'rejected',
=======
  status: 'approved' | 'rejected',
>>>>>>> Stashed changes
  rejectionReason?: string,
): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase
    .from('ebooks')
    .update({
      status,
      rejection_reason: rejectionReason ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', ebookId)

  if (error) throw new Error(error.message)
}

// Увеличить счётчик загрузок
export async function incrementDownloadCount(ebookId: string): Promise<void> {
  const supabase = createClient()
  const { data: current } = await supabase
    .from('ebooks')
    .select('download_count')
    .eq('id', ebookId)
    .single()

  const newCount = (current?.download_count ?? 0) + 1

<<<<<<< Updated upstream
  await supabase
    .from('ebooks')
    .update({ download_count: newCount })
    .eq('id', ebookId)
=======
  await supabase.from('ebooks').update({ download_count: newCount }).eq('id', ebookId)
>>>>>>> Stashed changes
}

// Получить signed URL для скачивания файла
export async function getEbookDownloadUrl(fileUrl: string): Promise<string> {
  const supabase = createClient()
<<<<<<< Updated upstream
  const { data, error } = await supabase
    .storage
    .from('ebooks')
    .createSignedUrl(fileUrl, 3600) // 1 час

  if (error) throw new Error(error.message)
  return data.signedUrl
=======
  const { data } = supabase.storage.from('ebooks').getPublicUrl(fileUrl)

  return data.publicUrl
>>>>>>> Stashed changes
}
