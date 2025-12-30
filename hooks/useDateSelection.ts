import { useState, useCallback } from 'react'
import type { AvailabilityStatus, AvailabilityMap } from '@/types'

interface DateSelectionReturn {
  availability: AvailabilityMap
  selectDate: (date: string) => void
  clearSelection: () => void
  setAvailabilityMap: (map: AvailabilityMap) => void
}

/**
 * Custom hook for managing three-state date selection
 * Cycles through: unselected → available → maybe → unavailable → unselected
 */
export function useDateSelection(initialAvailability?: AvailabilityMap): DateSelectionReturn {
  const [availability, setAvailability] = useState<AvailabilityMap>(
    initialAvailability || new Map()
  )

  const selectDate = useCallback((date: string) => {
    setAvailability((prev) => {
      const newMap = new Map(prev)
      const currentStatus = newMap.get(date)

      // Cycle through states
      let newStatus: AvailabilityStatus | undefined

      switch (currentStatus) {
        case undefined:
          newStatus = 'available'
          break
        case 'available':
          newStatus = 'maybe'
          break
        case 'maybe':
          newStatus = 'unavailable'
          break
        case 'unavailable':
          newStatus = undefined // Remove from map (unselected)
          break
      }

      if (newStatus === undefined) {
        newMap.delete(date)
      } else {
        newMap.set(date, newStatus)
      }

      return newMap
    })
  }, [])

  const clearSelection = useCallback(() => {
    setAvailability(new Map())
  }, [])

  const setAvailabilityMap = useCallback((map: AvailabilityMap) => {
    setAvailability(map)
  }, [])

  return {
    availability,
    selectDate,
    clearSelection,
    setAvailabilityMap,
  }
}
