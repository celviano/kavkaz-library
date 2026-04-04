'use client'

import { memo, useState, useRef, useEffect, useId } from 'react'
import { cn } from '@/shared/lib/cn'

export interface SelectOption {
  value: string
  label: string
}

interface SelectProps {
  options: SelectOption[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  required?: boolean
  disabled?: boolean
  className?: string
  name?: string
}

export const Select = memo<SelectProps>(
  ({
    options,
    value,
    onChange,
    placeholder = 'Выберите...',
    label,
    required,
    disabled,
    className,
    name,
  }) => {
    const [open, setOpen] = useState(false)
    const [highlighted, setHighlighted] = useState<number>(-1)
    const containerRef = useRef<HTMLDivElement>(null)
    const listRef = useRef<HTMLUListElement>(null)
    const id = useId()

    const selected = options.find((o) => o.value === value)

    // Close on outside click
    useEffect(() => {
      function handler(e: MouseEvent) {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setOpen(false)
        }
      }
      document.addEventListener('mousedown', handler)
      return () => document.removeEventListener('mousedown', handler)
    }, [])

    // Keyboard navigation
    function handleKeyDown(e: React.KeyboardEvent) {
      if (disabled) return

      switch (e.key) {
        case 'Enter':
        case ' ':
          e.preventDefault()
          if (!open) {
            setOpen(true)
            setHighlighted(options.findIndex((o) => o.value === value))
          } else if (highlighted >= 0) {
            onChange(options[highlighted].value)
            setOpen(false)
          }
          break
        case 'Escape':
          setOpen(false)
          break
        case 'ArrowDown':
          e.preventDefault()
          if (!open) {
            setOpen(true)
            setHighlighted(0)
          } else {
            setHighlighted((h) => Math.min(h + 1, options.length - 1))
          }
          break
        case 'ArrowUp':
          e.preventDefault()
          setHighlighted((h) => Math.max(h - 1, 0))
          break
        case 'Tab':
          setOpen(false)
          break
      }
    }

    // Scroll highlighted item into view
    useEffect(() => {
      if (!open || highlighted < 0) return
      const item = listRef.current?.children[highlighted] as HTMLElement | undefined
      item?.scrollIntoView({ block: 'nearest' })
    }, [highlighted, open])

    function select(val: string) {
      onChange(val)
      setOpen(false)
    }

    return (
      <div ref={containerRef} className={cn('relative', className)}>
        {/* Hidden native input for form submission */}
        <input type="hidden" name={name} value={value} required={required} />

        {/* Trigger */}
        <button
          type="button"
          id={id}
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-controls={`${id}-listbox`}
          aria-label={label}
          disabled={disabled}
          onClick={() => !disabled && setOpen((v) => !v)}
          onKeyDown={handleKeyDown}
          className={cn(
            'w-full h-11 flex items-center justify-between gap-2',
            'rounded-xl border px-4 text-sm',
            'outline-none cursor-pointer select-none',
            'transition-all duration-150',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
            open
              ? 'border-accent/50 bg-bg ring-2 ring-accent/10'
              : 'border-surface2 bg-bg hover:border-surface3',
            disabled && 'opacity-50 cursor-not-allowed',
            selected ? 'text-ink' : 'text-dim',
          )}
        >
          <span className="truncate">{selected?.label ?? placeholder}</span>

          {/* Chevron */}
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className={cn(
              'flex-shrink-0 text-ash transition-transform duration-200',
              open && 'rotate-180',
            )}
            aria-hidden="true"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {/* Dropdown */}
        {open && (
          <ul
            ref={listRef}
            id={`${id}-listbox`}
            role="listbox"
            aria-label={label}
            className={cn(
              'absolute z-50 mt-1.5 w-full',
              'bg-bg border border-surface2 rounded-xl',
              'shadow-accent py-1 overflow-y-auto',
              'max-h-56',
              // animate in
              'animate-in fade-in-0 zoom-in-95 duration-100',
            )}
          >
            {options.map((option, i) => {
              const isSelected = option.value === value
              const isHighlighted = i === highlighted

              return (
                <li
                  key={option.value}
                  role="option"
                  aria-selected={isSelected}
                  onMouseEnter={() => setHighlighted(i)}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    select(option.value)
                  }}
                  className={cn(
                    'flex items-center justify-between gap-2',
                    'mx-1 px-3 py-2.5 rounded-lg text-sm cursor-pointer',
                    'transition-colors duration-100',
                    isHighlighted && !isSelected && 'bg-surface text-ink',
                    isSelected ? 'bg-accent/10 text-accent font-medium' : 'text-text',
                  )}
                >
                  <span>{option.label}</span>

                  {/* Check mark for selected */}
                  {isSelected && (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      className="flex-shrink-0 text-accent"
                      aria-hidden="true"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </div>
    )
  },
)

Select.displayName = 'Select'
