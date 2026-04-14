import type { Metadata } from 'next'
import { Crimson_Pro, Inter } from 'next/font/google'
import { Header } from '@/widgets/header'
import { Footer } from '@/widgets/footer'
import { QueryProvider } from '@/app/providers/QueryProvider'
import { AuthProvider } from '@/app/providers/AuthProvider'
import { JsonLd } from '@/shared/ui/JsonLd'

import '@/app/styles/globals.css'

const crimson = Crimson_Pro({
  subsets: ['latin', 'latin-ext'],
  weight:  ['300', '400', '600'],
  style:   ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin', 'latin-ext', 'cyrillic'],
  variable: '--font-sans',
  display: 'swap',
})

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://caucasuslibrary.ru'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default:  'caucasusLibrary — Исторические книги о Кавказе',
    template: '%s | caucasusLibrary',
  },
  description: 'Каталог редких исторических книг, атласов и мемуаров о народах и землях Кавказа и Закавказья.',
  keywords: ['Кавказ', 'история', 'книги', 'Закавказье', 'этнография', 'атласы', 'мемуары'],
  authors: [{ name: 'caucasusLibrary' }],
  icons: {
    icon: [
      { url: '/favicon.ico',       sizes: '32x32', type: 'image/x-icon' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.svg',       type: 'image/svg+xml' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  manifest: '/site.webmanifest',
  openGraph: {
    type:      'website',
    locale:    'ru_RU',
    url:       BASE_URL,
    siteName:  'caucasusLibrary',
    title:     'caucasusLibrary — Исторические книги о Кавказе',
    description: 'Собрание редких исторических книг, атласов, мемуаров и этнографических трудов о народах Кавказского региона.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'caucasusLibrary' }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'caucasusLibrary — Исторические книги о Кавказе',
    description: 'Собрание редких исторических книг, атласов, мемуаров и этнографических трудов о народах Кавказского региона.',
    images:      ['/og-image.png'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className={`${crimson.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col bg-bg text-text antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-bg focus:text-sm focus:font-medium"
        >
          Перейти к содержимому
        </a>
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type':    'Organization',
            name:       'caucasusLibrary',
            url:        BASE_URL,
            logo:       `${BASE_URL}/og-image.png`,
            description: 'Маркетплейс исторических книг о Кавказе и Закавказье. Редкие книги, атласы, мемуары и этнографические труды.',
            sameAs:     [],
          }}
        />
        <QueryProvider>
          <AuthProvider>
            <Header />
            {children}
            <Footer />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
