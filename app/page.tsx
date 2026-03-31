import type { Metadata } from 'next'
import { HomePage } from '@/pages/home'

export const metadata: Metadata = {
  title: 'KavkazLibrary — Исторические книги о Кавказе',
}

export default function Page() {
  return <HomePage />
}
