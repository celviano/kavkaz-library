import type { Metadata } from 'next'
import { HomePage } from '@/pages/home'

export const metadata: Metadata = {
  title: 'caucasusLibrary — Исторические книги о Кавказе',
}

export default function Page() {
  return <HomePage />
}
