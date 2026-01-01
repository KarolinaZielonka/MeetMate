import { Check, Clock, User } from "lucide-react"
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
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-smooth ${
            isCurrentUser
              ? "bg-primary/20 border-2 border-primary"
              : "bg-background border-2 border-muted-foreground/20"
          }`}
        >
          <User className={`w-5 h-5 ${isCurrentUser ? "text-primary" : "text-muted-foreground"}`} />
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
            {youBadgeText}
          </Badge>
        )}
        {participant.has_submitted ? (
          <Badge variant="default" className="bg-green-500 hover:bg-green-600 hover-scale">
            <Check className="w-3 h-3 mr-1" />
            {submittedBadgeText}
          </Badge>
        ) : (
          <Badge variant="secondary" className="hover-scale">
            <Clock className="w-3 h-3 mr-1" />
            {pendingBadgeText}
          </Badge>
        )}
      </div>
    </li>
  )
}
