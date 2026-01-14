import { useCallback, useState } from "react"
import { toast } from "sonner"
import { getAdminToken } from "@/lib/utils/session"

interface UseEventLockReturn {
  locking: boolean
  selectedDate: string | null
  showLockDialog: boolean
  setSelectedDate: (date: string | null) => void
  setShowLockDialog: (show: boolean) => void
  handleLockEvent: () => Promise<void>
}

/**
 * Custom hook for managing event locking functionality
 * @param shareUrl - Event share URL
 * @param eventId - Event ID for getting admin token
 * @param translationKey - Translation function for messages
 * @param onEventLocked - Callback when event is successfully locked
 */
export function useEventLock(
  shareUrl: string,
  eventId: string | undefined,
  translationKey: (key: string) => string,
  onEventLocked?: () => void
): UseEventLockReturn {
  const [locking, setLocking] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [showLockDialog, setShowLockDialog] = useState(false)

  const handleLockEvent = useCallback(async () => {
    if (!selectedDate || !eventId) return

    const adminToken = getAdminToken(eventId)
    if (!adminToken) {
      toast.error(translationKey("errorUnauthorized"))
      return
    }

    setLocking(true)
    try {
      const response = await fetch(`/api/events/${shareUrl}/lock`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chosen_date: selectedDate, admin_token: adminToken }),
      })

      const data = await response.json()

      if (data.error) {
        toast.error(data.error)
        return
      }

      toast.success(translationKey("successLock"))
      setShowLockDialog(false)
      onEventLocked?.()
    } catch (error) {
      console.error("Error locking event:", error)
      toast.error(translationKey("errorLock"))
    } finally {
      setLocking(false)
    }
  }, [selectedDate, shareUrl, eventId, translationKey, onEventLocked])

  return {
    locking,
    selectedDate,
    showLockDialog,
    setSelectedDate,
    setShowLockDialog,
    handleLockEvent,
  }
}
