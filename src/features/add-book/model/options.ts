import { CATEGORIES, CATEGORY_LABELS } from '@/shared/config/constants'
import { CONDITION_LABELS } from '@/entities/book/model/types'
import type { BookCondition } from '@/entities/book/model/types'

export const LANGUAGE_OPTIONS = [
  { value: 'Русский',         label: 'Русский' },
  { value: 'Грузинский',      label: 'Грузинский' },
  { value: 'Армянский',       label: 'Армянский' },
  { value: 'Азербайджанский', label: 'Азербайджанский' },
  { value: 'Другой',          label: 'Другой' },
]

export const CATEGORY_OPTIONS = CATEGORIES.map((cat) => ({
  value: cat,
  label: CATEGORY_LABELS[cat],
}))

export const CONDITION_OPTIONS = (
  Object.entries(CONDITION_LABELS) as [BookCondition, string][]
).map(([value, label]) => ({ value, label }))

export const PRICE_TYPE_OPTIONS = [
  { value: 'fixed'      as const, label: 'Фиксированная' },
  { value: 'negotiable' as const, label: 'Договорная'     },
  { value: 'exchange'   as const, label: 'Обмен'          },
]
