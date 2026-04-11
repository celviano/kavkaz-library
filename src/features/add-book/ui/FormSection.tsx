import type { ReactNode } from 'react'

interface FormSectionProps {
  title:    string
  children: ReactNode
}

export function FormSection({ title, children }: FormSectionProps) {
  return (
    <div className="bg-surface border border-surface2 rounded-2xl p-6 flex flex-col gap-5">
      <h2 className="text-[11px] font-medium tracking-[2px] uppercase text-accent">{title}</h2>
      {children}
    </div>
  )
}
