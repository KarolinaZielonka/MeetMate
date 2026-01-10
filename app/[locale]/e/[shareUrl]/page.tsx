"use client"

import { UserPlus } from "lucide-react"
import { useParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { useEffect } from "react"
import { AvailabilityHeatmap } from "@/components/calendar/AvailabilityHeatmap"
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
    participants,
    isLoading,
    error,
    userRole,
    setUserRole,
    fetchEvent,
    fetchParticipants,
    fetchAvailability,
  } = useEventStore()

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
    if (event) {
      const session = getSession(event.id)
      if (session?.participantId) {
        fetchAvailability(event.id, session.participantId)
      }
    }
  }, [event, fetchAvailability])

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
    onAvailabilityUpdate: handleRefresh,
    onEventLocked: handleRefresh,
    onEventReopened: handleRefresh,
  })

  // Handle successful join
  const handleJoinSuccess = () => {
    handleRefresh()
    const session = getSession(event?.id || "")
    if (session) {
      setUserRole(session.role)
    }
  }

  if (isLoading) {
    return <EventPageSkeleton />
  }

  if (error || !event) {
    return <EventPageError error={error || undefined} isNotFound={error === t("errors.notFound")} />
  }

  return (
    <>
      {event.has_password && (
        <PasswordDialog
          shareUrl={shareUrl}
          open={showPasswordDialog}
          onSuccess={handlePasswordSuccess}
        />
      )}

      {isPasswordVerified && (
        <div className="min-h-screen bg-background pt-24 pb-12 px-4">
          <div className="max-w-6xl mx-auto space-y-6">
            <EventHeader event={event} userRole={userRole} shareUrl={window.location.href} />

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

            {isParticipant(event.id) && !event.is_locked && (
              <AvailabilitySection eventId={event.id} />
            )}
            <OptimalDatesDisplay shareUrl={shareUrl} onEventLocked={handleRefresh} />

            <AvailabilityHeatmap event={event} participants={participants} />

            <ParticipantList eventId={event.id} />

            {userRole === "admin" && (
              <AdminControls shareUrl={shareUrl} onEventReopened={handleRefresh} />
            )}
          </div>
        </div>
      )}
    </>
  )
}
