import { FormField } from '@/shared/ui/FormField'
import { Input } from '@/shared/ui/Input'
import { Textarea } from '@/shared/ui/Textarea'
import { Select } from '@/shared/ui/Select'
import { FormSection } from '../FormSection'
import { CATEGORY_OPTIONS, LANGUAGE_OPTIONS } from '../../model/options'
import type { AddBookValues, AddBookSelects } from '../../model/types'
import type { BookCategory } from '@/entities/book/model/types'

interface BasicInfoSectionProps {
  values:        AddBookValues
  selects:       AddBookSelects
  getError:      (field: keyof AddBookValues) => string | undefined
  onChange:      (field: keyof AddBookValues, value: string) => void
  onSelect:      <K extends keyof AddBookSelects>(field: K, value: AddBookSelects[K]) => void
  categoryError: string | null
}

export function BasicInfoSection({
  values, selects, getError, onChange, onSelect, categoryError,
}: BasicInfoSectionProps) {
  return (
    <FormSection title="Основная информация">
      <FormField label="Название" required error={getError('title')}>
        <Input
          placeholder="Например: История Грузии с древнейших времён"
          maxLength={300}
          value={values.title}
          onChange={(e) => onChange('title', e.target.value)}
          error={getError('title')}
        />
      </FormField>

      <FormField label="Автор" required error={getError('author')}>
        <Input
          placeholder="Имя автора"
          maxLength={200}
          value={values.author}
          onChange={(e) => onChange('author', e.target.value)}
          error={getError('author')}
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Год издания" required error={getError('year')}>
          <Input
            type="number" min={1400} max={new Date().getFullYear()}
            placeholder="1871"
            value={values.year}
            onChange={(e) => onChange('year', e.target.value)}
            error={getError('year')}
          />
        </FormField>

        <FormField label="Страниц" error={getError('pages')}>
          <Input
            type="number" min={1} max={9999}
            placeholder="488"
            value={values.pages}
            onChange={(e) => onChange('pages', e.target.value)}
            error={getError('pages')}
          />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Категория" required error={categoryError ?? undefined}>
          <Select
            label="Категория"
            value={selects.category}
            onChange={(v) => onSelect('category', v as BookCategory)}
            placeholder="Выберите категорию"
            options={CATEGORY_OPTIONS}
          />
        </FormField>

        <FormField label="Язык">
          <Select
            label="Язык"
            value={selects.language}
            onChange={(v) => onSelect('language', v)}
            options={LANGUAGE_OPTIONS}
          />
        </FormField>
      </div>

      <FormField
        label="Описание"
        hint="Расскажите о содержании, истории и ценности книги"
        error={getError('description')}
      >
        <Textarea
          rows={4} maxLength={2000}
          placeholder="Краткое описание книги..."
          value={values.description}
          onChange={(e) => onChange('description', e.target.value)}
          error={getError('description')}
        />
      </FormField>

      <FormField
        label="Теги"
        hint="Через запятую: Кавказ, XIX век, этнография"
        error={getError('tags')}
      >
        <Input
          placeholder="Тег 1, Тег 2, Тег 3"
          maxLength={500}
          value={values.tags}
          onChange={(e) => onChange('tags', e.target.value)}
          error={getError('tags')}
        />
      </FormField>
    </FormSection>
  )
}
