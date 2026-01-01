import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface SkeletonButtonProps {
  /**
   * Button size variant
   */
  size?: "sm" | "md" | "lg"
  /**
   * Button width
   */
  width?: string
  /**
   * Additional className
   */
  className?: string
  /**
   * Enable shimmer animation
   */
  shimmer?: boolean
}

const sizeClasses = {
  sm: "h-8",
  md: "h-10",
  lg: "h-12",
}

/**
 * Reusable button skeleton for loading states
 * @example
 * <SkeletonButton size="lg" width="w-32" shimmer />
 */
export function SkeletonButton({
  size = "md",
  width = "w-24",
  className,
  shimmer = false,
}: SkeletonButtonProps) {
  return (
    <Skeleton
      className={cn(sizeClasses[size], width, "rounded-md", shimmer && "shimmer", className)}
    />
  )
}
