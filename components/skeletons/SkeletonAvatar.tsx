import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface SkeletonAvatarProps {
  /**
   * Avatar size
   */
  size?: "sm" | "md" | "lg" | "xl"
  /**
   * Avatar shape
   */
  shape?: "circle" | "square"
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
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-12 h-12",
  xl: "w-16 h-16",
}

/**
 * Reusable avatar skeleton for loading states
 * @example
 * <SkeletonAvatar size="lg" shape="circle" shimmer />
 */
export function SkeletonAvatar({
  size = "md",
  shape = "circle",
  className,
  shimmer = false,
}: SkeletonAvatarProps) {
  return (
    <Skeleton
      className={cn(
        sizeClasses[size],
        shape === "circle" ? "rounded-full" : "rounded-md",
        shimmer && "shimmer",
        className
      )}
    />
  )
}
