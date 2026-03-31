import type { Metadata } from 'next'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import '../src/app/styles/globals.css'
import { Header } from '@/widgets/header'
import { Footer } from '@/widgets/footer'

// Display font — for headings and logo
const cormorant = Cormorant_Garamond({
  subsets: ['latin', 'latin-ext', 'cyrillic'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
})

// Body font — clean, readable
const inter = Inter({
  subsets: ['latin', 'latin-ext', 'cyrillic'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'KavkazLibrary — Исторические книги о Кавказе',
    template: '%s | KavkazLibrary',
  },
  description:
    'Каталог редких исторических книг, атласов и мемуаров о народах и землях Кавказа и Закавказья.',
  keywords: ['Кавказ', 'история', 'книги', 'Закавказье', 'этнография'],
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
