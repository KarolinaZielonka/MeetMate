import { useEffect, useState } from "react"
import { formatDateForAPI, getDatesInRange, parseDate } from "@/lib/utils/dates"
import type { AvailabilityStatus, Event, Participant } from "@/types"
import type { DateAggregation, ParticipantWithAvailability } from "./types"

export function useHeatmapData(event: Event, participants: Participant[]) {
  const [isLoading, setIsLoading] = useState(true)
  const [aggregatedData, setAggregatedData] = useState<Map<string, DateAggregation>>(new Map())

  useEffect(() => {
    const fetchAllAvailability = async () => {
      setIsLoading(true)

      try {
        const submittedParticipants = participants.filter((p) => p.has_submitted)

        if (submittedParticipants.length === 0) {
          setIsLoading(false)
          return
        }

        // Fetch availability for each participant
        const availabilityPromises = submittedParticipants.map(async (participant) => {
          const response = await fetch(`/api/participants/${participant.id}/availability`)
          const result = await response.json()

          if (response.ok && result.data) {
            const availabilityMap = new Map<string, AvailabilityStatus>()
            Object.entries(result.data).forEach(([date, status]) => {
              availabilityMap.set(date, status as AvailabilityStatus)
            })
            return { ...participant, availability: availabilityMap } as ParticipantWithAvailability
          }
          return null
        })

        const participantsWithAvailability = (await Promise.all(availabilityPromises)).filter(
          (p): p is ParticipantWithAvailability => p !== null
        )

        // Aggregate data by date
        const dateMap = new Map<string, DateAggregation>()

        // Convert date strings to Date objects, get range, then convert back to strings
        const startDate = parseDate(event.start_date)
        const endDate = parseDate(event.end_date)
        const dateObjects = getDatesInRange(startDate, endDate)
        const allDates = dateObjects.map((date) => formatDateForAPI(date))

        // Initialize all dates
        for (const date of allDates) {
          dateMap.set(date, {
            date,
            available: 0,
            maybe: 0,
            unavailable: 0,
            total: 0,
            participants: [],
          })
        }

        // Aggregate availability data
        for (const participant of participantsWithAvailability) {
          for (const date of allDates) {
            const status = participant.availability.get(date)
            const dateData = dateMap.get(date)!

            if (status) {
              if (status === "available") {
                dateData.available++
              } else if (status === "maybe") {
                dateData.maybe++
              } else if (status === "unavailable") {
                dateData.unavailable++
              }

              dateData.total++
              dateData.participants.push({
                id: participant.id,
                name: participant.name,
                status,
              })
            }
          }
        }

        setAggregatedData(dateMap)
      } catch (error) {
        console.error("Error fetching availability:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAllAvailability()
  }, [event, participants])

  return { isLoading, aggregatedData }
}
