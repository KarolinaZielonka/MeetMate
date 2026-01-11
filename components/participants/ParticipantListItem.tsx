import { Check, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Participant {
  id: string
  name: string
  has_submitted: boolean
  created_at: string
}

interface ParticipantListItemProps {
  participant: Participant
  isCurrentUser: boolean
  youBadgeText: string
  submittedBadgeText: string
  pendingBadgeText: string
}

export function ParticipantListItem({
  participant,
  isCurrentUser,
  youBadgeText,
  submittedBadgeText,
  pendingBadgeText,
}: ParticipantListItemProps) {
  return (
    <li
      className={`flex items-center justify-between gap-3 p-4 rounded-lg transition-smooth ${
        isCurrentUser
          ? "bg-primary/10 border-2 border-primary/30 shadow-md"
          : "bg-muted hover:bg-secondary hover:shadow-md"
      }`}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
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
          <span className="pill pill-primary hover-scale">
            {youBadgeText}
          </span>
        )}
        {participant.has_submitted ? (
          <span className="pill pill-success hover-scale">
            <Check className="w-3 h-3" />
            {submittedBadgeText}
          </span>
        ) : (
          <span className="pill hover-scale">
            <Clock className="w-3 h-3" />
            {pendingBadgeText}
          </span>
        )}
      </div>
    </li>
  )
}
