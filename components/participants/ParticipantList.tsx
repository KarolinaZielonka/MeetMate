"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getSession } from "@/lib/utils/session"

interface Participant {
  id: string
  name: string
  has_submitted: boolean
  created_at: string
}

interface ParticipantListProps {
  shareUrl: string
  eventId: string
  refreshTrigger?: number
}

export function ParticipantList({
  shareUrl,
  eventId,
  refreshTrigger = 0,
}: ParticipantListProps) {
  const t = useTranslations("eventPage.participants")
  const [participants, setParticipants] = useState<Participant[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const session = getSession(eventId)
  const currentParticipantId = session?.participantId

  useEffect(() => {
    const fetchParticipants = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/events/${shareUrl}/participants`)
        const result = await response.json()

        if (!response.ok || result.error) {
          setError(result.error || t("errorFetch"))
          setIsLoading(false)
          return
        }

        setParticipants(result.data || [])
        setIsLoading(false)
      } catch (err) {
        console.error("Error fetching participants:", err)
        setError(t("errorFetch"))
        setIsLoading(false)
      }
    }

    fetchParticipants()
  }, [shareUrl, t, refreshTrigger])

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
        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-4 bg-muted rounded-lg animate-pulse"
              >
                <div className="w-10 h-10 bg-muted-foreground/20 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted-foreground/20 rounded w-1/3" />
                  <div className="h-3 bg-muted-foreground/20 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {!isLoading && !error && participants.length === 0 && (
          <div className="p-8 text-center bg-muted rounded-lg">
            <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <svg
                className="w-8 h-8 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <p className="text-muted-foreground">{t("noParticipants")}</p>
          </div>
        )}

        {!isLoading && !error && participants.length > 0 && (
          <ul className="space-y-3">
            {participants.map((participant) => {
              const isCurrentUser = participant.id === currentParticipantId

              return (
                <li
                  key={participant.id}
                  className={`flex items-center justify-between gap-3 p-4 rounded-lg transition-smooth ${
                    isCurrentUser
                      ? "bg-primary/10 border-2 border-primary/30 shadow-md"
                      : "bg-muted hover:bg-secondary hover:shadow-md"
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-smooth ${
                        isCurrentUser
                          ? "bg-primary/20 border-2 border-primary"
                          : "bg-background border-2 border-muted-foreground/20"
                      }`}
                    >
                      <svg
                        className={`w-5 h-5 ${isCurrentUser ? "text-primary" : "text-muted-foreground"}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p
                        className={`font-semibold truncate ${
                          isCurrentUser ? "text-primary" : "text-foreground"
                        }`}
                      >
                        {participant.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(participant.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {isCurrentUser && (
                      <Badge
                        variant="outline"
                        className="bg-primary/10 border-primary/30 text-primary hover-scale"
                      >
                        {t("youBadge")}
                      </Badge>
                    )}
                    {participant.has_submitted ? (
                      <Badge
                        variant="default"
                        className="bg-green-500 hover:bg-green-600 hover-scale"
                      >
                        <svg
                          className="w-3 h-3 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        {t("submittedBadge")}
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="hover-scale">
                        <svg
                          className="w-3 h-3 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {t("pendingBadge")}
                      </Badge>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
