'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/shared/lib/supabase/server'
import type { BookCategory, BookCondition, BookStatus } from '@/entities/book/model/types'

export interface AddBookFormData {
  title:         string
  author:        string
  year:          number
  category:      BookCategory
  description:   string
  pages:         number | null
  language:      string
  price:         number | null
  currency:      string
  priceType:     'fixed' | 'negotiable' | 'exchange'
  condition:     BookCondition
  edition:       string
  publisherName: string
  publisherCity: string
  tags:          string
  coverUrl:      string
  imageUrls:     string[]
  copiesTotal:   number
}

export async function addBookAction(data: AddBookFormData) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) redirect('/auth/login')

  // Get user role — admin books go active immediately, others go pending
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const role = profile?.role ?? 'user'
  const status: BookStatus = role === 'admin' ? 'active' : 'pending'

  const tags = data.tags
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)

  const { data: book, error } = await supabase
    .from('books')
    .insert({
      title:          data.title.trim(),
      author:         data.author.trim(),
      year:           data.year,
      category:       data.category,
      description:    data.description.trim(),
      pages:          data.pages,
      language:       data.language,
      available:      true,
      cover_url:      data.coverUrl || null,
      images:         data.imageUrls.length > 0 ? data.imageUrls : null,
      tags:           tags.length > 0 ? tags : null,
      publisher_name: data.publisherName.trim() || null,
      publisher_city: data.publisherCity.trim() || null,
      is_featured:    false,
      price:          data.priceType === 'fixed' ? data.price : null,
      price_type:     data.priceType,
      currency:       data.currency,
      condition:      data.condition,
      edition:        data.edition.trim() || null,
      copies_total:   data.copiesTotal,
      copies_left:    data.copiesTotal,
      status,
      owner_id:       user.id,
    })
    .select('id')
    .single()

  if (error) throw new Error(error.message)

  // Admin goes straight to book page, others go to dashboard
  if (role === 'admin') {
    redirect(`/book/${book.id}`)
  } else {
    redirect('/dashboard?added=true')
  }
}
