import { type FC, type ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

interface ContainerProps {
  children: ReactNode
  className?: string
}

export const Container: FC<ContainerProps> = ({ children, className }) => {
  return (
    <div
      className={cn(
        'mx-auto w-full',
        'px-6 md:px-10 lg:px-16',
        'max-w-7xl',
        className,
      )}
    >
      {children}
    </div>
  )
}
