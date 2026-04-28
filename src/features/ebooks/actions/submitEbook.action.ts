'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/shared/lib/supabase/server'
import type { CopyrightType } from '@/entities/ebook/model/types'
import type { BookCategory } from '@/entities/book/model/types'

export interface SubmitEbookData {
  title:         string
  author:        string
  year:          number | null
  category:      BookCategory
  description:   string
  copyrightType: CopyrightType
  storagePath:   string
  fileName:      string
  fileType:      string
  fileSize:      number
}

export async function submitEbookAction(data: SubmitEbookData) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const role   = profile?.role ?? 'user'
  const status = role === 'admin' ? 'active' : 'pending'

  const ext    = data.fileName.split('.').pop()?.toLowerCase() ?? 'pdf'

  // Создаём запись в таблице books (каталог читает именно отсюда)
  const { data: book, error: dbError } = await supabase
    .from('books')
    .insert({
      title:          data.title.trim(),
      author:         data.author.trim(),
      year:           data.year ?? new Date().getFullYear(),
      category:       data.category,
      description:    data.description.trim() || null,
      language:       'ru',
      available:      true,
      is_featured:    false,
      status,
      owner_id:       user.id,
      book_type:      'ebook',
      ebook_format:   ext,
      ebook_file_url: data.storagePath,
      ebook_size:     data.fileSize,
      price:          null,
      price_type:     null,
      currency:       'RUB',
      copies_total:   null,
      copies_left:    null,
    })
    .select('id')
    .single()

  if (dbError) {
    // Откатываем загрузку файла из Storage
    await supabase.storage.from('ebooks').remove([data.storagePath])
    throw new Error(dbError.message)
  }

  // Также сохраняем в таблицу ebooks для истории/модерации
  await supabase
    .from('ebooks')
    .insert({
      id:             book.id,
      title:          data.title.trim(),
      author:         data.author.trim(),
      year:           data.year,
      category:       data.category,
      description:    data.description.trim() || null,
      file_url:       data.storagePath,
      file_name:      data.fileName,
      file_format:    ext,
      file_size:      data.fileSize,
      user_id:        user.id,
      status,
      copyright_type: data.copyrightType,
      download_count: 0,
    })

  redirect('/dashboard?ebook_added=true')
}
