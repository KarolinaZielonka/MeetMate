import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { SkeletonButton } from "./SkeletonButton"

interface SkeletonFormProps {
  /**
   * Number of form fields to display
   */
  fields?: number
  /**
   * Show submit button
   */
  showButton?: boolean
  /**
   * Additional className for the form wrapper
   */
  className?: string
  /**
   * Enable shimmer animation
   */
  shimmer?: boolean
}

/**
 * Reusable form skeleton for loading states
 * @example
 * <SkeletonForm fields={4} showButton shimmer />
 */
export function SkeletonForm({
  fields = 3,
  showButton = true,
  className,
  shimmer = false,
}: SkeletonFormProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {Array.from({ length: fields }).map((_, i) => (
        <div key={`${i}_${fields}`} className="space-y-2">
          <Skeleton className={cn("h-4 w-24", shimmer && "shimmer")} />
          <Skeleton className={cn("h-10 w-full", shimmer && "shimmer")} />
        </div>
      ))}
      {showButton && (
        <div className="pt-2">
          <SkeletonButton size="lg" width="w-full" shimmer={shimmer} />
        </div>
      )}
    </div>
  )
}
