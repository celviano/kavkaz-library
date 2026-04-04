import { type FC } from 'react'
import { cn } from '@/shared/lib/cn'

interface SkeletonProps {
  className?: string
}

export const Skeleton: FC<SkeletonProps> = ({ className }) => (
  <div className={cn('bg-surface animate-pulse rounded-xl', className)} />
)

export const BookCardSkeleton: FC = () => (
  <div className="rounded-2xl bg-surface border border-surface2 overflow-hidden animate-pulse">
    <div className="aspect-[3/4] bg-surface2" />
    <div className="p-4 flex flex-col gap-2">
      <div className="h-4 bg-surface2 rounded-full w-1/2" />
      <div className="h-3 bg-surface2 rounded-full w-3/4" />
      <div className="h-3 bg-surface2 rounded-full w-1/3" />
    </div>
  </div>
)
