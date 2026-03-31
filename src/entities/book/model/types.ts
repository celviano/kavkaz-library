export type BookCategory =
  | 'history'
  | 'geography'
  | 'ethnography'
  | 'memoirs'
  | 'atlases'
  | 'other'

export interface Book {
  id: string
  title: string
  author: string
  year: number
  category: BookCategory
  coverUrl: string
  description: string
  pages: number
  language: string
  available: boolean
}
