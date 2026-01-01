/**
 * API Utilities - Generic handlers and helpers for Next.js API routes
 *
 * @example
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

export type { ApiHandlerConfig, ApiResponse } from "./handlers"
// Core handler and types
export {
  ApiError,
  createApiHandler,
  deleteRecord,
  fetchRecords,
  fetchSingleRecord,
  insertRecord,
  updateRecord,
} from "./handlers"
export type { ValidationResult } from "./validation"
// Validation utilities
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
