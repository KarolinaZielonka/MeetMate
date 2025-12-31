import type { AvailabilityStatus, AvailabilityMap } from "@/types"

export interface MonthCalendarProps {
  year: number
  month: number // 0-indexed (0 = January)
  startDate: Date
  endDate: Date
  availability: Map<string, AvailabilityStatus>
  onDateSelect: (date: string) => void
  readonly?: boolean
}

export interface CalendarDay {
  date: string // YYYY-MM-DD
  dayOfMonth: number
  isInRange: boolean
  isToday: boolean
}

export interface DateRangePickerProps {
  startDate: Date
  endDate: Date
  initialAvailability?: AvailabilityMap
  onAvailabilityChange?: (availability: AvailabilityMap) => void
  readonly?: boolean
  className?: string
}
