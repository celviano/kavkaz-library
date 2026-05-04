import { Controller } from 'react-hook-form'
import { FormField } from '@/shared/ui/FormField'
import { Input } from '@/shared/ui/Input'
import { Select } from '@/shared/ui/Select'
import { SegmentedControl } from '@/shared/ui/SegmentedControl'
import { FormSection } from '../FormSection'
import { PRICE_TYPE_OPTIONS, CONDITION_OPTIONS } from '../../model/options'
import type { UseFormReturn } from 'react-hook-form'
import type { AddPhysicalBookValues } from '@/shared/lib/zod/schemas'
import type { BookCondition } from '@/entities/book/model/types'

interface SaleSectionProps {
  form: UseFormReturn<AddPhysicalBookValues>
}

export function SaleSection({ form }: SaleSectionProps) {
  const { register, control, watch, formState: { errors } } = form
  const priceType = watch('priceType')

  return (
    <FormSection title="Продажа">
      <FormField label="Тип цены" required>
        <Controller
          control={control}
          name="priceType"
          render={({ field }) => (
            <SegmentedControl
              options={PRICE_TYPE_OPTIONS}
              value={field.value ?? 'fixed'}
              onChange={field.onChange}
            />
          )}
        />
      </FormField>

      {priceType === 'fixed' && (
        <FormField label="Цена (₽)" required error={errors.price?.message}>
          <Input
            type="number" min={0} max={9999999} step={50}
            placeholder="1500"
            error={errors.price?.message}
            {...register('price')}
          />
        </FormField>
      )}

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Состояние" required>
          <Controller
            control={control}
            name="condition"
            render={({ field }) => (
              <Select
                label="Состояние"
                value={field.value ?? 'good'}
                onChange={(v) => field.onChange(v as BookCondition)}
                options={CONDITION_OPTIONS}
              />
            )}
          />
        </FormField>

        <FormField label="Количество экземпляров" error={errors.copies?.message}>
          <Input
            type="number" min={1} max={99}
            {...register('copies')}
          />
        </FormField>
      </div>
    </FormSection>
  )
}
