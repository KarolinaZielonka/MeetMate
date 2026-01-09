import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import {
  formatDateForAPI,
  formatDateForDisplay,
  formatDateRange,
  formatDateShort,
  getDateRangeLength,
  getDatesInRange,
  getDayOfWeek,
  getDayOfWeekLetter,
  getDayOfWeekShort,
  isDateInRange,
  isWeekend,
  MAX_DATE_RANGE,
  parseDate,
  parseDateAsLocal,
  validateDateRange,
  WARNING_DATE_RANGE,
} from "@/lib/utils/dates"

describe("dates utilities", () => {
  describe("parseDate", () => {
    it("should parse Date objects correctly", () => {
      const date = new Date("2026-02-01")
      const result = parseDate(date)
      expect(result).toBeInstanceOf(Date)
      expect(result.toISOString().split("T")[0]).toBe("2026-02-01")
    })

    it("should parse ISO strings correctly", () => {
      const result = parseDate("2026-02-15T10:00:00Z")
      expect(result).toBeInstanceOf(Date)
      expect(result.toISOString()).toBe("2026-02-15T10:00:00.000Z")
    })

    it("should parse date-only strings correctly (YYYY-MM-DD)", () => {
      const result = parseDate("2026-03-25")
      expect(result).toBeInstanceOf(Date)
      // Use formatDateForAPI instead of toISOString to avoid timezone issues
      expect(formatDateForAPI(result)).toBe("2026-03-25")
    })
  })

  describe("parseDateAsLocal", () => {
    it("should parse YYYY-MM-DD as local midnight", () => {
      const result = parseDateAsLocal("2026-01-02")
      expect(result).toBeInstanceOf(Date)
      expect(result.getFullYear()).toBe(2026)
      expect(result.getMonth()).toBe(0) // January (0-indexed)
      expect(result.getDate()).toBe(2)
    })

    it("should not shift date due to timezone", () => {
      // This is the key test - ensures Jan 2nd stays Jan 2nd regardless of timezone
      const result = parseDateAsLocal("2026-01-02")
      expect(formatDateForAPI(result)).toBe("2026-01-02")
    })

    it("should handle year boundaries correctly", () => {
      const result = parseDateAsLocal("2025-12-31")
      expect(result.getFullYear()).toBe(2025)
      expect(result.getMonth()).toBe(11) // December (0-indexed)
      expect(result.getDate()).toBe(31)
    })

    it("should handle first day of month correctly", () => {
      const result = parseDateAsLocal("2026-03-01")
      expect(result.getDate()).toBe(1)
      expect(result.getMonth()).toBe(2) // March (0-indexed)
    })
  })

  describe("formatDateForAPI", () => {
    it("should format date as YYYY-MM-DD", () => {
      const date = new Date("2026-02-01T10:30:00Z")
      const result = formatDateForAPI(date)
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    })

    it("should format dates consistently", () => {
      const date = new Date(2026, 0, 15) // January 15, 2026
      const result = formatDateForAPI(date)
      expect(result).toBe("2026-01-15")
    })
  })

  describe("formatDateForDisplay", () => {
    it("should format date with day name", () => {
      const date = new Date(2026, 0, 15) // January 15, 2026 (Thursday)
      const result = formatDateForDisplay(date, true)
      expect(result).toContain("Jan")
      expect(result).toContain("15")
      expect(result).toContain("2026")
      expect(result).toContain("Thu") // Day name
    })

    it("should format date without day name", () => {
      const date = new Date(2026, 0, 15)
      const result = formatDateForDisplay(date, false)
      expect(result).toBe("Jan 15, 2026")
    })
  })

  describe("formatDateShort", () => {
    it("should format date as MMM d", () => {
      const date = new Date(2026, 0, 15)
      const result = formatDateShort(date)
      expect(result).toBe("Jan 15")
    })
  })

  describe("formatDateRange", () => {
    it("should format same month and year correctly", () => {
      const start = new Date(2026, 0, 15) // Jan 15, 2026
      const end = new Date(2026, 0, 20) // Jan 20, 2026
      const result = formatDateRange(start, end)
      expect(result).toBe("Jan 15 - 20, 2026")
    })

    it("should format different months, same year correctly", () => {
      const start = new Date(2026, 0, 15) // Jan 15, 2026
      const end = new Date(2026, 1, 20) // Feb 20, 2026
      const result = formatDateRange(start, end)
      expect(result).toBe("Jan 15 - Feb 20, 2026")
    })

    it("should format different years correctly", () => {
      const start = new Date(2025, 11, 30) // Dec 30, 2025
      const end = new Date(2026, 0, 5) // Jan 5, 2026
      const result = formatDateRange(start, end)
      expect(result).toBe("Dec 30, 2025 - Jan 5, 2026")
    })
  })

  describe("validateDateRange", () => {
    beforeEach(() => {
      // Mock current date to ensure consistent tests
      vi.useFakeTimers()
      vi.setSystemTime(new Date("2026-01-03T00:00:00Z"))
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it("should validate correct date range", () => {
      const start = new Date("2026-02-01")
      const end = new Date("2026-02-07")
      const result = validateDateRange(start, end)
      expect(result.valid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it("should reject when start is after end", () => {
      const start = new Date("2026-02-10")
      const end = new Date("2026-02-05")
      const result = validateDateRange(start, end)
      expect(result.valid).toBe(false)
      expect(result.error).toBe("Start date must be before end date")
    })

    it("should reject when start equals end", () => {
      const start = new Date("2026-02-05")
      const end = new Date("2026-02-05")
      const result = validateDateRange(start, end)
      expect(result.valid).toBe(false)
      expect(result.error).toBe("Start date must be before end date")
    })

    it("should reject when start is in the past", () => {
      const start = new Date("2025-12-01") // Past date
      const end = new Date("2026-02-01")
      const result = validateDateRange(start, end)
      expect(result.valid).toBe(false)
      expect(result.error).toBe("Start date cannot be in the past")
    })

    it("should reject when range exceeds MAX_DATE_RANGE", () => {
      const start = new Date("2026-02-01")
      const end = new Date(start)
      end.setDate(end.getDate() + MAX_DATE_RANGE + 1) // Exceeds max
      const result = validateDateRange(start, end)
      expect(result.valid).toBe(false)
      expect(result.error).toContain("Date range cannot exceed")
      expect(result.error).toContain(`${MAX_DATE_RANGE} days`)
    })

    it("should warn when range exceeds WARNING_DATE_RANGE", () => {
      const start = new Date("2026-02-01")
      const end = new Date(start)
      end.setDate(end.getDate() + WARNING_DATE_RANGE + 5) // Exceeds warning threshold
      const result = validateDateRange(start, end)
      expect(result.valid).toBe(true)
      expect(result.warning).toContain("Large date ranges may be harder")
    })

    it("should handle string dates", () => {
      const result = validateDateRange("2026-02-01", "2026-02-07")
      expect(result.valid).toBe(true)
    })
  })

  describe("getDatesInRange", () => {
    it("should generate correct date array", () => {
      const start = new Date("2026-02-01")
      const end = new Date("2026-02-03")
      const result = getDatesInRange(start, end)

      expect(result).toHaveLength(3)
      expect(formatDateForAPI(result[0])).toBe("2026-02-01")
      expect(formatDateForAPI(result[1])).toBe("2026-02-02")
      expect(formatDateForAPI(result[2])).toBe("2026-02-03")
    })

    it("should handle single day range", () => {
      const start = new Date("2026-02-01")
      const end = new Date("2026-02-01")
      const result = getDatesInRange(start, end)

      expect(result).toHaveLength(1)
      expect(formatDateForAPI(result[0])).toBe("2026-02-01")
    })

    it("should handle longer ranges", () => {
      const start = new Date("2026-01-01")
      const end = new Date("2026-01-10")
      const result = getDatesInRange(start, end)

      expect(result).toHaveLength(10)
    })
  })

  describe("getDateRangeLength", () => {
    it("should calculate correct range length", () => {
      const start = new Date("2026-02-01")
      const end = new Date("2026-02-07")
      const result = getDateRangeLength(start, end)
      expect(result).toBe(7) // Inclusive: Feb 1, 2, 3, 4, 5, 6, 7
    })

    it("should return 1 for same day", () => {
      const start = new Date("2026-02-01")
      const end = new Date("2026-02-01")
      const result = getDateRangeLength(start, end)
      expect(result).toBe(1)
    })

    it("should handle string dates", () => {
      const result = getDateRangeLength("2026-02-01", "2026-02-10")
      expect(result).toBe(10)
    })
  })

  describe("isDateInRange", () => {
    it("should return true for date within range", () => {
      const date = new Date("2026-02-05")
      const start = new Date("2026-02-01")
      const end = new Date("2026-02-10")
      expect(isDateInRange(date, start, end)).toBe(true)
    })

    it("should return true for date at start boundary", () => {
      const date = new Date("2026-02-01")
      const start = new Date("2026-02-01")
      const end = new Date("2026-02-10")
      expect(isDateInRange(date, start, end)).toBe(true)
    })

    it("should return true for date at end boundary", () => {
      const date = new Date("2026-02-10")
      const start = new Date("2026-02-01")
      const end = new Date("2026-02-10")
      expect(isDateInRange(date, start, end)).toBe(true)
    })

    it("should return false for date before range", () => {
      const date = new Date("2026-01-31")
      const start = new Date("2026-02-01")
      const end = new Date("2026-02-10")
      expect(isDateInRange(date, start, end)).toBe(false)
    })

    it("should return false for date after range", () => {
      const date = new Date("2026-02-11")
      const start = new Date("2026-02-01")
      const end = new Date("2026-02-10")
      expect(isDateInRange(date, start, end)).toBe(false)
    })
  })

  describe("getDayOfWeek", () => {
    it("should return full day name", () => {
      const date = new Date(2026, 0, 15) // Thursday
      const result = getDayOfWeek(date)
      expect(result).toContain("Thu")
    })
  })

  describe("getDayOfWeekShort", () => {
    it("should return short day name", () => {
      const date = new Date(2026, 0, 15) // Thursday
      const result = getDayOfWeekShort(date)
      expect(result).toMatch(/^[A-Z][a-z]{2}$/) // 3-letter format
    })
  })

  describe("getDayOfWeekLetter", () => {
    it("should return single letter", () => {
      const date = new Date(2026, 0, 15) // Thursday
      const result = getDayOfWeekLetter(date)
      expect(result).toHaveLength(1)
    })
  })

  describe("isWeekend", () => {
    it("should return true for Saturday", () => {
      const saturday = new Date(2026, 0, 17) // Saturday
      expect(isWeekend(saturday)).toBe(true)
    })

    it("should return true for Sunday", () => {
      const sunday = new Date(2026, 0, 18) // Sunday
      expect(isWeekend(sunday)).toBe(true)
    })

    it("should return false for weekday", () => {
      const thursday = new Date(2026, 0, 15) // Thursday
      expect(isWeekend(thursday)).toBe(false)
    })

    it("should return false for Monday", () => {
      const monday = new Date(2026, 0, 19) // Monday
      expect(isWeekend(monday)).toBe(false)
    })

    it("should return false for Friday", () => {
      const friday = new Date(2026, 0, 16) // Friday
      expect(isWeekend(friday)).toBe(false)
    })
  })
})
