"use client"

import { useParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { EventPageError } from "@/components/EventPageError"
import { EventPageSkeleton } from "@/components/EventPageSkeleton"
import { AdminControls } from "@/components/event/AdminControls"
import { AvailabilitySection } from "@/components/event/AvailabilitySection"
import { EventHeader } from "@/components/event/EventHeader"
import { JoinEventForm } from "@/components/event/JoinEventForm"
import { OptimalDatesDisplay } from "@/components/event/OptimalDatesDisplay"
import { PasswordDialog } from "@/components/event/PasswordDialog"
import { ParticipantList } from "@/components/participants/ParticipantList"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAvailabilityManagement } from "@/hooks/useAvailabilityManagement"
import { useEventData } from "@/hooks/useEventData"
import { usePasswordProtection } from "@/hooks/usePasswordProtection"
import { useRealtimeEvent } from "@/hooks/useRealtimeEvent"
import { getSession, isParticipant } from "@/lib/utils/session"

export default function EventPage() {
  const params = useParams()
  const shareUrl = params.shareUrl as string
  const t = useTranslations("eventPage")

  // Custom hooks for state management
  const {
    event,
    setEvent,
    isLoading,
    error,
    userRole,
    setUserRole,
    refreshTrigger,
    triggerRefresh,
  } = useEventData(shareUrl)

  const { isPasswordVerified, showPasswordDialog, handlePasswordSuccess } =
    usePasswordProtection(event)

  const {
    availabilitySelections,
    setAvailabilitySelections,
    isSubmittingAvailability,
    isEditingAvailability,
    hasSubmitted,
    setIsEditingAvailability,
    handleSubmitAvailability,
    handleCancelEdit,
  } = useAvailabilityManagement(event, refreshTrigger, triggerRefresh)

  // Real-time subscriptions
  useRealtimeEvent({
    eventId: event?.id || "",
    showToasts: true,
    onParticipantJoin: triggerRefresh,
    onParticipantUpdate: triggerRefresh,
  })

  // Handle successful join
  const handleJoinSuccess = () => {
    triggerRefresh()
    const session = getSession(event?.id || "")
    if (session) {
      setUserRole(session.role)
    }
  }

  // Handle event locked
  const handleEventLocked = () => {
    triggerRefresh()
    // Re-fetch event to update is_locked status
    fetch(`/api/events/${shareUrl}`)
      .then((res) => res.json())
      .then((result) => {
        if (result.data) {
          setEvent(result.data)
        }
      })
      .catch((err) => console.error("Error refreshing event:", err))
  }

  // Loading state
  if (isLoading) {
    return <EventPageSkeleton />
  }

  // Error state
  if (error || !event) {
    return <EventPageError error={error || undefined} isNotFound={error === t("errors.notFound")} />
  }

  return (
    <>
      {/* Password Dialog */}
      {event.has_password && (
        <PasswordDialog
          shareUrl={shareUrl}
          open={showPasswordDialog}
          onSuccess={handlePasswordSuccess}
        />
      )}

      {/* Main Content - Only show if password is verified or not required */}
      {isPasswordVerified && (
        <div className="min-h-screen bg-background pt-24 pb-12 px-4">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Event Header Card */}
            <EventHeader
              event={event}
              userRole={userRole}
              shareUrl={typeof window !== "undefined" ? window.location.href : ""}
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
                  <JoinEventForm eventId={event.id} onSuccess={handleJoinSuccess} />
                </CardContent>
              </Card>
            )}

            {/* Participant List */}
            <ParticipantList
              shareUrl={shareUrl}
              eventId={event.id}
              refreshTrigger={refreshTrigger}
            />

            {/* Optimal Dates Display Section */}
            <OptimalDatesDisplay
              shareUrl={shareUrl}
              isAdmin={userRole === "admin"}
              isLocked={event.is_locked}
              calculatedDate={event.calculated_date}
              onEventLocked={handleEventLocked}
            />

            {/* Availability Selection Section */}
            {isParticipant(event.id) && !event.is_locked && (
              <AvailabilitySection
                startDate={new Date(event.start_date)}
                endDate={new Date(event.end_date)}
                availabilitySelections={availabilitySelections}
                onSelectionChange={setAvailabilitySelections}
                hasSubmitted={hasSubmitted}
                isEditingAvailability={isEditingAvailability}
                isSubmittingAvailability={isSubmittingAvailability}
                onSubmit={handleSubmitAvailability}
                onEdit={() => setIsEditingAvailability(true)}
                onCancel={handleCancelEdit}
              />
            )}

            {/* Admin Controls */}
            {userRole === "admin" && (
              <AdminControls
                shareUrl={shareUrl}
                isLocked={event.is_locked}
                onEventReopened={handleEventLocked}
              />
            )}
          </div>
        </div>
      )}
    </>
  )
}
