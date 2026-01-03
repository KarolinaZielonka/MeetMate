import { describe, expect, it } from "vitest"
import {
  generateAccessToken,
  hashPassword,
  validatePasswordStrength,
  verifyPassword,
} from "@/lib/utils/auth"

describe("auth utilities", () => {
  describe("hashPassword", () => {
    it("should hash a password successfully", async () => {
      const password = "my-secure-password"
      const hash = await hashPassword(password)

      expect(hash).toBeTruthy()
      expect(hash).not.toBe(password) // Hash should not equal plain text
      expect(hash.length).toBeGreaterThan(20) // bcrypt hashes are long
    })

    it("should generate different hashes for same password (salt)", async () => {
      const password = "same-password"
      const hash1 = await hashPassword(password)
      const hash2 = await hashPassword(password)

      expect(hash1).not.toBe(hash2) // Different salts = different hashes
    })

    it("should throw error for empty password", async () => {
      await expect(hashPassword("")).rejects.toThrow("Password cannot be empty")
    })

    it("should hash long passwords", async () => {
      const longPassword = "a".repeat(100)
      const hash = await hashPassword(longPassword)
      expect(hash).toBeTruthy()
    })
  })

  describe("verifyPassword", () => {
    it("should return true for correct password", async () => {
      const password = "correct-password"
      const hash = await hashPassword(password)

      const result = await verifyPassword(password, hash)
      expect(result).toBe(true)
    })

    it("should return false for incorrect password", async () => {
      const correctPassword = "correct-password"
      const wrongPassword = "wrong-password"
      const hash = await hashPassword(correctPassword)

      const result = await verifyPassword(wrongPassword, hash)
      expect(result).toBe(false)
    })

    it("should return false for empty password", async () => {
      const hash = await hashPassword("password")
      const result = await verifyPassword("", hash)
      expect(result).toBe(false)
    })

    it("should return false for empty hash", async () => {
      const result = await verifyPassword("password", "")
      expect(result).toBe(false)
    })

    it("should be case sensitive", async () => {
      const password = "Password123"
      const hash = await hashPassword(password)

      const resultLower = await verifyPassword("password123", hash)
      const resultUpper = await verifyPassword("PASSWORD123", hash)

      expect(resultLower).toBe(false)
      expect(resultUpper).toBe(false)
    })

    it("should handle special characters", async () => {
      const password = "p@ssw0rd!#$%^&*()"
      const hash = await hashPassword(password)

      const result = await verifyPassword(password, hash)
      expect(result).toBe(true)
    })

    it("should not be reversible (security check)", async () => {
      const password = "secret-password"
      const hash = await hashPassword(password)

      // Hash should not contain password
      expect(hash).not.toContain(password)
    })
  })

  describe("validatePasswordStrength", () => {
    it("should validate correct password", () => {
      const result = validatePasswordStrength("password123")
      expect(result.valid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it("should reject empty password", () => {
      const result = validatePasswordStrength("")
      expect(result.valid).toBe(false)
      expect(result.error).toBe("Password is required")
    })

    it("should reject password shorter than 6 characters", () => {
      const result = validatePasswordStrength("12345")
      expect(result.valid).toBe(false)
      expect(result.error).toBe("Password must be at least 6 characters long")
    })

    it("should accept password exactly 6 characters", () => {
      const result = validatePasswordStrength("123456")
      expect(result.valid).toBe(true)
    })

    it("should reject password longer than 128 characters", () => {
      const longPassword = "a".repeat(129)
      const result = validatePasswordStrength(longPassword)
      expect(result.valid).toBe(false)
      expect(result.error).toBe("Password must be less than 128 characters")
    })

    it("should accept password exactly 128 characters", () => {
      const password = "a".repeat(128)
      const result = validatePasswordStrength(password)
      expect(result.valid).toBe(true)
    })

    it("should accept password with special characters", () => {
      const result = validatePasswordStrength("p@ssw0rd!")
      expect(result.valid).toBe(true)
    })

    it("should accept password with spaces", () => {
      const result = validatePasswordStrength("my password 123")
      expect(result.valid).toBe(true)
    })
  })

  describe("generateAccessToken", () => {
    it("should generate a valid UUID v4", () => {
      const token = generateAccessToken()

      // UUID v4 format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
      const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      expect(token).toMatch(uuidV4Regex)
    })

    it("should generate unique tokens", () => {
      const token1 = generateAccessToken()
      const token2 = generateAccessToken()
      const token3 = generateAccessToken()

      expect(token1).not.toBe(token2)
      expect(token2).not.toBe(token3)
      expect(token1).not.toBe(token3)
    })

    it("should generate tokens of correct length", () => {
      const token = generateAccessToken()
      expect(token.length).toBe(36) // UUID format with hyphens
    })

    it("should generate lowercase tokens", () => {
      const token = generateAccessToken()
      expect(token).toBe(token.toLowerCase())
    })
  })
})
