'use client'

import { memo } from 'react'
import { cn } from '@/shared/lib/cn'
import { FormSection } from '../FormSection'
import type { CopyrightType } from '@/entities/ebook/model/types'

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

interface CopyrightSectionProps {
  value: CopyrightType
  confirmed: boolean
  onChange: (value: CopyrightType) => void
  onConfirm: (confirmed: boolean) => void
  error?: string
}

export const CopyrightSection = memo<CopyrightSectionProps>(
  ({ value, confirmed, onChange, onConfirm, error }) => {
    return (
      <FormSection title="Авторские права">
        <div className="flex flex-col gap-3">
          <p className="text-xs text-ash leading-relaxed">
            Загружайте только книги, которые вы имеете право распространять. Нарушение
            авторских прав может повлечь удаление материала.
          </p>

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
                {/* Radio dot */}
                <span
                  className={cn(
                    'mt-0.5 w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all',
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

          {/* Confirm checkbox */}
          <label
            className={cn(
              'flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all',
              confirmed ? 'border-accent/40 bg-accent/5' : 'border-surface2 bg-surface',
              error && !confirmed && 'border-red-400/60',
            )}
          >
            <span
              className={cn(
                'mt-0.5 w-4 h-4 rounded flex-shrink-0 border-2 flex items-center justify-center transition-all',
                confirmed ? 'border-accent bg-accent' : 'border-surface3',
              )}
            >
              {confirmed && (
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                  <polyline
                    points="2,6 5,9 10,3"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </span>
            <input
              type="checkbox"
              className="sr-only"
              checked={confirmed}
              onChange={(e) => onConfirm(e.target.checked)}
            />
            <p className="text-sm text-ink leading-snug">
              Я подтверждаю, что имею право распространять данное произведение, и несу
              ответственность за соблюдение авторских прав
            </p>
          </label>

          {error && !confirmed && <p className="text-xs text-red-500">{error}</p>}
        </div>
      </FormSection>
    )
  },
)

CopyrightSection.displayName = 'CopyrightSection'
