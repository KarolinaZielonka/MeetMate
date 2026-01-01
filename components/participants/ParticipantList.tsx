"use client"

import { Users } from "lucide-react"
import { useTranslations } from "next-intl"
import { SkeletonList } from "@/components/skeletons"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getSession } from "@/lib/utils/session"
import { useEventStore } from "@/store/eventStore"
import { ParticipantListEmpty } from "./ParticipantListEmpty"
import { ParticipantListItem } from "./ParticipantListItem"

interface ParticipantListProps {
  eventId: string
}

export function ParticipantList({ eventId }: ParticipantListProps) {
  const t = useTranslations("eventPage.participants")
  const session = getSession(eventId)
  const currentParticipantId = session?.participantId

  const { participants, isLoading, error } = useEventStore()

  return (
    <Card className="shadow-lg border-none slide-up">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center shadow-md hover-scale-icon">
            <Users className="w-5 h-5 text-white" />
          </div>
          {t("title")}
          <Badge variant="secondary" className="ml-2 hover-scale">
            {participants.length}
          </Badge>
        </CardTitle>
        <CardDescription className="text-base">{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && <SkeletonList count={3} showAvatar avatarShape="circle" lines={2} />}

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
