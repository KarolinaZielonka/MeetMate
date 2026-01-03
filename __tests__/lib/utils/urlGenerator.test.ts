import { describe, expect, it } from "vitest"
import { generateShareUrl } from "@/lib/utils/urlGenerator"

describe("urlGenerator", () => {
  describe("generateShareUrl", () => {
    it("should generate URL in correct format (adjective-noun-number)", () => {
      const url = generateShareUrl()

      // Format: adjective-noun-number (e.g., "sunny-dolphin-42")
      const parts = url.split("-")
      expect(parts).toHaveLength(3)

      const [adjective, noun, number] = parts

      // Check adjective exists (at least 3 characters)
      expect(adjective.length).toBeGreaterThanOrEqual(3)

      // Check noun exists (at least 3 characters)
      expect(noun.length).toBeGreaterThanOrEqual(3)

      // Check number is 2 digits (10-99)
      expect(number).toMatch(/^\d{2}$/)
      const numValue = parseInt(number, 10)
      expect(numValue).toBeGreaterThanOrEqual(10)
      expect(numValue).toBeLessThanOrEqual(99)
    })

    it("should generate URL-safe strings (no special characters)", () => {
      const url = generateShareUrl()

      // Should only contain lowercase letters, numbers, and hyphens
      expect(url).toMatch(/^[a-z]+-[a-z]+-\d{2}$/)
    })

    it("should generate readable URLs (all lowercase)", () => {
      const url = generateShareUrl()
      expect(url).toBe(url.toLowerCase())
    })

    it("should generate different URLs on multiple calls (randomness)", () => {
      const urls = new Set<string>()
      const iterations = 100

      for (let i = 0; i < iterations; i++) {
        urls.add(generateShareUrl())
      }

      // With good randomness, we should have many unique URLs
      // (40 adjectives * 37 nouns * 90 numbers = 133,200 possible combinations)
      // Getting 100 unique URLs should be trivial
      expect(urls.size).toBeGreaterThan(50) // At least 50% unique
    })

    it("should generate consistent length URLs", () => {
      const url1 = generateShareUrl()
      const url2 = generateShareUrl()
      const url3 = generateShareUrl()

      // Length may vary slightly due to different word lengths
      // But should be in reasonable range (15-30 characters typical)
      expect(url1.length).toBeGreaterThan(10)
      expect(url1.length).toBeLessThan(40)
      expect(url2.length).toBeGreaterThan(10)
      expect(url2.length).toBeLessThan(40)
      expect(url3.length).toBeGreaterThan(10)
      expect(url3.length).toBeLessThan(40)
    })

    it("should not include spaces", () => {
      const url = generateShareUrl()
      expect(url).not.toContain(" ")
    })

    it("should not include uppercase letters", () => {
      const url = generateShareUrl()
      expect(url).toBe(url.toLowerCase())
      expect(url).not.toMatch(/[A-Z]/)
    })

    it("should generate valid URLs for database storage", () => {
      const url = generateShareUrl()

      // Check it can be used in database PRIMARY KEY or UNIQUE constraint
      expect(url.length).toBeGreaterThan(0)
      expect(url.length).toBeLessThan(255) // Typical VARCHAR limit
    })

    it("should generate URLs suitable for web paths", () => {
      const url = generateShareUrl()

      // Should work in URLs like: /e/[shareUrl]
      // No need for URL encoding
      expect(encodeURIComponent(url)).toBe(url)
    })

    it("should have good distribution across number range", () => {
      const numbers = new Set<string>()

      // Generate many URLs and extract numbers
      for (let i = 0; i < 200; i++) {
        const url = generateShareUrl()
        const number = url.split("-")[2]
        numbers.add(number)
      }

      // Should have good variety of numbers (at least 30 different ones out of 90 possible)
      expect(numbers.size).toBeGreaterThan(30)
    })

    it("should be human-readable and memorable", () => {
      const url = generateShareUrl()

      // Split and verify parts are actual words (not gibberish)
      const parts = url.split("-")

      // Each part should have vowels (making it readable)
      const hasVowels = (str: string) => /[aeiou]/.test(str)

      expect(hasVowels(parts[0]) || hasVowels(parts[1])).toBe(true) // At least one word has vowels
    })
  })
})
