import type { AvailabilityStatus } from "@/types"

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
