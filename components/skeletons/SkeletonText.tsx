import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface SkeletonTextProps {
  /**
   * Number of lines to display
   */
  lines?: number
  /**
   * Width variants for each line
   */
  widths?: string[]
  /**
   * Height of each line
   */
  height?: string
  /**
   * Additional className for the wrapper
   */
  className?: string
  /**
   * Enable shimmer animation
   */
  shimmer?: boolean
}

/**
 * Reusable text skeleton for loading states
 * @example
 * <SkeletonText lines={3} widths={["w-full", "w-3/4", "w-1/2"]} shimmer />
 */
export function SkeletonText({
  lines = 3,
  widths,
  height = "h-4",
  className,
  shimmer = false,
}: SkeletonTextProps) {
  const defaultWidths = ["w-full", "w-5/6", "w-4/6"]

  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={`skeleton-text-${i}`}
          className={cn(
            height,
            widths?.[i] || defaultWidths[i % defaultWidths.length],
            shimmer && "shimmer"
          )}
        />
      ))}
    </div>
  )
}
