import { useEffect, useState } from "react"
import { getSession } from "@/lib/utils/session"
import type { UserRole } from "@/types"
import type { EventData, UseEventDataResult } from "./types"

export function useEventData(
  shareUrl: string,
  translations: {
    notFound: string
    notFoundMessage: string
  }
): UseEventDataResult {
  const [event, setEvent] = useState<EventData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userRole, setUserRole] = useState<UserRole>("visitor")
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const triggerRefresh = () => setRefreshTrigger((prev) => prev + 1)

  useEffect(() => {
    const fetchEvent = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/events/${shareUrl}`)
        const result = await response.json()

        if (!response.ok || result.error) {
          if (response.status === 404) {
            setError(translations.notFound)
          } else {
            setError(result.error || translations.notFoundMessage)
          }
          setIsLoading(false)
          return
        }

        setEvent(result.data)

        // Check session for this event
        const session = getSession(result.data.id)
        if (session) {
          setUserRole(session.role)
        }

        setIsLoading(false)
      } catch (err) {
        console.error("Error fetching event:", err)
        setError(translations.notFoundMessage)
        setIsLoading(false)
      }
    }

    if (shareUrl) {
      fetchEvent()
    }
  }, [shareUrl, translations.notFound, translations.notFoundMessage])

  return {
    event,
    setEvent,
    isLoading,
    error,
    userRole,
    setUserRole,
    refreshTrigger,
    triggerRefresh,
  }
}
