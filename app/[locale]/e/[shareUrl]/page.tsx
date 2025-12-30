"use client"

import { useParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { EventPageError } from "@/components/EventPageError"
import { EventPageSkeleton } from "@/components/EventPageSkeleton"
import { EventHeader } from "@/components/event/EventHeader"
import { JoinEventForm } from "@/components/event/JoinEventForm"
import { OptimalDatesDisplay } from "@/components/event/OptimalDatesDisplay"
import { ParticipantList } from "@/components/participants/ParticipantList"
import { DateRangePicker } from "@/components/calendar/DateRangePicker"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getSession, isParticipant } from "@/lib/utils/session"
import { useRealtimeEvent } from "@/hooks/useRealtimeEvent"
import type { AvailabilityStatus } from "@/types"

interface EventData {
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

export default function EventPage() {
  const params = useParams()
  const shareUrl = params.shareUrl as string
  const t = useTranslations("eventPage")

  const [event, setEvent] = useState<EventData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userRole, setUserRole] = useState<"admin" | "participant" | "visitor">("visitor")
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [availabilitySelections, setAvailabilitySelections] = useState<
    Map<string, AvailabilityStatus>
  >(new Map())
  const [isSubmittingAvailability, setIsSubmittingAvailability] = useState(false)
  const [isEditingAvailability, setIsEditingAvailability] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)

  // Real-time subscriptions
  useRealtimeEvent({
    eventId: event?.id || "",
    showToasts: true,
    onParticipantJoin: () => {
      // Trigger refresh to update participant list
      setRefreshTrigger((prev) => prev + 1)
    },
    onParticipantUpdate: () => {
      // Trigger refresh to update participant list
      setRefreshTrigger((prev) => prev + 1)
    },
  })

  // Fetch event data
  useEffect(() => {
    const fetchEvent = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/events/${shareUrl}`)
        const result = await response.json()

        if (!response.ok || result.error) {
          if (response.status === 404) {
            setError(t("errors.notFound"))
          } else {
            setError(result.error || t("errors.notFoundMessage"))
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
        setError(t("errors.notFoundMessage"))
        setIsLoading(false)
      }
    }

    if (shareUrl) {
      fetchEvent()
    }
  }, [shareUrl, t])

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
      toast.error(t("availability.errorSubmit"))
      return
    }

    if (availabilitySelections.size === 0) {
      toast.error(t("availability.noSelections"))
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
        toast.success(
          hasSubmitted ? t("availability.successUpdate") : t("availability.successSubmit")
        )
        setHasSubmitted(true)
        setIsEditingAvailability(false)
        setRefreshTrigger((prev) => prev + 1) // Refresh participant list
      } else {
        toast.error(result.error || t("availability.errorSubmit"))
      }
    } catch (err) {
      console.error("Error submitting availability:", err)
      toast.error(t("availability.errorSubmit"))
    } finally {
      setIsSubmittingAvailability(false)
    }
  }

  // Loading state
  if (isLoading) {
    return <EventPageSkeleton />
  }

  // Error state
  if (error || !event) {
    return (
      <EventPageError
        error={error || t("errors.notFoundMessage")}
        notFoundMessage={t("errors.notFound")}
        isNotFound={error === t("errors.notFound")}
        goHomeText={t("errors.goHome")}
        oopsText={t("errors.oops")}
      />
    )
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Event Header Card */}
        <EventHeader
          event={event}
          userRole={userRole}
          shareUrl={typeof window !== "undefined" ? window.location.href : ""}
          translations={{
            badgesAdmin: t("badges.admin"),
            badgesParticipant: t("badges.participant"),
            createdBy: t("createdBy"),
            lockedTitle: t("locked.title"),
            lockedChosenDate: t("locked.chosenDate", { date: "" }),
            shareLabel: t("share.label"),
            shareCopyButton: t("share.copyButton"),
            shareCopied: t("share.copied"),
          }}
        />

        {/* Join Event Section */}
        {!isParticipant(event.id) && !event.is_locked && (
          <Card className="shadow-lg border-none slide-up">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-accent rounded-lg flex items-center justify-center shadow-md hover-scale-icon">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    />
                  </svg>
                </div>
                {t("join.title")}
              </CardTitle>
              <CardDescription className="text-base">{t("join.description")}</CardDescription>
            </CardHeader>
            <CardContent>
              <JoinEventForm
                eventId={event.id}
                shareUrl={shareUrl}
                onSuccess={() => {
                  setRefreshTrigger((prev) => prev + 1)
                  // Re-check session after joining
                  const session = getSession(event.id)
                  if (session) {
                    setUserRole(session.role)
                  }
                }}
                translations={{
                  title: t("join.title"),
                  description: t("join.description"),
                  nameLabel: t("join.nameLabel"),
                  namePlaceholder: t("join.namePlaceholder"),
                  joinButton: t("join.joinButton"),
                  joiningButton: t("join.joiningButton"),
                  successMessage: t("join.successMessage"),
                  errorNameRequired: t("join.errorNameRequired"),
                  errorNameTooLong: t("join.errorNameTooLong"),
                  errorJoinFailed: t("join.errorJoinFailed"),
                }}
              />
            </CardContent>
          </Card>
        )}

        {/* Participant List */}
        <ParticipantList
          shareUrl={shareUrl}
          eventId={event.id}
          refreshTrigger={refreshTrigger}
          translations={{
            title: t("participants.title"),
            description: t("participants.description"),
            noParticipants: t("participants.noParticipants"),
            submittedBadge: t("participants.submittedBadge"),
            pendingBadge: t("participants.pendingBadge"),
            youBadge: t("participants.youBadge"),
            errorFetch: t("participants.errorFetch"),
          }}
        />

        {/* Optimal Dates Display Section */}
        <OptimalDatesDisplay
          shareUrl={shareUrl}
          isAdmin={userRole === "admin"}
          isLocked={event.is_locked}
          calculatedDate={event.calculated_date}
          onEventLocked={() => {
            // Refresh event data to show locked state
            setRefreshTrigger((prev) => prev + 1)
            // Re-fetch event to update is_locked status
            fetch(`/api/events/${shareUrl}`)
              .then((res) => res.json())
              .then((result) => {
                if (result.data) {
                  setEvent(result.data)
                }
              })
              .catch((err) => console.error("Error refreshing event:", err))
          }}
        />

        {/* Availability Selection Section */}
        {isParticipant(event.id) && !event.is_locked && (
          <Card className="shadow-lg border-none slide-up">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center shadow-md hover-scale-icon">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                {t("availability.title")}
              </CardTitle>
              <CardDescription className="text-base">
                {t("availability.description")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <DateRangePicker
                startDate={new Date(event.start_date)}
                endDate={new Date(event.end_date)}
                onSelectionChange={setAvailabilitySelections}
                initialSelections={availabilitySelections}
                disabled={hasSubmitted && !isEditingAvailability}
              />

              <div className="flex gap-3">
                {!hasSubmitted || isEditingAvailability ? (
                  <Button
                    onClick={handleSubmitAvailability}
                    disabled={isSubmittingAvailability || availabilitySelections.size === 0}
                    className="flex-1 h-12 text-base"
                  >
                    {isSubmittingAvailability
                      ? hasSubmitted
                        ? t("availability.updatingButton")
                        : t("availability.submittingButton")
                      : hasSubmitted
                        ? t("availability.updateButton")
                        : t("availability.submitButton")}
                  </Button>
                ) : (
                  <Button
                    onClick={() => setIsEditingAvailability(true)}
                    variant="outline"
                    className="flex-1 h-12 text-base"
                  >
                    {t("availability.editButton")}
                  </Button>
                )}

                {isEditingAvailability && (
                  <Button
                    onClick={() => {
                      setIsEditingAvailability(false)
                      // Reload availability
                      setRefreshTrigger((prev) => prev + 1)
                    }}
                    variant="ghost"
                    className="h-12"
                  >
                    {t("cancel")}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
