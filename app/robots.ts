import type { MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://kavkazlibrary.ru'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow:    ['/', '/catalog', '/book/', '/seller/', '/events', '/about'],
        disallow: ['/dashboard', '/favorites', '/profile', '/add-book', '/organization', '/auth'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
