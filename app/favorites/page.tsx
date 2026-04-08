import type { Metadata } from 'next'
import { FavoritesPage } from '@/pages/favorites'

export const metadata: Metadata = { title: 'Избранное', robots: { index: false } }

export default function Page() {
  return <FavoritesPage />
}
