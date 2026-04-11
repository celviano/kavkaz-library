import { FormField } from '@/shared/ui/FormField'
import { Input } from '@/shared/ui/Input'
import { FormSection } from '../FormSection'
import type { AddBookValues } from '../../model/types'

interface PublicationSectionProps {
  values:   AddBookValues
  onChange: (field: keyof AddBookValues, value: string) => void
}

export function PublicationSection({ values, onChange }: PublicationSectionProps) {
  return (
    <FormSection title="Сведения об издании">
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Издательство">
          <Input
            placeholder="Тип. Деп. уделов"
            maxLength={200}
            value={values.publisherName}
            onChange={(e) => onChange('publisherName', e.target.value)}
          />
        </FormField>

        <FormField label="Город издания">
          <Input
            placeholder="Санкт-Петербург"
            maxLength={100}
            value={values.publisherCity}
            onChange={(e) => onChange('publisherCity', e.target.value)}
          />
        </FormField>
      </div>

      <FormField label="Издание / выпуск">
        <Input
          placeholder="1-е издание"
          maxLength={100}
          value={values.edition}
          onChange={(e) => onChange('edition', e.target.value)}
        />
      </FormField>
    </FormSection>
  )
}
