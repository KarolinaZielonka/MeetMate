import { beforeEach, describe, expect, it, vi } from "vitest"
import {
  calculateOptimalDates,
  formatDateScore,
  hasMinimumAvailability,
} from "@/lib/utils/dateCalculation"
import type { DateScore } from "@/types"

// Mock the Supabase client
vi.mock("@/lib/supabase/client", () => ({
  supabase: {
    from: vi.fn(),
  },
}))

import { supabase } from "@/lib/supabase/client"

describe("dateCalculation", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("calculateOptimalDates", () => {
    it("should calculate scores correctly with all participants available on same date", async () => {
      const mockEventId = "test-event-id"
      const mockParticipants = [
        { id: "participant-1" },
        { id: "participant-2" },
        { id: "participant-3" },
      ]
      const mockAvailability = [
        {
          date: "2026-02-01",
          status: "available",
          participant_id: "participant-1",
        },
        {
          date: "2026-02-01",
          status: "available",
          participant_id: "participant-2",
        },
        {
          date: "2026-02-01",
          status: "available",
          participant_id: "participant-3",
        },
        {
          date: "2026-02-02",
          status: "available",
          participant_id: "participant-1",
        },
        { date: "2026-02-02", status: "maybe", participant_id: "participant-2" },
        {
          date: "2026-02-02",
          status: "unavailable",
          participant_id: "participant-3",
        },
      ]

      // Mock Supabase responses
      vi.mocked(supabase.from).mockImplementation((table: string) => {
        if (table === "participants") {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({
                data: mockParticipants,
                error: null,
              }),
            }),
          } as never
        }
        if (table === "availability") {
          return {
            select: vi.fn().mockReturnValue({
              in: vi.fn().mockReturnValue({
                order: vi.fn().mockResolvedValue({
                  data: mockAvailability,
                  error: null,
                }),
              }),
            }),
          } as never
        }
        return {} as never
      })

      const result = await calculateOptimalDates(mockEventId)

      expect(result).toHaveLength(2)
      expect(result[0]).toEqual({
        date: "2026-02-01",
        score: 1.0, // All 3 available
        availableCount: 3,
        maybeCount: 0,
        unavailableCount: 0,
        totalParticipants: 3,
      })
      expect(result[1]).toEqual({
        date: "2026-02-02",
        score: 0.5, // 1 available (1.0), 1 maybe (0.5), 1 unavailable (0.0) = 1.5/3 = 0.5
        availableCount: 1,
        maybeCount: 1,
        unavailableCount: 1,
        totalParticipants: 3,
      })
    })

    it("should handle mixed availability statuses", async () => {
      const mockEventId = "test-event-id"
      const mockParticipants = [
        { id: "participant-1" },
        { id: "participant-2" },
        { id: "participant-3" },
        { id: "participant-4" },
      ]
      const mockAvailability = [
        {
          date: "2026-02-01",
          status: "available",
          participant_id: "participant-1",
        },
        {
          date: "2026-02-01",
          status: "available",
          participant_id: "participant-2",
        },
        { date: "2026-02-01", status: "maybe", participant_id: "participant-3" },
        {
          date: "2026-02-01",
          status: "unavailable",
          participant_id: "participant-4",
        },
      ]

      vi.mocked(supabase.from).mockImplementation((table: string) => {
        if (table === "participants") {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({
                data: mockParticipants,
                error: null,
              }),
            }),
          } as never
        }
        if (table === "availability") {
          return {
            select: vi.fn().mockReturnValue({
              in: vi.fn().mockReturnValue({
                order: vi.fn().mockResolvedValue({
                  data: mockAvailability,
                  error: null,
                }),
              }),
            }),
          } as never
        }
        return {} as never
      })

      const result = await calculateOptimalDates(mockEventId)

      expect(result).toHaveLength(1)
      // 2 available (2.0) + 1 maybe (0.5) + 1 unavailable (0.0) = 2.5 / 4 = 0.625
      expect(result[0].score).toBeCloseTo(0.625, 3)
      expect(result[0].availableCount).toBe(2)
      expect(result[0].maybeCount).toBe(1)
      expect(result[0].unavailableCount).toBe(1)
    })

    it("should sort dates by score (descending)", async () => {
      const mockEventId = "test-event-id"
      const mockParticipants = [{ id: "participant-1" }, { id: "participant-2" }]
      const mockAvailability = [
        { date: "2026-02-01", status: "maybe", participant_id: "participant-1" },
        { date: "2026-02-01", status: "maybe", participant_id: "participant-2" },
        {
          date: "2026-02-02",
          status: "available",
          participant_id: "participant-1",
        },
        {
          date: "2026-02-02",
          status: "available",
          participant_id: "participant-2",
        },
        {
          date: "2026-02-03",
          status: "unavailable",
          participant_id: "participant-1",
        },
        {
          date: "2026-02-03",
          status: "unavailable",
          participant_id: "participant-2",
        },
      ]

      vi.mocked(supabase.from).mockImplementation((table: string) => {
        if (table === "participants") {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({
                data: mockParticipants,
                error: null,
              }),
            }),
          } as never
        }
        if (table === "availability") {
          return {
            select: vi.fn().mockReturnValue({
              in: vi.fn().mockReturnValue({
                order: vi.fn().mockResolvedValue({
                  data: mockAvailability,
                  error: null,
                }),
              }),
            }),
          } as never
        }
        return {} as never
      })

      const result = await calculateOptimalDates(mockEventId)

      expect(result).toHaveLength(3)
      expect(result[0].date).toBe("2026-02-02") // Highest score
      expect(result[0].score).toBe(1.0)
      expect(result[1].date).toBe("2026-02-01")
      expect(result[1].score).toBe(0.5)
      expect(result[2].date).toBe("2026-02-03") // Lowest score
      expect(result[2].score).toBe(0.0)
    })

    it("should return empty array when no participants exist", async () => {
      const mockEventId = "test-event-id"

      vi.mocked(supabase.from).mockImplementation((table: string) => {
        if (table === "participants") {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({
                data: [],
                error: null,
              }),
            }),
          } as never
        }
        return {} as never
      })

      const result = await calculateOptimalDates(mockEventId)

      expect(result).toEqual([])
    })

    it("should return empty array when no availability data exists", async () => {
      const mockEventId = "test-event-id"
      const mockParticipants = [{ id: "participant-1" }]

      vi.mocked(supabase.from).mockImplementation((table: string) => {
        if (table === "participants") {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({
                data: mockParticipants,
                error: null,
              }),
            }),
          } as never
        }
        if (table === "availability") {
          return {
            select: vi.fn().mockReturnValue({
              in: vi.fn().mockReturnValue({
                order: vi.fn().mockResolvedValue({
                  data: [],
                  error: null,
                }),
              }),
            }),
          } as never
        }
        return {} as never
      })

      const result = await calculateOptimalDates(mockEventId)

      expect(result).toEqual([])
    })

    it("should handle single participant correctly", async () => {
      const mockEventId = "test-event-id"
      const mockParticipants = [{ id: "participant-1" }]
      const mockAvailability = [
        {
          date: "2026-02-01",
          status: "available",
          participant_id: "participant-1",
        },
        { date: "2026-02-02", status: "maybe", participant_id: "participant-1" },
      ]

      vi.mocked(supabase.from).mockImplementation((table: string) => {
        if (table === "participants") {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({
                data: mockParticipants,
                error: null,
              }),
            }),
          } as never
        }
        if (table === "availability") {
          return {
            select: vi.fn().mockReturnValue({
              in: vi.fn().mockReturnValue({
                order: vi.fn().mockResolvedValue({
                  data: mockAvailability,
                  error: null,
                }),
              }),
            }),
          } as never
        }
        return {} as never
      })

      const result = await calculateOptimalDates(mockEventId)

      expect(result).toHaveLength(2)
      expect(result[0].score).toBe(1.0) // available
      expect(result[1].score).toBe(0.5) // maybe
    })

    it("should throw error when fetching participants fails", async () => {
      const mockEventId = "test-event-id"

      vi.mocked(supabase.from).mockImplementation((table: string) => {
        if (table === "participants") {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({
                data: null,
                error: { message: "Database error" },
              }),
            }),
          } as never
        }
        return {} as never
      })

      await expect(calculateOptimalDates(mockEventId)).rejects.toThrow(
        "Failed to fetch participants"
      )
    })

    it("should throw error when fetching availability fails", async () => {
      const mockEventId = "test-event-id"
      const mockParticipants = [{ id: "participant-1" }]

      vi.mocked(supabase.from).mockImplementation((table: string) => {
        if (table === "participants") {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({
                data: mockParticipants,
                error: null,
              }),
            }),
          } as never
        }
        if (table === "availability") {
          return {
            select: vi.fn().mockReturnValue({
              in: vi.fn().mockReturnValue({
                order: vi.fn().mockResolvedValue({
                  data: null,
                  error: { message: "Database error" },
                }),
              }),
            }),
          } as never
        }
        return {} as never
      })

      await expect(calculateOptimalDates(mockEventId)).rejects.toThrow(
        "Failed to fetch availability data"
      )
    })
  })

  describe("formatDateScore", () => {
    it("should format date score correctly", () => {
      const dateScore: DateScore = {
        date: "2026-02-01",
        score: 0.75,
        availableCount: 3,
        maybeCount: 1,
        unavailableCount: 1,
        totalParticipants: 5,
      }

      const result = formatDateScore(dateScore)

      expect(result).toBe("75% (3 available, 1 maybe, 1 unavailable)")
    })

    it("should round percentage correctly", () => {
      const dateScore: DateScore = {
        date: "2026-02-01",
        score: 0.666666,
        availableCount: 2,
        maybeCount: 0,
        unavailableCount: 1,
        totalParticipants: 3,
      }

      const result = formatDateScore(dateScore)

      expect(result).toBe("67% (2 available, 0 maybe, 1 unavailable)")
    })
  })

  describe("hasMinimumAvailability", () => {
    it("should return true when score meets default threshold (0.5)", () => {
      const dateScore: DateScore = {
        date: "2026-02-01",
        score: 0.5,
        availableCount: 1,
        maybeCount: 1,
        unavailableCount: 0,
        totalParticipants: 2,
      }

      expect(hasMinimumAvailability(dateScore)).toBe(true)
    })

    it("should return false when score is below default threshold", () => {
      const dateScore: DateScore = {
        date: "2026-02-01",
        score: 0.49,
        availableCount: 0,
        maybeCount: 1,
        unavailableCount: 1,
        totalParticipants: 2,
      }

      expect(hasMinimumAvailability(dateScore)).toBe(false)
    })

    it("should respect custom threshold", () => {
      const dateScore: DateScore = {
        date: "2026-02-01",
        score: 0.7,
        availableCount: 2,
        maybeCount: 1,
        unavailableCount: 0,
        totalParticipants: 3,
      }

      expect(hasMinimumAvailability(dateScore, 0.8)).toBe(false)
      expect(hasMinimumAvailability(dateScore, 0.6)).toBe(true)
    })
  })
})
