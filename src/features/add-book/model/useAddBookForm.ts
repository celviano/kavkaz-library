'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useFormValidation } from '@/shared/hooks/useFormValidation'
import { useSupabaseUpload } from '@/shared/hooks/useSupabaseUpload'
import { addBookAction } from '../actions/addBook.action'
import { addBookRules } from './validation'
import { ADD_BOOK_INITIAL_VALUES, ADD_BOOK_INITIAL_SELECTS } from './types'
import type { AddBookValues, AddBookSelects } from './types'
import type { BookCategory, BookCondition } from '@/entities/book/model/types'

export function useAddBookForm() {
  const router = useRouter()

  const [values,  setValues]  = useState<AddBookValues>(ADD_BOOK_INITIAL_VALUES)
  const [selects, setSelects] = useState<AddBookSelects>(ADD_BOOK_INITIAL_SELECTS)

  const [submitting,     setSubmitting]     = useState(false)
  const [submitError,    setSubmitError]    = useState<string | null>(null)
  const [categoryError,  setCategoryError]  = useState<string | null>(null)

  const { getFieldError, touchField, validateAll } = useFormValidation<AddBookValues>({
    rules: {
      title:       addBookRules.title,
      author:      addBookRules.author,
      year:        addBookRules.year,
      pages:       addBookRules.pages,
      price:       selects.priceType === 'fixed' ? addBookRules.price : [],
      copies:      addBookRules.copies,
      tags:        addBookRules.tags,
      description: addBookRules.description,
    },
  })

  const coverUpload = useSupabaseUpload({
    bucketName: 'book-covers', path: 'user-uploads',
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxFiles: 1, maxFileSize: 5 * 1024 * 1024,
  })

  const imagesUpload = useSupabaseUpload({
    bucketName: 'book-images', path: 'user-uploads',
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxFiles: 9, maxFileSize: 5 * 1024 * 1024,
  })

  function handleChange(field: keyof AddBookValues, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }))
    touchField(field, value)
  }

  function handleSelectChange<K extends keyof AddBookSelects>(
    field: K,
    value: AddBookSelects[K],
  ) {
    setSelects((prev) => ({ ...prev, [field]: value }))
    if (field === 'category') setCategoryError(null)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitError(null)

    if (!selects.category) {
      setCategoryError('Выберите категорию')
      return
    }

    if (!validateAll(values)) return

    setSubmitting(true)

    try {
      let coverUrl  = ''
      let imageUrls: string[] = []

      if (coverUpload.files.some((f) => f.errors.length === 0)) {
        coverUrl = (await coverUpload.onUpload())[0] ?? ''
      }
      if (imagesUpload.files.some((f) => f.errors.length === 0)) {
        imageUrls = await imagesUpload.onUpload()
      }

      await addBookAction({
        title:         values.title,
        author:        values.author,
        year:          parseInt(values.year, 10),
        category:      selects.category as BookCategory,
        description:   values.description,
        pages:         values.pages ? parseInt(values.pages, 10) : null,
        language:      selects.language,
        price:         values.price ? parseFloat(values.price) : null,
        currency:      'RUB',
        priceType:     selects.priceType,
        condition:     selects.condition,
        edition:       values.edition,
        publisherName: values.publisherName,
        publisherCity: values.publisherCity,
        tags:          values.tags,
        coverUrl,
        imageUrls,
        copiesTotal:   parseInt(values.copies || '1', 10),
      })
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Что-то пошло не так')
      setSubmitting(false)
    }
  }

  return {
    values, selects, submitting, submitError, categoryError,
    handleChange, handleSelectChange, handleSubmit,
    getFieldError, coverUpload, imagesUpload,
    cancel: () => router.back(),
  }
}
