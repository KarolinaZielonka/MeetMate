"use client"

import type { Participant } from "@/types"
import type { DateAggregation } from "./types"

interface IndividualViewProps {
  dates: string[]
  participants: Participant[]
  aggregatedData: Map<string, DateAggregation>
}

export function IndividualView({ dates, participants, aggregatedData }: IndividualViewProps) {
  return (
    <div className="space-y-4">
      {participants
        .filter((p) => p.has_submitted)
        .map((participant) => (
          <div key={participant.id} className="border-b border-border pb-4 last:border-0">
            <h4 className="font-semibold text-foreground mb-2">{participant.name}</h4>
            <div className="grid grid-cols-7 gap-2">
              {dates.map((date) => {
                const dateData = aggregatedData.get(date)
                const participantStatus = dateData?.participants.find(
                  (p) => p.id === participant.id
                )?.status

                const dateObj = new Date(date)
                const dayOfMonth = dateObj.getDate()

                return (
                  <div
                    key={date}
                    className={`
                      rounded-lg p-2 text-center min-h-[44px] flex items-center justify-center
                      ${
                        participantStatus === "available"
                          ? "state-available"
                          : participantStatus === "maybe"
                            ? "state-maybe"
                            : participantStatus === "unavailable"
                              ? "state-unavailable"
                              : "bg-muted border border-border"
                      }
                    `}
                  >
                    <span className="text-sm font-medium">{dayOfMonth}</span>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
    </div>
  )
}
