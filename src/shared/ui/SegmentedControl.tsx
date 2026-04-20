import { cn } from '@/shared/lib/cn'

export interface SegmentOption<T extends string> {
  value: T
  label: string
}

export interface SegmentedControlProps<T extends string> {
  options: SegmentOption<T>[]
  value: T
  onChange: (value: T) => void
  error?: string
  className?: string
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  error,
  className,
}: SegmentedControlProps<T>) {
  return (
    <div className={cn('flex gap-2', className)} role="group">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          aria-pressed={value === opt.value}
          className={cn(
            'flex-1 h-10 rounded-xl text-sm font-medium border transition-all cursor-pointer',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
            value === opt.value
              ? 'bg-accent text-bg border-accent'
              : error
                ? 'bg-bg border-red-300 text-ash hover:border-red-400'
                : 'bg-bg border-surface2 text-ash hover:border-surface3 hover:text-ink',
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
