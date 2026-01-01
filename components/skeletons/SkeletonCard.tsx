import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface SkeletonCardProps {
  /**
   * Show header skeleton
   */
  showHeader?: boolean
  /**
   * Number of content rows to display
   */
  contentRows?: number
  /**
   * Height of each content row
   */
  rowHeight?: string
  /**
   * Additional className for the card wrapper
   */
  className?: string
  /**
   * Additional className for content skeletons
   */
  contentClassName?: string
  /**
   * Enable shimmer animation
   */
  shimmer?: boolean
}

/**
 * Reusable card skeleton for loading states
 * @example
 * <SkeletonCard showHeader contentRows={3} shimmer />
 */
export function SkeletonCard({
  showHeader = true,
  contentRows = 1,
  rowHeight = "h-32",
  className,
  contentClassName,
  shimmer = false,
}: SkeletonCardProps) {
  return (
    <Card className={cn("shadow-lg border-none", className)}>
      {showHeader && (
        <CardHeader>
          <Skeleton className={cn("h-10 w-3/4 mb-2", shimmer && "shimmer")} />
          <Skeleton className={cn("h-6 w-1/2", shimmer && "shimmer")} />
        </CardHeader>
      )}
      <CardContent>
        <div className="space-y-3">
          {Array.from({ length: contentRows }).map((_, i) => (
            <Skeleton
              key={`${i}_${contentRows}`}
              className={cn(rowHeight, "w-full", shimmer && "shimmer", contentClassName)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
