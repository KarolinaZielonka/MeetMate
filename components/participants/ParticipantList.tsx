"use client"

import { useTranslations } from "next-intl"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getSession } from "@/lib/utils/session"
import { useParticipants } from "./hooks/useParticipants"
import { ParticipantListEmpty } from "./ParticipantListEmpty"
import { ParticipantListItem } from "./ParticipantListItem"
import { ParticipantListSkeleton } from "./ParticipantListSkeleton"

interface ParticipantListProps {
  shareUrl: string
  eventId: string
  refreshTrigger?: number
}

export function ParticipantList({ shareUrl, eventId, refreshTrigger = 0 }: ParticipantListProps) {
  const t = useTranslations("eventPage.participants")
  const session = getSession(eventId)
  const currentParticipantId = session?.participantId

  const { participants, isLoading, error } = useParticipants(
    shareUrl,
    refreshTrigger,
    t("errorFetch")
  )

  return (
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
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          {t("title")}
          <Badge variant="secondary" className="ml-2 hover-scale">
            {participants.length}
          </Badge>
        </CardTitle>
        <CardDescription className="text-base">{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && <ParticipantListSkeleton />}

        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {!isLoading && !error && participants.length === 0 && (
          <ParticipantListEmpty message={t("noParticipants")} />
        )}

        {!isLoading && !error && participants.length > 0 && (
          <ul className="space-y-3">
            {participants.map((participant) => (
              <ParticipantListItem
                key={participant.id}
                participant={participant}
                isCurrentUser={participant.id === currentParticipantId}
                youBadgeText={t("youBadge")}
                submittedBadgeText={t("submittedBadge")}
                pendingBadgeText={t("pendingBadge")}
              />
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
