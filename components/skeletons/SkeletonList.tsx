import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface SkeletonListProps {
  /**
   * Number of items to display
   */
  count?: number
  /**
   * Show avatar/icon on the left
   */
  showAvatar?: boolean
  /**
   * Avatar shape
   */
  avatarShape?: "circle" | "square"
  /**
   * Number of text lines per item
   */
  lines?: number
  /**
   * Additional className for the list wrapper
   */
  className?: string
  /**
   * Additional className for each list item
   */
  itemClassName?: string
  /**
   * Enable shimmer animation
   */
  shimmer?: boolean
}

/**
 * Reusable list skeleton for loading states (participants, comments, etc.)
 * @example
 * <SkeletonList count={3} showAvatar lines={2} shimmer />
 */
export function SkeletonList({
  count = 3,
  showAvatar = false,
  avatarShape = "circle",
  lines = 2,
  className,
  itemClassName,
  shimmer = false,
}: SkeletonListProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: count }).map((_) => (
        <div
          key={count}
          className={cn(
            "flex items-center gap-3 p-4 bg-muted rounded-lg",
            !shimmer && "animate-pulse",
            itemClassName
          )}
        >
          {showAvatar && (
            <Skeleton
              className={cn(
                "w-10 h-10 flex-shrink-0",
                avatarShape === "circle" ? "rounded-full" : "rounded-md",
                shimmer && "shimmer"
              )}
            />
          )}
          <div className="flex-1 space-y-2">
            {Array.from({ length: lines }).map((_, lineIndex) => (
              <Skeleton
                key={lines}
                className={cn(
                  "h-4 rounded",
                  lineIndex === 0 ? "w-1/3" : "w-1/4",
                  shimmer && "shimmer"
                )}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
