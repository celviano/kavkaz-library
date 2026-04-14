import type { MetadataRoute } from 'next'
import { createClient } from '@/shared/lib/supabase/client'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://caucasuslibrary.ru'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url:             BASE_URL,
      lastModified:    new Date(),
      changeFrequency: 'daily',
      priority:        1,
    },
    {
      url:             `${BASE_URL}/catalog`,
      lastModified:    new Date(),
      changeFrequency: 'daily',
      priority:        0.9,
    },
    {
      url:             `${BASE_URL}/events`,
      lastModified:    new Date(),
      changeFrequency: 'weekly',
      priority:        0.7,
    },
    {
      url:             `${BASE_URL}/about`,
      lastModified:    new Date(),
      changeFrequency: 'monthly',
      priority:        0.5,
    },
  ]

  try {
    const supabase = createClient()

    const { data: books } = await supabase
      .from('books')
      .select('id, created_at, owner_id')
      .eq('status', 'active')

    const rows = books ?? []

    const bookPages: MetadataRoute.Sitemap = rows.map((book) => ({
      url:             `${BASE_URL}/book/${book.id}`,
      lastModified:    new Date(book.created_at as string),
      changeFrequency: 'monthly' as const,
      priority:        0.8,
    }))

    const uniqueSellerIds = [...new Set(rows.map((b) => b.owner_id as string))]
    const sellerPages: MetadataRoute.Sitemap = uniqueSellerIds.map((id) => ({
      url:             `${BASE_URL}/seller/${id}`,
      lastModified:    new Date(),
      changeFrequency: 'weekly' as const,
      priority:        0.6,
    }))

    return [...staticPages, ...bookPages, ...sellerPages]
  } catch {
    return staticPages
  }
}
