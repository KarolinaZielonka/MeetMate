/**
 * Zod schemas for API validation
 */

import { z } from "zod"

/**
 * Event creation schema
 */
export const createEventSchema = z.object({
  name: z.string().min(1, "Event name is required").max(255, "Event name is too long"),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  creator_name: z.string().min(1, "Creator name is required").max(100, "Creator name is too long"),
  password: z.string().optional(),
})

/**
 * Join event (participant) schema
 */
export const joinEventSchema = z.object({
  event_id: z.string().uuid("Invalid event ID"),
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
})

/**
 * Availability submission schema
 */
export const availabilitySchema = z.object({
  participant_id: z.string().uuid("Invalid participant ID"),
  dates: z
    .array(
      z.object({
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
        status: z.enum(["available", "maybe", "unavailable"], {
          errorMap: () => ({ message: "Status must be available, maybe, or unavailable" }),
        }),
      })
    )
    .min(1, "At least one date selection is required"),
})

/**
 * Password verification schema
 */
export const passwordVerificationSchema = z.object({
  password: z.string().min(1, "Password is required"),
})

/**
 * Share URL parameter schema
 */
export const shareUrlSchema = z.object({
  shareUrl: z.string().min(1, "Share URL is required"),
})

/**
 * UUID parameter schema
 */
export const uuidSchema = z.object({
  id: z.string().uuid("Invalid ID format"),
})

/**
 * Helper: Convert Zod error to API response format
 */
export function formatZodError(error: z.ZodError): string {
  const firstError = error.errors[0]
  return firstError?.message || "Validation failed"
}

/**
 * Legacy ValidationResult type for backward compatibility
 */
export interface ValidationResult {
  valid: boolean
  error?: string
  status?: number
}

/**
 * Helper: Convert Zod validation to ValidationResult
 */
export function zodToValidationResult<T>(
  result: z.SafeParseReturnType<T, T>
): ValidationResult & { data?: T } {
  if (result.success) {
    return { valid: true, data: result.data }
  }
  return {
    valid: false,
    error: formatZodError(result.error),
    status: 400,
  }
}
