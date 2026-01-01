import { UserPlus } from "lucide-react"

interface ParticipantListEmptyProps {
  message: string
}

export function ParticipantListEmpty({ message }: ParticipantListEmptyProps) {
  return (
    <div className="p-8 text-center bg-muted rounded-lg">
      <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
        <UserPlus className="w-8 h-8 text-muted-foreground" />
      </div>
      <p className="text-muted-foreground">{message}</p>
    </div>
  )
}
