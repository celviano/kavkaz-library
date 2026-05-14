'use server'

import { redirect } from 'next/navigation'

import type { BookCategory } from '@/entities/book/model/types'
import type { CopyrightType } from '@/entities/ebook/model/types'
import { createClient } from '@/shared/lib/supabase/server'

function extractStoragePath(url: string, bucket: string): string | null {
  const marker = `/object/public/${bucket}/`
  const idx = url.indexOf(marker)
  if (idx === -1) return null
  return url.slice(idx + marker.length)
}

export interface UpdateEbookData {
  title: string
  author: string
  year: number | null
  category: BookCategory
  description: string
  pages: number | null
  language: string
  publisherName: string
  publisherCity: string
  edition: string
  tags: string
  copyrightType: CopyrightType
  // Cover
  coverUrl: string | null
  coverUrlToDelete: string | null
  // File (null means keep existing)
  newFilePath: string | null
  newFileName: string | null
  newFileType: string | null
  newFileSize: number | null
  oldFilePath: string
}

export async function updateEbookAction(ebookId: string, data: UpdateEbookData) {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()
  if (authError || !user) redirect('/auth/login')

  const { data: ebookRow } = await supabase
    .from('ebooks')
    .select('user_id')
    .eq('id', ebookId)
    .single()
  if (!ebookRow) redirect('/dashboard')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  const role = profile?.role ?? 'user'

  if (role !== 'admin' && ebookRow.user_id !== user.id) redirect('/dashboard')

  // Delete old cover if replaced or removed
  if (data.coverUrlToDelete) {
    const path = extractStoragePath(data.coverUrlToDelete, 'book-covers')
    if (path) await supabase.storage.from('book-covers').remove([path])
  }

  // Delete old file if replaced
  if (data.newFilePath && data.oldFilePath) {
    await supabase.storage.from('ebooks').remove([data.oldFilePath])
  }

  const tags = data.tags
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)

  const fileUpdate = data.newFilePath
    ? {
        file_url: data.newFilePath,
        file_name: data.newFileName,
        file_format: data.newFileType?.split('/').pop() ?? null,
        file_size: data.newFileSize,
      }
    : {}

  // Update ebooks table — only columns that exist in the schema
  const { error: ebookError } = await supabase
    .from('ebooks')
    .update({
      title: data.title.trim(),
      author: data.author.trim(),
      year: data.year,
      category: data.category,
      description: data.description.trim(),
      cover_url: data.coverUrl || null,
      copyright_type: data.copyrightType,
      updated_at: new Date().toISOString(),
      ...fileUpdate,
    })
    .eq('id', ebookId)

  if (ebookError) throw new Error(ebookError.message)

  // Sync books table (catalog + metadata that ebooks table lacks)
  await supabase
    .from('books')
    .update({
      title: data.title.trim(),
      author: data.author.trim(),
      year: data.year ?? 0,
      category: data.category,
      description: data.description.trim(),
      cover_url: data.coverUrl || null,
      tags: tags.length > 0 ? tags : null,
      publisher_name: data.publisherName.trim() || null,
      publisher_city: data.publisherCity.trim() || null,
      edition: data.edition.trim() || null,
      ...(data.newFilePath
        ? { ebook_file_url: data.newFilePath, ebook_size: data.newFileSize }
        : {}),
    })
    .eq('id', ebookId)

  redirect(`/book/${ebookId}`)
}
