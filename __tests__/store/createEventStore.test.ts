import { HttpResponse, http } from "msw"
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest"
import { useCreateEventStore } from "@/store/createEventStore"
import { createMockEvent, createMockParticipant } from "../setup/msw-handlers"
import { server } from "../setup/msw-server"

vi.mock("@/lib/utils/session", () => ({
  initializeSession: vi.fn(),
}))

vi.mock("@/lib/utils/dates", () => ({
  validateDateRange: vi.fn((start: string, end: string) => {
    const startDate = new Date(start)
    const endDate = new Date(end)

    if (startDate >= endDate) {
      return { valid: false, error: "Start date must be before end date" }
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (startDate < today) {
      return { valid: false, error: "Start date cannot be in the past" }
    }

    const daysDiff =
      Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1

    if (daysDiff > 90) {
      return { valid: false, error: "Date range cannot exceed 90 days" }
    }

    if (daysDiff > 30) {
      return { valid: true, warning: `Date range is ${daysDiff} days. Large range warning.` }
    }

    return { valid: true }
  }),
}))

import { validateDateRange } from "@/lib/utils/dates"
import { initializeSession } from "@/lib/utils/session"

const mockInitializeSession = vi.mocked(initializeSession)
const mockValidateDateRange = vi.mocked(validateDateRange)

const t = (key: string) => key
const tApi = (key: string) => key

describe("createEventStore", () => {
  beforeAll(() => {
    server.listen({ onUnhandledRequest: "error" })
  })

  afterEach(() => {
    server.resetHandlers()
    useCreateEventStore.getState().reset()
    vi.clearAllMocks()
  })

  afterAll(() => {
    server.close()
  })

  describe("Initial State", () => {
    it("should have correct initial state", () => {
      const state = useCreateEventStore.getState()

      expect(state.formData).toEqual({
        name: "",
        startDate: "",
        endDate: "",
        creatorName: "",
        password: "",
        captchaToken: "",
        excludedDates: [],
      })
      expect(state.isLoading).toBe(false)
      expect(state.validation).toEqual({
        error: null,
        warning: null,
      })
    })
  })

  describe("setFormField", () => {
    it("should update name field", () => {
      useCreateEventStore.getState().setFormField("name", "Team Meeting")

      expect(useCreateEventStore.getState().formData.name).toBe("Team Meeting")
    })

    it("should update creatorName field", () => {
      useCreateEventStore.getState().setFormField("creatorName", "John Doe")

      expect(useCreateEventStore.getState().formData.creatorName).toBe("John Doe")
    })

    it("should update password field", () => {
      useCreateEventStore.getState().setFormField("password", "secret123")

      expect(useCreateEventStore.getState().formData.password).toBe("secret123")
    })

    it("should update captchaToken field", () => {
      useCreateEventStore.getState().setFormField("captchaToken", "captcha-token-abc")

      expect(useCreateEventStore.getState().formData.captchaToken).toBe("captcha-token-abc")
    })

    it("should clear validation error when field is updated", () => {
      useCreateEventStore.setState({
        validation: { error: "Some error", warning: null },
      })

      useCreateEventStore.getState().setFormField("name", "New Name")

      expect(useCreateEventStore.getState().validation.error).toBeNull()
    })

    it("should preserve warning when clearing error", () => {
      useCreateEventStore.setState({
        validation: { error: "Some error", warning: "Some warning" },
      })

      useCreateEventStore.getState().setFormField("name", "New Name")

      expect(useCreateEventStore.getState().validation.error).toBeNull()
      expect(useCreateEventStore.getState().validation.warning).toBe("Some warning")
    })

    it("should not change validation if no error exists", () => {
      useCreateEventStore.setState({
        validation: { error: null, warning: "Some warning" },
      })

      useCreateEventStore.getState().setFormField("name", "New Name")

      expect(useCreateEventStore.getState().validation).toEqual({
        error: null,
        warning: "Some warning",
      })
    })
  })

  describe("setDateRange", () => {
    it("should update start and end dates", () => {
      useCreateEventStore.getState().setDateRange("2026-03-01", "2026-03-07")

      const formData = useCreateEventStore.getState().formData
      expect(formData.startDate).toBe("2026-03-01")
      expect(formData.endDate).toBe("2026-03-07")
    })

    it("should clear excluded dates when date range changes", () => {
      useCreateEventStore.setState({
        formData: {
          ...useCreateEventStore.getState().formData,
          excludedDates: ["2026-02-15", "2026-02-16"],
        },
      })

      useCreateEventStore.getState().setDateRange("2026-03-01", "2026-03-07")

      expect(useCreateEventStore.getState().formData.excludedDates).toEqual([])
    })

    it("should validate date range and set error for invalid range", () => {
      mockValidateDateRange.mockReturnValueOnce({
        valid: false,
        error: "Start date must be before end date",
      })

      useCreateEventStore.getState().setDateRange("2026-03-10", "2026-03-01")

      expect(useCreateEventStore.getState().validation.error).toBe(
        "Start date must be before end date"
      )
    })

    it("should set warning for large date ranges", () => {
      mockValidateDateRange.mockReturnValueOnce({
        valid: true,
        warning: "Date range is 45 days. Large range warning.",
      })

      useCreateEventStore.getState().setDateRange("2026-03-01", "2026-04-15")

      expect(useCreateEventStore.getState().validation.error).toBeNull()
      expect(useCreateEventStore.getState().validation.warning).toBe(
        "Date range is 45 days. Large range warning."
      )
    })

    it("should clear validation for valid date range", () => {
      useCreateEventStore.setState({
        validation: { error: "Previous error", warning: "Previous warning" },
      })

      mockValidateDateRange.mockReturnValueOnce({ valid: true })

      useCreateEventStore.getState().setDateRange("2026-03-01", "2026-03-07")

      expect(useCreateEventStore.getState().validation).toEqual({
        error: null,
        warning: null,
      })
    })

    it("should not validate if dates are incomplete", () => {
      useCreateEventStore.getState().setDateRange("2026-03-01", "")

      expect(mockValidateDateRange).not.toHaveBeenCalled()
    })

    it("should handle validation error gracefully", () => {
      mockValidateDateRange.mockImplementationOnce(() => {
        throw new Error("Validation failed")
      })

      useCreateEventStore.getState().setDateRange("invalid", "dates")

      expect(useCreateEventStore.getState().validation.error).toBe("Invalid date format")
    })
  })

  describe("toggleExcludedDate", () => {
    it("should add date to excluded dates", () => {
      useCreateEventStore.getState().toggleExcludedDate("2026-03-05")

      expect(useCreateEventStore.getState().formData.excludedDates).toContain("2026-03-05")
    })

    it("should remove date from excluded dates if already exists", () => {
      useCreateEventStore.getState().toggleExcludedDate("2026-03-05")
      useCreateEventStore.getState().toggleExcludedDate("2026-03-05")

      expect(useCreateEventStore.getState().formData.excludedDates).not.toContain("2026-03-05")
    })

    it("should handle multiple excluded dates", () => {
      useCreateEventStore.getState().toggleExcludedDate("2026-03-05")
      useCreateEventStore.getState().toggleExcludedDate("2026-03-06")
      useCreateEventStore.getState().toggleExcludedDate("2026-03-07")

      const excluded = useCreateEventStore.getState().formData.excludedDates
      expect(excluded).toHaveLength(3)
      expect(excluded).toContain("2026-03-05")
      expect(excluded).toContain("2026-03-06")
      expect(excluded).toContain("2026-03-07")
    })

    it("should only remove toggled date, preserving others", () => {
      useCreateEventStore.getState().toggleExcludedDate("2026-03-05")
      useCreateEventStore.getState().toggleExcludedDate("2026-03-06")
      useCreateEventStore.getState().toggleExcludedDate("2026-03-05") // Remove this one

      const excluded = useCreateEventStore.getState().formData.excludedDates
      expect(excluded).toHaveLength(1)
      expect(excluded).toContain("2026-03-06")
    })
  })

  describe("clearExcludedDates", () => {
    it("should clear all excluded dates", () => {
      useCreateEventStore.getState().toggleExcludedDate("2026-03-05")
      useCreateEventStore.getState().toggleExcludedDate("2026-03-06")
      useCreateEventStore.getState().toggleExcludedDate("2026-03-07")

      useCreateEventStore.getState().clearExcludedDates()

      expect(useCreateEventStore.getState().formData.excludedDates).toEqual([])
    })

    it("should work when excluded dates is already empty", () => {
      useCreateEventStore.getState().clearExcludedDates()

      expect(useCreateEventStore.getState().formData.excludedDates).toEqual([])
    })
  })

  describe("validateForm", () => {
    it("should return false and set error when name is empty", () => {
      useCreateEventStore.setState({
        formData: {
          name: "",
          startDate: "2026-03-01",
          endDate: "2026-03-07",
          creatorName: "John",
          password: "",
          captchaToken: "",
          excludedDates: [],
        },
      })

      const result = useCreateEventStore.getState().validateForm(t)

      expect(result).toBe(false)
      expect(useCreateEventStore.getState().validation.error).toBe("errors.nameRequired")
    })

    it("should return false and set error when name is whitespace only", () => {
      useCreateEventStore.setState({
        formData: {
          name: "   ",
          startDate: "2026-03-01",
          endDate: "2026-03-07",
          creatorName: "John",
          password: "",
          captchaToken: "",
          excludedDates: [],
        },
      })

      const result = useCreateEventStore.getState().validateForm(t)

      expect(result).toBe(false)
      expect(useCreateEventStore.getState().validation.error).toBe("errors.nameRequired")
    })

    it("should return false and set error when dates are missing", () => {
      useCreateEventStore.setState({
        formData: {
          name: "Team Meeting",
          startDate: "",
          endDate: "",
          creatorName: "John",
          password: "",
          captchaToken: "",
          excludedDates: [],
        },
      })

      const result = useCreateEventStore.getState().validateForm(t)

      expect(result).toBe(false)
      expect(useCreateEventStore.getState().validation.error).toBe("errors.datesRequired")
    })

    it("should return false and set error when only start date is missing", () => {
      useCreateEventStore.setState({
        formData: {
          name: "Team Meeting",
          startDate: "",
          endDate: "2026-03-07",
          creatorName: "John",
          password: "",
          captchaToken: "",
          excludedDates: [],
        },
      })

      const result = useCreateEventStore.getState().validateForm(t)

      expect(result).toBe(false)
      expect(useCreateEventStore.getState().validation.error).toBe("errors.datesRequired")
    })

    it("should return false and set error when creator name is empty", () => {
      useCreateEventStore.setState({
        formData: {
          name: "Team Meeting",
          startDate: "2026-03-01",
          endDate: "2026-03-07",
          creatorName: "",
          password: "",
          captchaToken: "",
          excludedDates: [],
        },
      })

      const result = useCreateEventStore.getState().validateForm(t)

      expect(result).toBe(false)
      expect(useCreateEventStore.getState().validation.error).toBe("errors.creatorNameRequired")
    })

    it("should return true for valid form without captcha", () => {
      useCreateEventStore.setState({
        formData: {
          name: "Team Meeting",
          startDate: "2026-03-01",
          endDate: "2026-03-07",
          creatorName: "John Doe",
          password: "",
          captchaToken: "",
          excludedDates: [],
        },
      })

      const originalEnv = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
      delete process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

      const result = useCreateEventStore.getState().validateForm(t)

      process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = originalEnv

      expect(result).toBe(true)
      expect(useCreateEventStore.getState().validation.error).toBeNull()
    })

    it("should require captcha token when site key is configured", () => {
      useCreateEventStore.setState({
        formData: {
          name: "Team Meeting",
          startDate: "2026-03-01",
          endDate: "2026-03-07",
          creatorName: "John Doe",
          password: "",
          captchaToken: "",
          excludedDates: [],
        },
      })

      const originalEnv = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
      process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = "test-site-key"

      const result = useCreateEventStore.getState().validateForm(t)

      process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = originalEnv

      expect(result).toBe(false)
      expect(useCreateEventStore.getState().validation.error).toBe("errors.captchaRequired")
    })
  })

  describe("createEvent", () => {
    const validFormData = {
      name: "Team Meeting",
      startDate: "2026-03-01",
      endDate: "2026-03-07",
      creatorName: "John Doe",
      password: "",
      captchaToken: "",
      excludedDates: [],
    }

    beforeEach(() => {
      delete process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
    })

    it("should create event successfully", async () => {
      const mockEventData = createMockEvent({
        share_url: "happy-dolphin-42",
      })
      const mockParticipantData = createMockParticipant(mockEventData.id)

      server.use(
        http.post("/api/events", async () => {
          return HttpResponse.json({
            data: {
              id: mockEventData.id,
              share_url: mockEventData.share_url,
              admin_token: "admin-token-123",
              participant: {
                participant_id: mockParticipantData.id,
                session_token: mockParticipantData.session_token,
              },
            },
            error: null,
          })
        })
      )

      useCreateEventStore.setState({ formData: validFormData })

      const result = await useCreateEventStore.getState().createEvent(t, tApi)

      expect(result.success).toBe(true)
      expect(result.shareUrl).toBe("happy-dolphin-42")
      expect(mockInitializeSession).toHaveBeenCalledWith(
        mockEventData.id,
        true,
        {
          participantId: mockParticipantData.id,
          sessionToken: mockParticipantData.session_token,
        },
        "admin-token-123"
      )
    })

    it("should return false when validation fails", async () => {
      useCreateEventStore.setState({
        formData: { ...validFormData, name: "" },
      })

      const result = await useCreateEventStore.getState().createEvent(t, tApi)

      expect(result.success).toBe(false)
      expect(result.shareUrl).toBeUndefined()
    })

    it("should handle API error response", async () => {
      server.use(
        http.post("/api/events", async () => {
          return HttpResponse.json(
            { data: null, error: "Event name already exists" },
            { status: 400 }
          )
        })
      )

      useCreateEventStore.setState({ formData: validFormData })

      const result = await useCreateEventStore.getState().createEvent(t, tApi)

      expect(result.success).toBe(false)
      expect(useCreateEventStore.getState().validation.error).toBe("Event name already exists")
    })

    it("should handle network error", async () => {
      server.use(
        http.post("/api/events", () => {
          return HttpResponse.error()
        })
      )

      useCreateEventStore.setState({ formData: validFormData })

      const result = await useCreateEventStore.getState().createEvent(t, tApi)

      expect(result.success).toBe(false)
      expect(useCreateEventStore.getState().validation.error).toBe("errors.unexpected")
    })

    it("should set isLoading during creation", async () => {
      server.use(
        http.post("/api/events", async () => {
          return HttpResponse.json({
            data: {
              id: "event-123",
              share_url: "test-url",
              admin_token: "token",
            },
            error: null,
          })
        })
      )

      useCreateEventStore.setState({ formData: validFormData })

      const promise = useCreateEventStore.getState().createEvent(t, tApi)

      expect(useCreateEventStore.getState().isLoading).toBe(true)

      await promise

      expect(useCreateEventStore.getState().isLoading).toBe(false)
    })

    it("should reset validation before creating", async () => {
      useCreateEventStore.setState({
        formData: validFormData,
        validation: { error: "Previous error", warning: "Previous warning" },
      })

      server.use(
        http.post("/api/events", async () => {
          return HttpResponse.json({
            data: {
              id: "event-123",
              share_url: "test-url",
              admin_token: "token",
            },
            error: null,
          })
        })
      )

      await useCreateEventStore.getState().createEvent(t, tApi)

      expect(useCreateEventStore.getState().validation.error).toBeNull()
    })

    it("should include password in request when provided", async () => {
      let capturedBody: unknown = null

      server.use(
        http.post("/api/events", async ({ request }) => {
          capturedBody = await request.json()
          return HttpResponse.json({
            data: {
              id: "event-123",
              share_url: "test-url",
              admin_token: "token",
            },
            error: null,
          })
        })
      )

      useCreateEventStore.setState({
        formData: { ...validFormData, password: "secret123" },
      })

      await useCreateEventStore.getState().createEvent(t, tApi)

      expect(capturedBody).toHaveProperty("password", "secret123")
    })

    it("should include excluded dates in request when provided", async () => {
      let capturedBody: unknown = null

      server.use(
        http.post("/api/events", async ({ request }) => {
          capturedBody = await request.json()
          return HttpResponse.json({
            data: {
              id: "event-123",
              share_url: "test-url",
              admin_token: "token",
            },
            error: null,
          })
        })
      )

      useCreateEventStore.setState({
        formData: {
          ...validFormData,
          excludedDates: ["2026-03-03", "2026-03-04"],
        },
      })

      await useCreateEventStore.getState().createEvent(t, tApi)

      expect(capturedBody).toHaveProperty("excluded_dates", ["2026-03-03", "2026-03-04"])
    })

    it("should trim name and creatorName in request", async () => {
      let capturedBody: unknown = null

      server.use(
        http.post("/api/events", async ({ request }) => {
          capturedBody = await request.json()
          return HttpResponse.json({
            data: {
              id: "event-123",
              share_url: "test-url",
              admin_token: "token",
            },
            error: null,
          })
        })
      )

      useCreateEventStore.setState({
        formData: {
          ...validFormData,
          name: "  Team Meeting  ",
          creatorName: "  John Doe  ",
        },
      })

      await useCreateEventStore.getState().createEvent(t, tApi)

      expect(capturedBody).toHaveProperty("name", "Team Meeting")
      expect(capturedBody).toHaveProperty("creator_name", "John Doe")
    })

    it("should handle response without participant data", async () => {
      server.use(
        http.post("/api/events", async () => {
          return HttpResponse.json({
            data: {
              id: "event-123",
              share_url: "test-url",
              admin_token: "token",
            },
            error: null,
          })
        })
      )

      useCreateEventStore.setState({ formData: validFormData })

      const result = await useCreateEventStore.getState().createEvent(t, tApi)

      expect(result.success).toBe(true)
      expect(mockInitializeSession).toHaveBeenCalledWith("event-123", true, undefined, "token")
    })
  })

  describe("reset", () => {
    it("should reset all state to initial values", () => {
      useCreateEventStore.setState({
        formData: {
          name: "Team Meeting",
          startDate: "2026-03-01",
          endDate: "2026-03-07",
          creatorName: "John Doe",
          password: "secret",
          captchaToken: "token",
          excludedDates: ["2026-03-03"],
        },
        isLoading: true,
        validation: { error: "Some error", warning: "Some warning" },
      })

      useCreateEventStore.getState().reset()

      const state = useCreateEventStore.getState()
      expect(state.formData).toEqual({
        name: "",
        startDate: "",
        endDate: "",
        creatorName: "",
        password: "",
        captchaToken: "",
        excludedDates: [],
      })
      expect(state.isLoading).toBe(false)
      expect(state.validation).toEqual({
        error: null,
        warning: null,
      })
    })
  })
})
