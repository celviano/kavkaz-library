'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { memo, Suspense, useCallback, useEffect, useRef, useState } from 'react'

import { TopProgressBar } from '@/shared/ui/TopProgressBar'

function NavigationProgressInner() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isVisible, setIsVisible] = useState(false)
  const [progress, setProgress] = useState(0)

  const completionTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const incrementTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isMounted = useRef(false)
  const isNavigating = useRef(false)

  const clearTimers = useCallback(() => {
    if (completionTimer.current) clearTimeout(completionTimer.current)
    if (incrementTimer.current) clearTimeout(incrementTimer.current)
  }, [])

  const startProgress = useCallback(() => {
    if (isNavigating.current) return
    isNavigating.current = true

    clearTimers()
    setProgress(0)
    setIsVisible(true)

    let current = 0
    const tick = () => {
      const remaining = 82 - current
      const step = remaining * 0.18 + Math.random() * 4
      current = Math.min(current + step, 82)
      setProgress(current)

      if (current < 82) {
        incrementTimer.current = setTimeout(tick, 180 + Math.random() * 160)
      }
    }
    incrementTimer.current = setTimeout(tick, 80)
  }, [clearTimers])

  const completeProgress = useCallback(() => {
    if (!isNavigating.current) return
    isNavigating.current = false

    clearTimers()
    setProgress(100)

    completionTimer.current = setTimeout(() => {
      setIsVisible(false)
      setProgress(0)
    }, 450)
  }, [clearTimers])

  // Intercept anchor clicks to start the bar
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest('a')
      if (!anchor) return

      const href = anchor.getAttribute('href')
      if (!href || !href.startsWith('/') || href.startsWith('//')) return

      // Skip same-page anchor links
      if (href.includes('#')) return

      const currentFull =
        pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '')

      if (href !== currentFull) {
        startProgress()
      }
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [pathname, searchParams, startProgress])

  // Complete on route change
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true
      return
    }
    completeProgress()
  }, [pathname, searchParams, completeProgress])

  useEffect(() => () => clearTimers(), [clearTimers])

  return <TopProgressBar isVisible={isVisible} progress={progress} />
}

export const NavigationProgress = memo(function NavigationProgress() {
  return (
    <Suspense fallback={null}>
      <NavigationProgressInner />
    </Suspense>
  )
})
