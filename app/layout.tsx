import type { Metadata } from 'next'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import '../src/app/styles/globals.css'
import { Header } from '@/widgets/header'
import { Footer } from '@/widgets/footer'

const cormorant = Cormorant_Garamond({
  subsets: ['latin', 'latin-ext', 'cyrillic'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin', 'latin-ext', 'cyrillic'],
  variable: '--font-sans',
  display: 'swap',
})

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://kavkazlibrary.ru'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'KavkazLibrary — Исторические книги о Кавказе',
    template: '%s | KavkazLibrary',
  },
  description:
    'Каталог редких исторических книг, атласов и мемуаров о народах и землях Кавказа и Закавказья.',
  keywords: [
    'Кавказ',
    'история',
    'книги',
    'Закавказье',
    'этнография',
    'атласы',
    'мемуары',
  ],
  authors: [{ name: 'KavkazLibrary' }],
  creator: 'KavkazLibrary',

  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },

  manifest: '/site.webmanifest',

  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: BASE_URL,
    siteName: 'KavkazLibrary',
    title: 'KavkazLibrary — Исторические книги о Кавказе',
    description:
      'Собрание редких исторических книг, атласов, мемуаров и этнографических трудов о народах Кавказского региона.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'KavkazLibrary — каталог исторических книг о Кавказе',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'KavkazLibrary — Исторические книги о Кавказе',
    description:
      'Каталог редких исторических книг, атласов и мемуаров о народах Кавказа.',
    images: ['/og-image.png'],
  },

  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col bg-bg text-text antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-bg focus:text-sm focus:font-medium"
        >
          Перейти к содержимому
        </a>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}
