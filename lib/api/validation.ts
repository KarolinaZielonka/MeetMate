/**
 * Validation result
 */
export interface ValidationResult {
  valid: boolean
  error?: string
  status?: number
}

/**
 * Helper: Validate required fields
 */
export function validateRequired(
  fields: Record<string, unknown>,
  requiredFields: string[]
): ValidationResult {
  for (const field of requiredFields) {
    if (!fields[field]) {
      return {
        valid: false,
        error: `${field} is required`,
        status: 400,
      }
    }
  }
  return { valid: true }
}

/**
 * Helper: Validate string field
 */
export function validateString(
  value: unknown,
  fieldName: string,
  options?: { minLength?: number; maxLength?: number; pattern?: RegExp }
): ValidationResult {
  if (typeof value !== "string") {
    return {
      valid: false,
      error: `${fieldName} must be a string`,
      status: 400,
    }
  }

  if (options?.minLength && value.length < options.minLength) {
    return {
      valid: false,
      error: `${fieldName} must be at least ${options.minLength} characters`,
      status: 400,
    }
  }

  if (options?.maxLength && value.length > options.maxLength) {
    return {
      valid: false,
      error: `${fieldName} must be at most ${options.maxLength} characters`,
      status: 400,
    }
  }

  if (options?.pattern && !options.pattern.test(value)) {
    return {
      valid: false,
      error: `${fieldName} has invalid format`,
      status: 400,
    }
  }

  return { valid: true }
}

/**
 * Helper: Validate number field
 */
export function validateNumber(
  value: unknown,
  fieldName: string,
  options?: { min?: number; max?: number; integer?: boolean }
): ValidationResult {
  if (typeof value !== "number") {
    return {
      valid: false,
      error: `${fieldName} must be a number`,
      status: 400,
    }
  }

  if (Number.isNaN(value)) {
    return {
      valid: false,
      error: `${fieldName} must be a valid number`,
      status: 400,
    }
  }

  if (options?.integer && !Number.isInteger(value)) {
    return {
      valid: false,
      error: `${fieldName} must be an integer`,
      status: 400,
    }
  }

  if (options?.min !== undefined && value < options.min) {
    return {
      valid: false,
      error: `${fieldName} must be at least ${options.min}`,
      status: 400,
    }
  }

  if (options?.max !== undefined && value > options.max) {
    return {
      valid: false,
      error: `${fieldName} must be at most ${options.max}`,
      status: 400,
    }
  }

  return { valid: true }
}

/**
 * Helper: Validate boolean field
 */
export function validateBoolean(value: unknown, fieldName: string): ValidationResult {
  if (typeof value !== "boolean") {
    return {
      valid: false,
      error: `${fieldName} must be a boolean`,
      status: 400,
    }
  }

  return { valid: true }
}

/**
 * Helper: Validate array field
 */
export function validateArray(
  value: unknown,
  fieldName: string,
  options?: {
    minLength?: number
    maxLength?: number
    itemValidator?: (item: unknown, index: number) => ValidationResult
  }
): ValidationResult {
  if (!Array.isArray(value)) {
    return {
      valid: false,
      error: `${fieldName} must be an array`,
      status: 400,
    }
  }

  if (options?.minLength !== undefined && value.length < options.minLength) {
    return {
      valid: false,
      error: `${fieldName} must have at least ${options.minLength} items`,
      status: 400,
    }
  }

  if (options?.maxLength !== undefined && value.length > options.maxLength) {
    return {
      valid: false,
      error: `${fieldName} must have at most ${options.maxLength} items`,
      status: 400,
    }
  }

  // Validate individual items if validator provided
  if (options?.itemValidator) {
    for (let i = 0; i < value.length; i++) {
      const itemValidation = options.itemValidator(value[i], i)
      if (!itemValidation.valid) {
        return {
          valid: false,
          error: `${fieldName}[${i}]: ${itemValidation.error}`,
          status: itemValidation.status || 400,
        }
      }
    }
  }

  return { valid: true }
}

/**
 * Helper: Validate date format (YYYY-MM-DD)
 */
export function validateDateFormat(date: unknown, fieldName: string): ValidationResult {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/
  return validateString(date, fieldName, { pattern: dateRegex })
}

/**
 * Helper: Validate email format
 */
export function validateEmail(email: unknown, fieldName: string): ValidationResult {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return validateString(email, fieldName, { pattern: emailRegex })
}

/**
 * Helper: Validate UUID format
 */
export function validateUUID(uuid: unknown, fieldName: string): ValidationResult {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  return validateString(uuid, fieldName, { pattern: uuidRegex })
}

/**
 * Helper: Validate value is one of allowed values
 */
export function validateEnum<T>(
  value: unknown,
  fieldName: string,
  allowedValues: readonly T[]
): ValidationResult {
  if (!allowedValues.includes(value as T)) {
    return {
      valid: false,
      error: `${fieldName} must be one of: ${allowedValues.join(", ")}`,
      status: 400,
    }
  }
  return { valid: true }
}

/**
 * Helper: Validate URL format
 */
export function validateURL(url: unknown, fieldName: string): ValidationResult {
  if (typeof url !== "string") {
    return {
      valid: false,
      error: `${fieldName} must be a string`,
      status: 400,
    }
  }

  try {
    new URL(url)
    return { valid: true }
  } catch {
    return {
      valid: false,
      error: `${fieldName} must be a valid URL`,
      status: 400,
    }
  }
}

/**
 * Helper: Combine multiple validation results
 * Returns the first validation that fails, or success if all pass
 */
export function combineValidations(...validations: ValidationResult[]): ValidationResult {
  for (const validation of validations) {
    if (!validation.valid) {
      return validation
    }
  }
  return { valid: true }
}

/**
 * Helper: Validate object shape
 * Validates that an object has expected keys and optionally validates each field
 */
export function validateObject(
  value: unknown,
  fieldName: string,
  options?: {
    requiredKeys?: string[]
    validators?: Record<string, (val: unknown) => ValidationResult>
  }
): ValidationResult {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return {
      valid: false,
      error: `${fieldName} must be an object`,
      status: 400,
    }
  }

  const obj = value as Record<string, unknown>

  // Check required keys
  if (options?.requiredKeys) {
    for (const key of options.requiredKeys) {
      if (!(key in obj)) {
        return {
          valid: false,
          error: `${fieldName}.${key} is required`,
          status: 400,
        }
      }
    }
  }

  // Validate individual fields
  if (options?.validators) {
    for (const [key, validator] of Object.entries(options.validators)) {
      if (key in obj) {
        const fieldValidation = validator(obj[key])
        if (!fieldValidation.valid) {
          return {
            valid: false,
            error: `${fieldName}.${key}: ${fieldValidation.error}`,
            status: fieldValidation.status || 400,
          }
        }
      }
    }
  }

  return { valid: true }
}
