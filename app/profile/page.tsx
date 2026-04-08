import type { Metadata } from 'next'
import { ProfilePage } from '@/pages/profile'

export const metadata: Metadata = { title: 'Профиль', robots: { index: false } }

export default function Page() {
  return <ProfilePage />
}
