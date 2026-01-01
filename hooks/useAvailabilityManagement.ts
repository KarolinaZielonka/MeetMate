import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { getSession, isParticipant } from "@/lib/utils/session"
import type { AvailabilityStatus } from "@/types"
import type { EventData, UseAvailabilityManagementResult } from "./types"

export function useAvailabilityManagement(
  event: EventData | null,
  refreshTrigger: number,
  onAvailabilityUpdate: () => void
): UseAvailabilityManagementResult {
  const t = useTranslations("eventPage.availability")
  const [availabilitySelections, setAvailabilitySelections] = useState<
    Map<string, AvailabilityStatus>
  >(new Map())
  const [isSubmittingAvailability, setIsSubmittingAvailability] = useState(false)
  const [isEditingAvailability, setIsEditingAvailability] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)

  // Fetch existing availability when participant joins
  useEffect(() => {
    const fetchAvailability = async () => {
      if (!event || !isParticipant(event.id)) return

      const session = getSession(event.id)
      if (!session?.participantId) return

      try {
        const response = await fetch(`/api/participants/${session.participantId}/availability`)
        const result = await response.json()

        if (response.ok && result.data) {
          // Convert object to Map
          const availabilityMap = new Map<string, AvailabilityStatus>()
          Object.entries(result.data).forEach(([date, status]) => {
            availabilityMap.set(date, status as AvailabilityStatus)
          })
          setAvailabilitySelections(availabilityMap)
          setHasSubmitted(availabilityMap.size > 0)
        }
      } catch (err) {
        console.error("Error fetching availability:", err)
      }
    }

    fetchAvailability()
  }, [event, refreshTrigger])

  // Handle availability submission
  const handleSubmitAvailability = async () => {
    if (!event) return

    const session = getSession(event.id)

    if (!session?.participantId) {
      toast.error(t("errorSubmit"))
      return
    }

    if (availabilitySelections.size === 0) {
      toast.error(t("noSelections"))
      return
    }

    setIsSubmittingAvailability(true)

    try {
      // Convert Map to array format for API
      const dates = Array.from(availabilitySelections.entries()).map(([date, status]) => ({
        date,
        status,
      }))

      const response = await fetch("/api/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          participant_id: session.participantId,
          dates,
        }),
      })

      const result = await response.json()

      if (response.ok && result.data?.success) {
        toast.success(hasSubmitted ? t("successUpdate") : t("successSubmit"))
        setHasSubmitted(true)
        setIsEditingAvailability(false)
        onAvailabilityUpdate()
      } else {
        toast.error(result.error || t("errorSubmit"))
      }
    } catch (err) {
      console.error("Error submitting availability:", err)
      toast.error(t("errorSubmit"))
    } finally {
      setIsSubmittingAvailability(false)
    }
  }

  // Handle cancel edit
  const handleCancelEdit = () => {
    setIsEditingAvailability(false)
    // Trigger re-fetch of availability
    onAvailabilityUpdate()
  }

  return {
    availabilitySelections,
    setAvailabilitySelections,
    isSubmittingAvailability,
    isEditingAvailability,
    hasSubmitted,
    setIsEditingAvailability,
    handleSubmitAvailability,
    handleCancelEdit,
  }
}
