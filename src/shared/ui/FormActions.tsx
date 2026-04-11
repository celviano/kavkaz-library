import { type ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

interface FormActionsProps {
  submitLabel?:    string
  cancelLabel?:    string
  submitting?:     boolean
  submittingLabel?: string
  onCancel?:       () => void
  className?:      string
  align?:          'left' | 'right'
  children?:       ReactNode   // for extra actions
}

export function FormActions({
  submitLabel     = 'Сохранить',
  cancelLabel     = 'Отмена',
  submitting      = false,
  submittingLabel = 'Сохраняем...',
  onCancel,
  className,
  align = 'right',
  children,
}: FormActionsProps) {
  return (
    <div className={cn(
      'flex gap-3',
      align === 'right' ? 'justify-end' : 'justify-start',
      className,
    )}>
      {children}

      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="h-11 px-6 rounded-xl text-sm font-medium border border-surface2 text-ash hover:text-ink hover:bg-surface transition-all cursor-pointer"
        >
          {cancelLabel}
        </button>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="h-11 px-8 rounded-xl text-sm font-medium bg-accent text-bg border border-accent hover:bg-accent2 shadow-accent-sm hover:shadow-accent transition-all cursor-pointer disabled:opacity-60 disabled:cursor-wait"
      >
        {submitting ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full border-2 border-bg/30 border-t-bg animate-spin" />
            {submittingLabel}
          </span>
        ) : submitLabel}
      </button>
    </div>
  )
}
