import bcrypt from "bcryptjs"

/**
 * Number of salt rounds for bcrypt hashing
 * Higher number = more secure but slower
 * 8 rounds = ~30-40ms hashing time (good balance for event passwords)
 * Events are not high-value targets, so 8 rounds provides adequate security
 */
const SALT_ROUNDS = 8

/**
 * Hash a password using bcrypt
 * @param password - Plain text password to hash
 * @returns Promise resolving to hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  if (!password || password.length === 0) {
    throw new Error("Password cannot be empty")
  }

  try {
    const hash = await bcrypt.hash(password, SALT_ROUNDS)
    return hash
  } catch (error) {
    console.error("Error hashing password:", error)
    throw new Error("Failed to hash password")
  }
}

/**
 * Verify a password against a hash
 * @param password - Plain text password to verify
 * @param hash - Hashed password to compare against
 * @returns Promise resolving to true if password matches, false otherwise
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  if (!password || !hash) {
    return false
  }

  try {
    const isMatch = await bcrypt.compare(password, hash)
    return isMatch
  } catch (error) {
    console.error("Error verifying password:", error)
    return false
  }
}

/**
 * Validate password strength
 * Returns { valid: boolean, error?: string }
 */
export interface PasswordValidation {
  valid: boolean
  error?: string
}

export function validatePasswordStrength(password: string): PasswordValidation {
  if (!password || password.length === 0) {
    return {
      valid: false,
      error: "Password is required",
    }
  }

  if (password.length < 6) {
    return {
      valid: false,
      error: "Password must be at least 6 characters long",
    }
  }

  if (password.length > 128) {
    return {
      valid: false,
      error: "Password must be less than 128 characters",
    }
  }

  return { valid: true }
}

/**
 * Generate a random access token (UUID v4)
 * Used for temporary password verification tokens
 */
export function generateAccessToken(): string {
  return crypto.randomUUID()
}
