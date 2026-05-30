import type { Metadata } from 'next'
import { AboutPage } from '@/pages/about'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://caucasus-library.ru'

export const metadata: Metadata = {
  title: 'О проекте',
  description:
    'caucasusLibrary — единая площадка редких исторических книг о народах и землях Кавказа и Закавказья.',
  alternates: { canonical: `${BASE_URL}/about` },
  openGraph: {
    title: 'О проекте — CaucasusLibrary',
    description: 'caucasusLibrary — единая площадка редких исторических книг о народах и землях Кавказа и Закавказья.',
    url: `${BASE_URL}/about`,
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'CaucasusLibrary' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'О проекте — CaucasusLibrary',
    description: 'caucasusLibrary — единая площадка редких исторических книг о народах и землях Кавказа и Закавказья.',
    images: ['/og-image.png'],
  },
}

export default function Page() {
  return <AboutPage />
}
