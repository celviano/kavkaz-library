import type { Metadata } from 'next'
import { EventsPage } from '@/pages/events'
import { JsonLd } from '@/shared/ui/JsonLd'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://kavkazlibrary.ru'

export const metadata: Metadata = {
  title:       'События',
  description: 'Лекции, встречи, выставки и экскурсии об истории и культуре Кавказа',
}

export default function Page() {
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type':    'CollectionPage',
          name:       'События — KavkazLibrary',
          description: 'Лекции, встречи, выставки и экскурсии об истории и культуре Кавказа.',
          url:        `${BASE_URL}/events`,
          isPartOf:   { '@type': 'WebSite', name: 'KavkazLibrary', url: BASE_URL },
        }}
      />
      <EventsPage />
    </>
  )
}
