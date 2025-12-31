import { useEffect, useState } from "react"

interface Participant {
  id: string
  name: string
  has_submitted: boolean
  created_at: string
}

interface UseParticipantsResult {
  participants: Participant[]
  isLoading: boolean
  error: string | null
}

export function useParticipants(
  shareUrl: string,
  refreshTrigger: number,
  errorMessage: string
): UseParticipantsResult {
  const [participants, setParticipants] = useState<Participant[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchParticipants = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/events/${shareUrl}/participants`)
        const result = await response.json()

        if (!response.ok || result.error) {
          setError(result.error || errorMessage)
          setIsLoading(false)
          return
        }

        setParticipants(result.data || [])
        setIsLoading(false)
      } catch (err) {
        console.error("Error fetching participants:", err)
        setError(errorMessage)
        setIsLoading(false)
      }
    }

    fetchParticipants()
  }, [shareUrl, errorMessage, refreshTrigger])

  return { participants, isLoading, error }
}
