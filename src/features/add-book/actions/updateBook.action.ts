'use server'

import { redirect } from 'next/navigation'

import type { BookCategory, BookCondition } from '@/entities/book/model/types'
import { createClient } from '@/shared/lib/supabase/server'

function extractStoragePath(url: string, bucket: string): string | null {
  const marker = `/object/public/${bucket}/`
  const idx = url.indexOf(marker)
  if (idx === -1) return null
  return url.slice(idx + marker.length)
}

export interface UpdateBookData {
  title: string
  author: string
  year: number
  category: BookCategory
  description: string
  pages: number | null
  language: string
  price: number | null
  currency: string
  priceType: 'fixed' | 'negotiable' | 'exchange'
  condition: BookCondition
  edition: string
  publisherName: string
  publisherCity: string
  tags: string
  coverUrl: string | null
  imageUrls: string[]
  urlsToDelete: string[]
  copiesTotal: number
}

export async function updateBookAction(bookId: string, data: UpdateBookData) {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()
  if (authError || !user) redirect('/auth/login')

  const { data: bookRow } = await supabase
    .from('books')
    .select('owner_id')
    .eq('id', bookId)
    .single()
  if (!bookRow) redirect('/catalog')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  const role = profile?.role ?? 'user'

  if (role !== 'admin' && bookRow.owner_id !== user.id) redirect(`/book/${bookId}`)

  // Delete removed files from storage
  for (const url of data.urlsToDelete) {
    const coverPath = extractStoragePath(url, 'book-covers')
    if (coverPath) {
      await supabase.storage.from('book-covers').remove([coverPath])
      continue
    }
    const imagePath = extractStoragePath(url, 'book-images')
    if (imagePath) await supabase.storage.from('book-images').remove([imagePath])
  }

  const tags = data.tags
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)

  const { error } = await supabase
    .from('books')
    .update({
      title: data.title.trim(),
      author: data.author.trim(),
      year: data.year,
      category: data.category,
      description: data.description.trim(),
      pages: data.pages,
      language: data.language,
      cover_url: data.coverUrl || null,
      images: data.imageUrls.length > 0 ? data.imageUrls : null,
      tags: tags.length > 0 ? tags : null,
      publisher_name: data.publisherName.trim() || null,
      publisher_city: data.publisherCity.trim() || null,
      price: data.priceType === 'fixed' ? data.price : null,
      price_type: data.priceType,
      currency: data.currency,
      condition: data.condition,
      edition: data.edition.trim() || null,
      copies_total: data.copiesTotal,
    })
    .eq('id', bookId)

  if (error) throw new Error(error.message)

  redirect(`/book/${bookId}`)
}
