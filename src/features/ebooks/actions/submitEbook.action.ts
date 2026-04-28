'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/shared/lib/supabase/server'
import { getFormatFromFile } from '@/entities/ebook/model/types'
import type { CopyrightType } from '@/entities/ebook/model/types'
import type { BookCategory } from '@/entities/book/model/types'

export interface SubmitEbookData {
  title:         string
  author:        string
  year:          number | null
  category:      BookCategory
  description:   string
  copyrightType: CopyrightType
  fileBase64:    string   // base64 encoded file content
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
  const status = role === 'admin' ? 'approved' : 'pending'

  // Декодируем base64 → Buffer
  const base64Data  = data.fileBase64.split(',')[1] ?? data.fileBase64
  const fileBuffer  = Buffer.from(base64Data, 'base64')

  // Генерируем уникальный id для файла
  const ebookId  = crypto.randomUUID()
  const ext      = data.fileName.split('.').pop()?.toLowerCase() ?? 'pdf'
  const storagePath = `${user.id}/${ebookId}.${ext}`

  // Загружаем файл в Supabase Storage bucket 'ebooks'
  const { error: uploadError } = await supabase
    .storage
    .from('ebooks')
    .upload(storagePath, fileBuffer, {
      contentType: data.fileType,
      upsert: false,
    })

  if (uploadError) throw new Error(`Ошибка загрузки файла: ${uploadError.message}`)

  // Определяем формат
  const format = ext as ReturnType<typeof getFormatFromFile> ?? 'pdf'

  // Сохраняем в таблицу ebooks
  const { error: dbError } = await supabase
    .from('ebooks')
    .insert({
      id:             ebookId,
      title:          data.title.trim(),
      author:         data.author.trim(),
      year:           data.year,
      category:       data.category,
      description:    data.description.trim() || null,
      file_url:       storagePath,
      file_name:      data.fileName,
      file_format:    format,
      file_size:      data.fileSize,
      user_id:        user.id,
      status,
      copyright_type: data.copyrightType,
      download_count: 0,
    })

  if (dbError) {
    // Откатываем загрузку файла
    await supabase.storage.from('ebooks').remove([storagePath])
    throw new Error(dbError.message)
  }

  redirect('/dashboard?ebook_added=true')
}
