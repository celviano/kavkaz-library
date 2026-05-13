'use server'

import { redirect } from 'next/navigation'

import type { BookCategory } from '@/entities/book/model/types'
import type { CopyrightType } from '@/entities/ebook/model/types'
import { createClient } from '@/shared/lib/supabase/server'

export interface SubmitEbookData {
  title: string
  author: string
  year: number | null
  category: BookCategory
  description: string
  copyrightType: CopyrightType
  storagePath: string
  fileName: string
  fileType: string
  fileSize: number
  coverUrl: string
  pages: number | null
  language: string
  publisherName: string
  publisherCity: string
  edition: string
  tags: string
}

export async function submitEbookAction(data: SubmitEbookData) {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()
  if (authError || !user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const role = profile?.role ?? 'user'
  const status = role === 'admin' ? 'active' : 'pending'

  const ext = data.fileName.split('.').pop()?.toLowerCase() ?? 'pdf'

  // Создаём запись в таблице books (каталог читает именно отсюда)
  const { data: book, error: dbError } = await supabase
    .from('books')
    .insert({
      title: data.title.trim(),
      author: data.author.trim(),
      year: data.year ?? new Date().getFullYear(),
      category: data.category,
      description: data.description.trim() || null,
      language: data.language || 'Русский',
      available: true,
      is_featured: false,
      status,
      owner_id: user.id,
      cover_url: data.coverUrl || null,
      pages: data.pages,
      publisher_name: data.publisherName.trim() || null,
      publisher_city: data.publisherCity.trim() || null,
      edition: data.edition.trim() || null,
      tags: data.tags
        ? data.tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean)
        : [],
      book_type: 'ebook',
      ebook_format: ext,
      ebook_file_url: data.storagePath,
      ebook_size: data.fileSize,
      price: null,
      price_type: null,
      currency: 'RUB',
      copies_total: null,
      copies_left: null,
    })
    .select('id')
    .single()

  if (dbError) {
    // Откатываем загрузку файла из Storage
    await supabase.storage.from('ebooks').remove([data.storagePath])
    throw new Error(dbError.message)
  }

  // Также сохраняем в таблицу ebooks для истории/модерации
  await supabase.from('ebooks').insert({
    id: book.id,
    title: data.title.trim(),
    author: data.author.trim(),
    year: data.year,
    category: data.category,
    description: data.description.trim() || null,
    file_url: data.storagePath,
    file_name: data.fileName,
    file_format: ext,
    file_size: data.fileSize,
    cover_url: data.coverUrl || null,
    user_id: user.id,
    status,
    copyright_type: data.copyrightType,
    download_count: 0,
  })

  redirect('/dashboard?ebook_added=true')
}
