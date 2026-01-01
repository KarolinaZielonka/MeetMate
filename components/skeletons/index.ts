/**
 * Reusable skeleton components for loading states
 *
 * All components support:
 * - Dark mode (automatically adapts via semantic colors)
 * - Shimmer animation (optional via `shimmer` prop)
 * - Customization via className props
 *
 * Usage:
 * ```tsx
 * import { SkeletonCard, SkeletonList } from "@/components/skeletons"
 *
 * <SkeletonCard showHeader contentRows={3} shimmer />
 * <SkeletonList count={5} showAvatar lines={2} shimmer />
 * ```
 */

export { SkeletonAvatar } from "./SkeletonAvatar"
export { SkeletonButton } from "./SkeletonButton"
export { SkeletonCard } from "./SkeletonCard"
export { SkeletonForm } from "./SkeletonForm"
export { SkeletonList } from "./SkeletonList"
export { SkeletonTable } from "./SkeletonTable"
export { SkeletonText } from "./SkeletonText"
