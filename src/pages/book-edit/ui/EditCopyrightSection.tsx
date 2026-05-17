'use client'

import { memo } from 'react'

import type { CopyrightType } from '@/entities/ebook/model/types'
import { FormSection } from '@/features/add-book/ui/FormSection'
import { cn } from '@/shared/lib/cn'

const COPYRIGHT_OPTIONS: { value: CopyrightType; label: string; desc: string }[] = [
  {
    value: 'public_domain',
    label: 'Общественное достояние',
    desc: 'Автор умер более 70 лет назад (например, классики XIX века)',
  },
  {
    value: 'own_work',
    label: 'Собственное произведение',
    desc: 'Я являюсь автором или соавтором этого материала',
  },
  {
    value: 'permitted',
    label: 'Имею разрешение',
    desc: 'Правообладатель дал письменное согласие на распространение',
  },
]

interface EditCopyrightSectionProps {
  value: CopyrightType
  onChange: (value: CopyrightType) => void
}

export const EditCopyrightSection = memo<EditCopyrightSectionProps>(
  ({ value, onChange }) => {
    return (
      <FormSection title="Авторские права">
        <div className="flex flex-col gap-2">
          {COPYRIGHT_OPTIONS.map(({ value: v, label, desc }) => (
            <button
              key={v}
              type="button"
              onClick={() => onChange(v)}
              className={cn(
                'flex items-start gap-3 p-4 rounded-xl border text-left transition-all',
                value === v
                  ? 'border-accent/40 bg-accent/5'
                  : 'border-surface2 bg-surface hover:border-accent/25',
              )}
            >
              <span
                className={cn(
                  'mt-0.5 w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center transition-all',
                  value === v ? 'border-accent' : 'border-surface3',
                )}
              >
                {value === v && <span className="w-2 h-2 rounded-full bg-accent" />}
              </span>
              <div>
                <p className="text-sm font-medium text-ink">{label}</p>
                <p className="text-xs text-ash mt-0.5">{desc}</p>
              </div>
            </button>
          ))}
        </div>
      </FormSection>
    )
  },
)

EditCopyrightSection.displayName = 'EditCopyrightSection'
