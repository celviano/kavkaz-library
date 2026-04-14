import type { Metadata } from 'next'
import { ContactsPage } from '@/pages/contacts'

export const metadata: Metadata = {
  title: 'Контакты',
  description: 'Свяжитесь с командой CaucasusLibrary — email, Telegram, ВКонтакте и канал в MAX.',
}

export default function Page() {
  return <ContactsPage />
}
