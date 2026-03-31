import type { Metadata } from 'next'
import { CatalogPage } from '@/pages/catalog'

export const metadata: Metadata = {
  title: 'Каталог книг',
}

export default function Page() {
  return <CatalogPage />
}
