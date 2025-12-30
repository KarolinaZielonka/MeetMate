"use client"

import { useParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"
import { EventPageError } from "@/components/EventPageError"
import { EventPageSkeleton } from "@/components/EventPageSkeleton"
import { EventHeader } from "@/components/event/EventHeader"
import { JoinEventForm } from "@/components/event/JoinEventForm"
import { ParticipantList } from "@/components/participants/ParticipantList"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getSession, isParticipant } from "@/lib/utils/session"

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

        {/* What's Next Section */}
        <Card className="shadow-lg border-none slide-up">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <svg
                className="w-7 h-7 text-primary transition-smooth hover:rotate-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              {t("whatsNext.title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {[
                {
                  id: "step1",
                  text: t("whatsNext.step1"),
                  phase: t("whatsNext.phase", { number: 2 }),
                },
                {
                  id: "step2",
                  text: t("whatsNext.step2"),
                  phase: t("whatsNext.phase", { number: 3 }),
                },
                {
                  id: "step3",
                  text: t("whatsNext.step3"),
                  phase: t("whatsNext.phase", { number: 4 }),
                },
                {
                  id: "step4",
                  text: t("whatsNext.step4"),
                  phase: t("whatsNext.phase", { number: 5 }),
                },
              ].map((item, index) => (
                <li
                  key={item.id}
                  className="flex items-start gap-3 p-3 bg-muted rounded-lg transition-smooth hover:bg-secondary hover:shadow-md group"
                >
                  <div className="w-6 h-6 bg-gradient-primary rounded-full flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5 transition-smooth group-hover:scale-110">
                    <span className="text-white text-xs font-bold">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-foreground font-medium">{item.text}</p>
                    <p className="text-sm text-muted-foreground">{item.phase}</p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
