import type { UserRole, AvailabilityStatus } from "@/types"

/**
 * Event data structure returned from API
 */
export interface EventData {
  id: string
  name: string
  start_date: string
  end_date: string
  share_url: string
  creator_name: string | null
  is_locked: boolean
  calculated_date: string | null
  created_at: string
  has_password: boolean
}

/**
 * Result returned by useEventData hook
 */
export interface UseEventDataResult {
  event: EventData | null
  setEvent: (event: EventData | null) => void
  isLoading: boolean
  error: string | null
  userRole: UserRole
  setUserRole: (role: UserRole) => void
  refreshTrigger: number
  triggerRefresh: () => void
}

/**
 * Result returned by usePasswordProtection hook
 */
export interface UsePasswordProtectionResult {
  isPasswordVerified: boolean
  showPasswordDialog: boolean
  setShowPasswordDialog: (show: boolean) => void
  handlePasswordSuccess: () => void
}

/**
 * Result returned by useAvailabilityManagement hook
 */
export interface UseAvailabilityManagementResult {
  availabilitySelections: Map<string, AvailabilityStatus>
  setAvailabilitySelections: (selections: Map<string, AvailabilityStatus>) => void
  isSubmittingAvailability: boolean
  isEditingAvailability: boolean
  hasSubmitted: boolean
  setIsEditingAvailability: (editing: boolean) => void
  handleSubmitAvailability: () => Promise<void>
  handleCancelEdit: () => void
}
