/**
 * API Utilities - Generic handlers and helpers for Next.js API routes
 *
 * @example Using Zod schemas (recommended):
 * ```typescript
 * import { createApiHandler, createEventSchema, zodToValidationResult } from '@/lib/api'
 *
 * export const POST = createApiHandler({
 *   parseBody: async (req) => req.json(),
 *   validate: async (body) => zodToValidationResult(createEventSchema.safeParse(body)),
 *   handler: async (body, params, client) => {
 *     // body is type-safe!
 *   }
 * })
 * ```
 *
 * @example Using legacy validators (deprecated):
 * ```typescript
 * import { createApiHandler, validateRequired, fetchSingleRecord } from '@/lib/api'
 *
 * export const GET = createApiHandler<never, Event>({
 *   validate: async (_body, params) => validateRequired(params, ['shareUrl']),
 *   handler: async (_body, params, client) => {
 *     return await fetchSingleRecord(client, 'events', 'share_url', params.shareUrl)
 *   }
 * })
 * ```
 */

// Core handler and types
export type { ApiHandlerConfig, ApiResponse } from "./handlers"
export {
  ApiError,
  createApiHandler,
  deleteRecord,
  fetchRecords,
  fetchSingleRecord,
  insertRecord,
  updateRecord,
} from "./handlers"

// Zod schemas (recommended for new code)
export * from "./schemas"

// Legacy validation utilities (deprecated - use Zod schemas instead)
export type { ValidationResult } from "./validation"
export {
  combineValidations,
  validateArray,
  validateBoolean,
  validateDateFormat,
  validateEmail,
  validateEnum,
  validateNumber,
  validateObject,
  validateRequired,
  validateString,
  validateURL,
  validateUUID,
} from "./validation"
