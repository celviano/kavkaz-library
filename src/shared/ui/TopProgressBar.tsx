'use client'

import { memo } from 'react'

interface TopProgressBarProps {
  isVisible: boolean
  progress: number
}

export const TopProgressBar = memo(function TopProgressBar({
  isVisible,
  progress,
}: TopProgressBarProps) {
  return (
    <div
      role="progressbar"
      aria-hidden={!isVisible}
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      className="fixed top-0 left-0 right-0 z-[9999] h-[3px] pointer-events-none"
      style={{
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 300ms ease',
      }}
    >
      <div
        className="h-full"
        style={{
          width: `${progress}%`,
          background:
            'linear-gradient(to right, var(--color-accent), var(--color-accent2), var(--color-gold))',
          boxShadow: '0 0 10px var(--color-accent), 0 0 4px var(--color-gold2)',
          transition:
            progress === 0
              ? 'none'
              : progress === 100
                ? 'width 200ms ease-out'
                : 'width 500ms cubic-bezier(0.1, 0.4, 0.6, 1)',
          borderRadius: '0 2px 2px 0',
        }}
      />
    </div>
  )
})
