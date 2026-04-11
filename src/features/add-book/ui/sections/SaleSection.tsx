import { FormField } from '@/shared/ui/FormField'
import { Input } from '@/shared/ui/Input'
import { Select } from '@/shared/ui/Select'
import { SegmentedControl } from '@/shared/ui/SegmentedControl'
import { FormSection } from '../FormSection'
import { PRICE_TYPE_OPTIONS, CONDITION_OPTIONS } from '../../model/options'
import type { AddBookValues, AddBookSelects } from '../../model/types'
import type { BookCondition } from '@/entities/book/model/types'

interface SaleSectionProps {
  values:   AddBookValues
  selects:  AddBookSelects
  getError: (field: keyof AddBookValues) => string | undefined
  onChange: (field: keyof AddBookValues, value: string) => void
  onSelect: <K extends keyof AddBookSelects>(field: K, value: AddBookSelects[K]) => void
}

export function SaleSection({ values, selects, getError, onChange, onSelect }: SaleSectionProps) {
  return (
    <FormSection title="Продажа">
      <FormField label="Тип цены" required>
        <SegmentedControl
          options={PRICE_TYPE_OPTIONS}
          value={selects.priceType}
          onChange={(v) => onSelect('priceType', v)}
        />
      </FormField>

      {selects.priceType === 'fixed' && (
        <FormField label="Цена (₽)" required error={getError('price')}>
          <Input
            type="number" min={0} max={9999999} step={50}
            placeholder="1500"
            value={values.price}
            onChange={(e) => onChange('price', e.target.value)}
            error={getError('price')}
          />
        </FormField>
      )}

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Состояние" required>
          <Select
            label="Состояние"
            value={selects.condition}
            onChange={(v) => onSelect('condition', v as BookCondition)}
            options={CONDITION_OPTIONS}
          />
        </FormField>

        <FormField label="Количество экземпляров" error={getError('copies')}>
          <Input
            type="number" min={1} max={99}
            value={values.copies}
            onChange={(e) => onChange('copies', e.target.value)}
            error={getError('copies')}
          />
        </FormField>
      </div>
    </FormSection>
  )
}
