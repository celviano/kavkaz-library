import type { Metadata } from 'next'
import { DashboardPage } from '@/pages/dashboard'

export const metadata: Metadata = { title: 'Личный кабинет' }

export default function Page() {
  return <DashboardPage />
}
