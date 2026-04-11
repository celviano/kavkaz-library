import { type FC } from 'react'

interface QuantityInputProps {
  value:    number
  min?:     number
  max?:     number
  onChange: (value: number) => void
}

export const QuantityInput: FC<QuantityInputProps> = ({
  value,
  min = 1,
  max = 99,
  onChange,
}) => (
  <div className="flex items-center gap-3">
    <button
      type="button"
      onClick={() => onChange(Math.max(min, value - 1))}
      className="w-11 h-11 rounded-xl border border-surface2 flex items-center justify-center text-ash hover:text-ink hover:bg-surface2 transition-colors cursor-pointer text-lg font-medium flex-shrink-0"
      aria-label="Уменьшить"
    >
      −
    </button>
    <span className="flex-1 h-11 flex items-center justify-center text-sm font-medium text-ink bg-surface rounded-xl border border-surface2">
      {value}
    </span>
    <button
      type="button"
      onClick={() => onChange(Math.min(max, value + 1))}
      className="w-11 h-11 rounded-xl border border-surface2 flex items-center justify-center text-ash hover:text-ink hover:bg-surface2 transition-colors cursor-pointer text-lg font-medium flex-shrink-0"
      aria-label="Увеличить"
    >
      +
    </button>
  </div>
)
