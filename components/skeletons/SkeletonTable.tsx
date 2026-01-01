import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface SkeletonTableProps {
  /**
   * Number of rows to display
   */
  rows?: number
  /**
   * Number of columns to display
   */
  columns?: number
  /**
   * Show table header
   */
  showHeader?: boolean
  /**
   * Additional className for the table wrapper
   */
  className?: string
  /**
   * Enable shimmer animation
   */
  shimmer?: boolean
}

/**
 * Reusable table skeleton for loading states
 * @example
 * <SkeletonTable rows={5} columns={4} showHeader shimmer />
 */
export function SkeletonTable({
  rows = 5,
  columns = 4,
  showHeader = true,
  className,
  shimmer = false,
}: SkeletonTableProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {showHeader && (
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_) => (
            <Skeleton key={columns} className={cn("h-8 w-full", shimmer && "shimmer")} />
          ))}
        </div>
      )}
      <div className="space-y-2">
        {Array.from({ length: rows }).map((_) => (
          <div
            key={rows}
            className="grid gap-4"
            style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
          >
            {Array.from({ length: columns }).map((_) => (
              <Skeleton key={columns} className={cn("h-10 w-full", shimmer && "shimmer")} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
