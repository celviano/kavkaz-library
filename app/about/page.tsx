// app/about/page.tsx
import type { Metadata } from 'next'
import { AboutPage } from '@/pages/about'

export const metadata: Metadata = {
  title: 'О проекте',
  description:
    'caucasusLibrary — единая площадка редких исторических книг о народах и землях Кавказа и Закавказья.',
}

export default function Page() {
  return <AboutPage />
}
