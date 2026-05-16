'use client'

import { memo, useState } from 'react'

import { cn } from '@/shared/lib/cn'

interface AccordionItem {
  question: string
  answer: string
}

interface AccordionProps {
  items: AccordionItem[]
  className?: string
}

export const Accordion = memo<AccordionProps>(({ items, className }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  function handleToggle(index: number) {
    setOpenIndex((prev) => (prev === index ? null : index))
  }

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {items.map((item, index) => {
        const isOpen = openIndex === index
        return (
          <div
            key={index}
            className={cn(
              'bg-bg border rounded-2xl overflow-hidden transition-colors duration-200',
              isOpen ? 'border-accent/30' : 'border-surface2 hover:border-surface3',
            )}
          >
            <button
              type="button"
              onClick={() => handleToggle(index)}
              className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left cursor-pointer"
              aria-expanded={isOpen}
            >
              <span
                className={cn(
                  'text-sm font-medium transition-colors duration-200',
                  isOpen ? 'text-accent' : 'text-ink',
                )}
              >
                {item.question}
              </span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={cn(
                  'shrink-0 transition-all duration-300',
                  isOpen ? 'text-accent rotate-180' : 'text-ash',
                )}
                aria-hidden="true"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            <div
              className="grid transition-[grid-template-rows] duration-300 ease-in-out"
              style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
            >
              <div className="overflow-hidden">
                <p className="px-6 pb-5 pt-1 text-sm text-ash leading-relaxed border-t border-surface2">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
})

Accordion.displayName = 'Accordion'
