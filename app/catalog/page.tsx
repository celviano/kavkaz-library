import type { Metadata } from 'next'
import { CatalogPage } from '@/pages/catalog'
import { JsonLd } from '@/shared/ui/JsonLd'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://kavkazlibrary.ru'

export const metadata: Metadata = {
  title:       'Каталог книг',
  description: 'Редкие исторические книги о Кавказе и Закавказье — покупка, обмен, коллекционирование.',
}

export default function Page() {
  return (
    <>
      <JsonLd
        data={{
          '@context':       'https://schema.org',
          '@type':          'CollectionPage',
          name:             'Каталог книг — KavkazLibrary',
          description:      'Редкие исторические книги о Кавказе и Закавказье.',
          url:              `${BASE_URL}/catalog`,
          isPartOf:         { '@type': 'WebSite', name: 'KavkazLibrary', url: BASE_URL },
        }}
      />
      <CatalogPage />
    </>
  )
}
