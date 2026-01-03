"use client"

import { UserPlus } from "lucide-react"
import { useParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { useEffect } from "react"
import { AdminControls } from "@/components/event/AdminControls"
import { AvailabilitySection } from "@/components/event/AvailabilitySection"
import { PasswordDialog } from "@/components/event/dialogs/PasswordDialog"
import { EventHeader } from "@/components/event/EventHeader"
import { EventPageError } from "@/components/event/EventPageError"
import { EventPageSkeleton } from "@/components/event/EventPageSkeleton"
import { JoinEventForm } from "@/components/event/JoinEventForm"
import { OptimalDatesDisplay } from "@/components/event/OptimalDatesDisplay"
import { ParticipantList } from "@/components/participants/ParticipantList"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { usePasswordProtection } from "@/hooks/usePasswordProtection"
import { useRealtimeEvent } from "@/hooks/useRealtimeEvent"
import { getSession, isParticipant } from "@/lib/utils/session"
import { useEventStore } from "@/store/eventStore"

export default function EventPage() {
  const params = useParams()
  const shareUrl = params.shareUrl as string
  const t = useTranslations("eventPage")

  const {
    event,
    isLoading,
    error,
    userRole,
    setUserRole,
    fetchEvent,
    fetchParticipants,
    availabilitySelections,
    setAvailabilitySelections,
    isSubmittingAvailability,
    isEditingAvailability,
    hasSubmittedAvailability,
    fetchAvailability,
    submitAvailability,
    startEditingAvailability,
    cancelEditingAvailability,
  } = useEventStore()

  const tAvailability = useTranslations("eventPage.availability")
  const tParticipants = useTranslations("eventPage.participants")

  // Fetch event and participants on mount
  useEffect(() => {
    if (shareUrl) {
      fetchEvent(shareUrl, t)
      fetchParticipants(shareUrl, tParticipants)
    }
  }, [shareUrl, fetchEvent, fetchParticipants, t, tParticipants])

  // Fetch availability when participant session exists
  useEffect(() => {
    if (event && userRole === "participant") {
      const session = getSession(event.id)
      if (session?.participantId) {
        fetchAvailability(event.id, session.participantId)
      }
    }
  }, [event, userRole, fetchAvailability])

  const { isPasswordVerified, showPasswordDialog, handlePasswordSuccess } =
    usePasswordProtection(event)

  // Refresh handler for real-time updates
  const handleRefresh = () => {
    if (event && shareUrl) {
      fetchEvent(shareUrl, t)
      const session = getSession(event.id)
      if (session?.participantId) {
        fetchAvailability(event.id, session.participantId)
      }
    }
  }

  // Real-time subscriptions
  useRealtimeEvent({
    eventId: event?.id || "",
    showToasts: true,
    onParticipantJoin: handleRefresh,
    onParticipantUpdate: handleRefresh,
  })

  // Handle successful join
  const handleJoinSuccess = () => {
    handleRefresh()
    const session = getSession(event?.id || "")
    if (session) {
      setUserRole(session.role)
    }
  }

  // Handle event locked/reopened
  const handleEventLocked = () => {
    handleRefresh()
  }

  // Handle availability submission
  const handleSubmitAvailability = async () => {
    if (!event) return
    const session = getSession(event.id)
    if (!session?.participantId) return
    await submitAvailability(session.participantId, tAvailability)
  }

  // Handle cancel editing
  const handleCancelEdit = () => {
    if (!event) return
    const session = getSession(event.id)
    if (!session?.participantId) return
    cancelEditingAvailability(event.id, session.participantId)
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
                      <UserPlus className="w-5 h-5 text-white" />
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
            <ParticipantList eventId={event.id} />

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
                hasSubmitted={hasSubmittedAvailability}
                isEditingAvailability={isEditingAvailability}
                isSubmittingAvailability={isSubmittingAvailability}
                onSubmit={handleSubmitAvailability}
                onEdit={startEditingAvailability}
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
