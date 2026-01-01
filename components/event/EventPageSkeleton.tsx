import { SkeletonCard } from "@/components/skeletons"

export function EventPageSkeleton() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <SkeletonCard showHeader contentRows={1} rowHeight="h-32" shimmer />
      </div>
    </div>
  )
}
