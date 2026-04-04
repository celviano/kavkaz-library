import type { Metadata } from 'next'
import { EventsPage } from '@/pages/events'

export const metadata: Metadata = {
  title: 'События',
  description: 'Лекции, встречи, выставки и экскурсии об истории и культуре Кавказа',
}

export default function Page() {
  return <EventsPage />
}
