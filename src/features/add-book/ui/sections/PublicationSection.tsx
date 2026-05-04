import { FormField } from '@/shared/ui/FormField'
import { Input } from '@/shared/ui/Input'
import { FormSection } from '../FormSection'
import type { UseFormReturn } from 'react-hook-form'
import type { AddPhysicalBookValues } from '@/shared/lib/zod/schemas'

interface PublicationSectionProps {
  form: UseFormReturn<AddPhysicalBookValues>
}

export function PublicationSection({ form }: PublicationSectionProps) {
  const { register } = form

  return (
    <FormSection title="Сведения об издании">
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Издательство">
          <Input placeholder="Тип. Деп. уделов" maxLength={200} {...register('publisherName')} />
        </FormField>
        <FormField label="Город издания">
          <Input placeholder="Санкт-Петербург" maxLength={100} {...register('publisherCity')} />
        </FormField>
      </div>
      <FormField label="Издание / выпуск">
        <Input placeholder="1-е издание" maxLength={100} {...register('edition')} />
      </FormField>
    </FormSection>
  )
}
