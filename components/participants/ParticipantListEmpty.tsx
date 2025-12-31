interface ParticipantListEmptyProps {
  message: string
}

export function ParticipantListEmpty({ message }: ParticipantListEmptyProps) {
  return (
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
      <p className="text-muted-foreground">{message}</p>
    </div>
  )
}
