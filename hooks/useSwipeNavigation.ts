import { useCallback, useRef } from "react"

interface SwipeCallbacks {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
}

interface SwipeNavigation {
  onTouchStart: (e: React.TouchEvent) => void
  onTouchMove: (e: React.TouchEvent) => void
  onTouchEnd: () => void
}

const SWIPE_THRESHOLD = 50 // Minimum distance in pixels to trigger swipe

export function useSwipeNavigation({ onSwipeLeft, onSwipeRight }: SwipeCallbacks): SwipeNavigation {
  const touchStartX = useRef<number>(0)
  const touchEndX = useRef<number>(0)

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX
  }, [])

  const handleTouchEnd = useCallback(() => {
    const distance = touchStartX.current - touchEndX.current
    const isSwipe = Math.abs(distance) > SWIPE_THRESHOLD

    if (!isSwipe) return

    if (distance > 0) {
      // Swiped left - show next month(s)
      onSwipeLeft?.()
    } else {
      // Swiped right - show previous month(s)
      onSwipeRight?.()
    }
  }, [onSwipeLeft, onSwipeRight])

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
  }
}
