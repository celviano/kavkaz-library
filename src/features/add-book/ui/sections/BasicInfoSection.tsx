import { Controller } from 'react-hook-form'
import { FormField } from '@/shared/ui/FormField'
import { Input } from '@/shared/ui/Input'
import { Textarea } from '@/shared/ui/Textarea'
import { Select } from '@/shared/ui/Select'
import { FormSection } from '../FormSection'
import { CATEGORY_OPTIONS, LANGUAGE_OPTIONS } from '../../model/options'
import type { UseFormReturn } from 'react-hook-form'
import type { AddPhysicalBookValues } from '@/shared/lib/zod/schemas'

interface BasicInfoSectionProps {
  form: UseFormReturn<AddPhysicalBookValues>
}

export function BasicInfoSection({ form }: BasicInfoSectionProps) {
  const { register, control, formState: { errors } } = form

  return (
    <FormSection title="Основная информация">
      <FormField label="Название" required error={errors.title?.message}>
        <Input
          placeholder="Например: История Грузии с древнейших времён"
          maxLength={300}
          error={errors.title?.message}
          {...register('title')}
        />
      </FormField>

      <FormField label="Автор" required error={errors.author?.message}>
        <Input
          placeholder="Имя автора"
          maxLength={200}
          error={errors.author?.message}
          {...register('author')}
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Год издания" required error={errors.year?.message}>
          <Input
            type="number" min={1400} max={new Date().getFullYear()}
            placeholder="1871"
            error={errors.year?.message}
            {...register('year')}
          />
        </FormField>

        <FormField label="Страниц" error={errors.pages?.message}>
          <Input
            type="number" min={1} max={9999}
            placeholder="488"
            {...register('pages')}
          />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Категория" required error={errors.category?.message}>
          <Controller
            control={control}
            name="category"
            render={({ field }) => (
              <Select
                label="Категория"
                value={field.value ?? ''}
                onChange={field.onChange}
                placeholder="Выберите категорию"
                options={CATEGORY_OPTIONS}
              />
            )}
          />
        </FormField>

        <FormField label="Язык">
          <Controller
            control={control}
            name="language"
            render={({ field }) => (
              <Select
                label="Язык"
                value={field.value ?? 'Русский'}
                onChange={field.onChange}
                options={LANGUAGE_OPTIONS}
              />
            )}
          />
        </FormField>
      </div>

      <FormField label="Описание" hint="Расскажите о содержании, истории и ценности книги" error={errors.description?.message}>
        <Textarea
          rows={4} maxLength={2000}
          placeholder="Краткое описание книги..."
          {...register('description')}
        />
      </FormField>

      <FormField label="Теги" hint="Через запятую: Кавказ, XIX век, этнография">
        <Input
          placeholder="Тег 1, Тег 2, Тег 3"
          maxLength={500}
          {...register('tags')}
        />
      </FormField>
    </FormSection>
  )
}
