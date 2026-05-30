import type { Metadata } from 'next'
import { ContactsPage } from '@/pages/contacts'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://caucasus-library.ru'

export const metadata: Metadata = {
  title: 'Контакты',
  description:
    'Свяжитесь с командой CaucasusLibrary — email, Telegram, ВКонтакте и канал в MAX.',
  alternates: { canonical: `${BASE_URL}/contacts` },
  openGraph: {
    title: 'Контакты — CaucasusLibrary',
    description: 'Свяжитесь с командой CaucasusLibrary — email, Telegram, ВКонтакте и канал в MAX.',
    url: `${BASE_URL}/contacts`,
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'CaucasusLibrary' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Контакты — CaucasusLibrary',
    description: 'Свяжитесь с командой CaucasusLibrary — email, Telegram, ВКонтакте и канал в MAX.',
    images: ['/og-image.png'],
  },
}

export default function Page() {
  return <ContactsPage />
}
