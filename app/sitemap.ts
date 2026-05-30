import type { MetadataRoute } from 'next'
import { createClient } from '@/shared/lib/supabase/server'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://caucasus-library.ru'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE_URL}/catalog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/events`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/contacts`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ]

  try {
    const supabase = await createClient()

    // Книги
    const { data: books } = await supabase
      .from('books')
      .select('id, created_at, owner_id')
      .eq('status', 'active')

    const rows = books ?? []

    const bookPages: MetadataRoute.Sitemap = rows.map((book) => ({
      url: `${BASE_URL}/book/${book.id}`,
      lastModified: new Date(book.created_at as string),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }))

    // Продавцы
    const uniqueSellerIds = [...new Set(rows.map((b) => b.owner_id as string).filter(Boolean))]
    const sellerPages: MetadataRoute.Sitemap = uniqueSellerIds.map((id) => ({
      url: `${BASE_URL}/seller/${id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))

    // Электронные книги
    const { data: ebooks } = await supabase
      .from('ebooks')
      .select('id, created_at')
      .eq('status', 'approved')

    const ebookPages: MetadataRoute.Sitemap = (ebooks ?? []).map((ebook) => ({
      url: `${BASE_URL}/book/${ebook.id}`,
      lastModified: new Date(ebook.created_at as string),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }))

    return [...staticPages, ...bookPages, ...ebookPages, ...sellerPages]
  } catch {
    return staticPages
  }
}
