import type { BookCategory, BookCondition } from '@/entities/book/model/types'

export interface AddBookValues {
  title:         string
  author:        string
  year:          string
  pages:         string
  description:   string
  tags:          string
  price:         string
  copies:        string
  publisherName: string
  publisherCity: string
  edition:       string
}

export const ADD_BOOK_INITIAL_VALUES: AddBookValues = {
  title: '', author: '', year: '', pages: '',
  description: '', tags: '', price: '',
  copies: '1', publisherName: '', publisherCity: '', edition: '',
}

export interface AddBookSelects {
  priceType: 'fixed' | 'negotiable' | 'exchange'
  category:  BookCategory | ''
  language:  string
  condition: BookCondition
}

export const ADD_BOOK_INITIAL_SELECTS: AddBookSelects = {
  priceType: 'fixed',
  category:  '',
  language:  'Русский',
  condition: 'good',
}
