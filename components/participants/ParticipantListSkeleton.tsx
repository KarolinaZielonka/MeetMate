export function ParticipantListSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-3 p-4 bg-muted rounded-lg animate-pulse">
          <div className="w-10 h-10 bg-muted-foreground/20 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-muted-foreground/20 rounded w-1/3" />
            <div className="h-3 bg-muted-foreground/20 rounded w-1/4" />
          </div>
        </div>
      ))}
    </div>
  )
}
