import { type FC } from 'react'
import { cn } from '@/shared/lib/cn'
import type { DeliveryType } from '@/shared/lib/supabase/queries/orders'

const SdekLogo: FC = () => (
  <svg width="48" height="20" viewBox="0 0 120 40" fill="none" aria-label="СДЭК">
    <rect width="120" height="40" rx="6" fill="#00B140"/>
    <text x="60" y="27" textAnchor="middle" fill="white" fontSize="18" fontWeight="700" fontFamily="Arial, sans-serif">СДЭК</text>
  </svg>
)

const PochtaLogo: FC = () => (
  <svg width="48" height="20" viewBox="0 0 120 40" fill="none" aria-label="Почта России">
    <rect width="120" height="40" rx="6" fill="#0F5FA6"/>
    <text x="60" y="18" textAnchor="middle" fill="white" fontSize="9" fontWeight="600" fontFamily="Arial, sans-serif">ПОЧТА</text>
    <text x="60" y="32" textAnchor="middle" fill="white" fontSize="9" fontWeight="600" fontFamily="Arial, sans-serif">РОССИИ</text>
  </svg>
)

const OPTIONS: { type: DeliveryType; label: string; desc: string; Logo: FC }[] = [
  { type: 'sdek',   label: 'СДЭК',        desc: 'Доставка 3–7 дней',  Logo: SdekLogo },
  { type: 'pochta', label: 'Почта России', desc: 'Доставка 7–14 дней', Logo: PochtaLogo },
]

interface DeliveryPickerProps {
  value:    DeliveryType
  onChange: (type: DeliveryType) => void
}

export const DeliveryPicker: FC<DeliveryPickerProps> = ({ value, onChange }) => (
  <div className="grid grid-cols-2 gap-3">
    {OPTIONS.map(({ type, label, desc, Logo }) => {
      const active = value === type
      return (
        <button
          key={type}
          type="button"
          onClick={() => onChange(type)}
          aria-pressed={active}
          className={cn(
            'flex flex-col gap-3 p-4 rounded-2xl border text-left transition-all cursor-pointer',
            'focus-visible:outline-2 focus-visible:outline-accent',
            active
              ? 'border-accent bg-accent/6 shadow-accent-sm'
              : 'border-surface2 bg-surface hover:border-surface3',
          )}
        >
          <div className="flex items-center justify-between">
            <Logo />
            <span className={cn(
              'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors',
              active ? 'border-accent bg-accent' : 'border-surface3 bg-bg',
            )}>
              {active && (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              )}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-ink">{label}</p>
            <p className="text-xs text-ash mt-0.5">{desc}</p>
          </div>
        </button>
      )
    })}
  </div>
)
