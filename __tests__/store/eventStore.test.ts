import { HttpResponse, http } from "msw"
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest"
import { useEventStore } from "@/store/eventStore"
import {
  createMockEvent,
  createMockParticipant,
  mockEvent,
  mockParticipant,
} from "../setup/msw-handlers"
import { server } from "../setup/msw-server"

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

vi.mock("@/lib/utils/session", () => ({
  getSession: vi.fn(),
}))

import { toast } from "sonner"
import { getSession } from "@/lib/utils/session"

const mockGetSession = vi.mocked(getSession)
const mockToast = vi.mocked(toast)

const t = (key: string) => key

describe("eventStore", () => {
  beforeAll(() => {
    server.listen({ onUnhandledRequest: "error" })
  })

  afterEach(() => {
    server.resetHandlers()
    useEventStore.getState().reset()
    vi.clearAllMocks()
  })

  afterAll(() => {
    server.close()
  })

  describe("Initial State", () => {
    it("should have correct initial state", () => {
      const state = useEventStore.getState()

      expect(state.event).toBeNull()
      expect(state.participants).toEqual([])
      expect(state.availability).toBeInstanceOf(Map)
      expect(state.availability.size).toBe(0)
      expect(state.currentSession).toBeNull()
      expect(state.isLoading).toBe(true)
      expect(state.error).toBeNull()
      expect(state.userRole).toBe("visitor")
      expect(state.availabilitySelections).toBeInstanceOf(Map)
      expect(state.availabilitySelections.size).toBe(0)
      expect(state.isSubmittingAvailability).toBe(false)
      expect(state.isEditingAvailability).toBe(false)
      expect(state.hasSubmittedAvailability).toBe(false)
    })
  })

  describe("Simple Setters", () => {
    it("should set event", () => {
      const event = createMockEvent({ name: "Test Event" })
      useEventStore.getState().setEvent(event)

      expect(useEventStore.getState().event).toEqual(event)
    })

    it("should set event to null", () => {
      const event = createMockEvent()
      useEventStore.getState().setEvent(event)
      useEventStore.getState().setEvent(null)

      expect(useEventStore.getState().event).toBeNull()
    })

    it("should set participants", () => {
      const eventId = "event-123"
      const participants = [
        createMockParticipant(eventId, { name: "Alice" }),
        createMockParticipant(eventId, { name: "Bob" }),
      ]
      useEventStore.getState().setParticipants(participants)

      expect(useEventStore.getState().participants).toEqual(participants)
      expect(useEventStore.getState().participants).toHaveLength(2)
    })

    it("should set availability map", () => {
      const availability = new Map([
        ["2026-01-01", "available"],
        ["2026-01-02", "maybe"],
      ]) as Map<string, "available" | "maybe" | "unavailable">

      useEventStore.getState().setAvailability(availability)

      expect(useEventStore.getState().availability.get("2026-01-01")).toBe("available")
      expect(useEventStore.getState().availability.get("2026-01-02")).toBe("maybe")
    })

    it("should set current session", () => {
      const session = {
        eventId: "event-123",
        role: "admin" as const,
        sessionToken: "token-abc",
        participantId: "part-123",
      }

      useEventStore.getState().setCurrentSession(session)

      expect(useEventStore.getState().currentSession).toEqual(session)
    })

    it("should set user role", () => {
      useEventStore.getState().setUserRole("admin")
      expect(useEventStore.getState().userRole).toBe("admin")

      useEventStore.getState().setUserRole("participant")
      expect(useEventStore.getState().userRole).toBe("participant")

      useEventStore.getState().setUserRole("visitor")
      expect(useEventStore.getState().userRole).toBe("visitor")
    })
  })

  describe("fetchEvent", () => {
    it("should fetch event successfully", async () => {
      mockGetSession.mockReturnValue(null)

      await useEventStore.getState().fetchEvent(mockEvent.share_url, t)

      const state = useEventStore.getState()
      expect(state.isLoading).toBe(false)
      expect(state.error).toBeNull()
      expect(state.event).toEqual(mockEvent)
    })

    it("should set admin role when session exists", async () => {
      mockGetSession.mockReturnValue({
        eventId: mockEvent.id,
        role: "admin",
        sessionToken: "token-123",
        participantId: "part-123",
        createdAt: Date.now(),
      })

      await useEventStore.getState().fetchEvent(mockEvent.share_url, t)

      const state = useEventStore.getState()
      expect(state.userRole).toBe("admin")
      expect(state.currentSession).toBeDefined()
    })

    it("should handle 404 error", async () => {
      mockGetSession.mockReturnValue(null)

      await useEventStore.getState().fetchEvent("non-existent-event", t)

      const state = useEventStore.getState()
      expect(state.isLoading).toBe(false)
      expect(state.error).toBe("notFound")
      expect(state.event).toBeNull()
    })

    it("should handle API error response", async () => {
      server.use(
        http.get("/api/events/:shareUrl", () => {
          return HttpResponse.json({ data: null, error: "Server error" }, { status: 500 })
        })
      )
      mockGetSession.mockReturnValue(null)

      await useEventStore.getState().fetchEvent("test-event", t)

      const state = useEventStore.getState()
      expect(state.isLoading).toBe(false)
      expect(state.error).toBe("Server error")
    })

    it("should handle network error", async () => {
      server.use(
        http.get("/api/events/:shareUrl", () => {
          return HttpResponse.error()
        })
      )
      mockGetSession.mockReturnValue(null)

      await useEventStore.getState().fetchEvent("test-event", t)

      const state = useEventStore.getState()
      expect(state.isLoading).toBe(false)
      expect(state.error).toBe("notFoundMessage")
    })

    it("should set loading state during fetch", async () => {
      mockGetSession.mockReturnValue(null)

      expect(useEventStore.getState().isLoading).toBe(true)

      const promise = useEventStore.getState().fetchEvent(mockEvent.share_url, t)

      expect(useEventStore.getState().isLoading).toBe(true)
      expect(useEventStore.getState().error).toBeNull()

      await promise

      expect(useEventStore.getState().isLoading).toBe(false)
    })
  })

  describe("refreshEvent", () => {
    it("should refresh event successfully", async () => {
      mockGetSession.mockReturnValue(null)

      await useEventStore.getState().refreshEvent(mockEvent.share_url, t)

      const state = useEventStore.getState()
      expect(state.isLoading).toBe(false)
      expect(state.error).toBeNull()
      expect(state.event).toEqual(mockEvent)
    })

    it("should preserve existing error on network failure", async () => {
      useEventStore.setState({ error: "Previous error" })

      server.use(
        http.get("/api/events/:shareUrl", () => {
          return HttpResponse.error()
        })
      )
      mockGetSession.mockReturnValue(null)

      await useEventStore.getState().refreshEvent("test-event", t)

      const state = useEventStore.getState()
      expect(state.error).toBe("Previous error")
    })

    it("should clear error on successful refresh", async () => {
      useEventStore.setState({ error: "Previous error" })
      mockGetSession.mockReturnValue(null)

      await useEventStore.getState().refreshEvent(mockEvent.share_url, t)

      const state = useEventStore.getState()
      expect(state.error).toBeNull()
    })
  })

  describe("fetchParticipants", () => {
    it("should fetch participants successfully", async () => {
      await useEventStore.getState().fetchParticipants(mockEvent.share_url, t)

      const state = useEventStore.getState()
      expect(state.participants).toHaveLength(1)
      expect(state.participants[0]).toEqual(mockParticipant)
    })

    it("should handle API error", async () => {
      server.use(
        http.get("/api/events/:shareUrl/participants", () => {
          return HttpResponse.json(
            { data: null, error: "Failed to fetch participants" },
            { status: 500 }
          )
        })
      )

      await useEventStore.getState().fetchParticipants("test-event", t)

      const state = useEventStore.getState()
      expect(state.error).toBe("Failed to fetch participants")
    })

    it("should handle network error", async () => {
      server.use(
        http.get("/api/events/:shareUrl/participants", () => {
          return HttpResponse.error()
        })
      )

      await useEventStore.getState().fetchParticipants("test-event", t)

      const state = useEventStore.getState()
      expect(state.error).toBe("errorFetch")
    })

    it("should set empty array when no participants", async () => {
      server.use(
        http.get("/api/events/:shareUrl/participants", () => {
          return HttpResponse.json({ data: [], error: null })
        })
      )

      await useEventStore.getState().fetchParticipants("test-event", t)

      const state = useEventStore.getState()
      expect(state.participants).toEqual([])
    })
  })

  describe("Availability Actions", () => {
    describe("fetchAvailability", () => {
      it("should fetch availability and convert to Map", async () => {
        server.use(
          http.get("/api/participants/:participantId/availability", () => {
            return HttpResponse.json({
              data: {
                "2026-02-01": "available",
                "2026-02-02": "maybe",
                "2026-02-03": "unavailable",
              },
              error: null,
            })
          })
        )

        await useEventStore.getState().fetchAvailability("event-123", "participant-123")

        const state = useEventStore.getState()
        expect(state.availabilitySelections.get("2026-02-01")).toBe("available")
        expect(state.availabilitySelections.get("2026-02-02")).toBe("maybe")
        expect(state.availabilitySelections.get("2026-02-03")).toBe("unavailable")
        expect(state.hasSubmittedAvailability).toBe(true)
      })

      it("should set hasSubmittedAvailability to false when no availability", async () => {
        server.use(
          http.get("/api/participants/:participantId/availability", () => {
            return HttpResponse.json({ data: {}, error: null })
          })
        )

        await useEventStore.getState().fetchAvailability("event-123", "participant-123")

        const state = useEventStore.getState()
        expect(state.availabilitySelections.size).toBe(0)
        expect(state.hasSubmittedAvailability).toBe(false)
      })

      it("should handle fetch error silently", async () => {
        server.use(
          http.get("/api/participants/:participantId/availability", () => {
            return HttpResponse.error()
          })
        )

        await expect(
          useEventStore.getState().fetchAvailability("event-123", "participant-123")
        ).resolves.toBeUndefined()
      })
    })

    describe("updateAvailabilitySelection", () => {
      it("should update single date selection", () => {
        useEventStore.getState().updateAvailabilitySelection("2026-01-15", "available")

        expect(useEventStore.getState().availabilitySelections.get("2026-01-15")).toBe("available")
      })

      it("should update existing selection", () => {
        useEventStore.getState().updateAvailabilitySelection("2026-01-15", "available")
        useEventStore.getState().updateAvailabilitySelection("2026-01-15", "unavailable")

        expect(useEventStore.getState().availabilitySelections.get("2026-01-15")).toBe(
          "unavailable"
        )
      })

      it("should preserve other selections when updating", () => {
        useEventStore.getState().updateAvailabilitySelection("2026-01-15", "available")
        useEventStore.getState().updateAvailabilitySelection("2026-01-16", "maybe")
        useEventStore.getState().updateAvailabilitySelection("2026-01-15", "unavailable")

        const selections = useEventStore.getState().availabilitySelections
        expect(selections.get("2026-01-15")).toBe("unavailable")
        expect(selections.get("2026-01-16")).toBe("maybe")
      })
    })

    describe("setAvailabilitySelections", () => {
      it("should replace all selections", () => {
        useEventStore.getState().updateAvailabilitySelection("2026-01-15", "available")

        const newSelections = new Map([
          ["2026-02-01", "maybe"],
          ["2026-02-02", "unavailable"],
        ]) as Map<string, "available" | "maybe" | "unavailable">

        useEventStore.getState().setAvailabilitySelections(newSelections)

        const selections = useEventStore.getState().availabilitySelections
        expect(selections.size).toBe(2)
        expect(selections.get("2026-01-15")).toBeUndefined()
        expect(selections.get("2026-02-01")).toBe("maybe")
        expect(selections.get("2026-02-02")).toBe("unavailable")
      })
    })

    describe("submitAvailability", () => {
      beforeEach(() => {
        useEventStore.setState({
          event: mockEvent,
          currentSession: {
            eventId: mockEvent.id,
            role: "participant",
            sessionToken: "valid-token",
            participantId: "part-123",
          },
        })
      })

      it("should submit availability successfully", async () => {
        useEventStore.getState().updateAvailabilitySelection("2026-02-01", "available")
        useEventStore.getState().updateAvailabilitySelection("2026-02-02", "maybe")

        await useEventStore.getState().submitAvailability("part-123", t)

        expect(mockToast.success).toHaveBeenCalledWith("successSubmit")
        expect(useEventStore.getState().hasSubmittedAvailability).toBe(true)
        expect(useEventStore.getState().isEditingAvailability).toBe(false)
      })

      it("should show update message when editing existing availability", async () => {
        useEventStore.setState({ hasSubmittedAvailability: true })
        useEventStore.getState().updateAvailabilitySelection("2026-02-01", "available")

        await useEventStore.getState().submitAvailability("part-123", t)

        expect(mockToast.success).toHaveBeenCalledWith("successUpdate")
      })

      it("should show error when no selections", async () => {
        await useEventStore.getState().submitAvailability("part-123", t)

        expect(mockToast.error).toHaveBeenCalledWith("noSelections")
      })

      it("should show error when no session token", async () => {
        useEventStore.setState({ currentSession: null })
        useEventStore.getState().updateAvailabilitySelection("2026-02-01", "available")

        await useEventStore.getState().submitAvailability("part-123", t)

        expect(mockToast.error).toHaveBeenCalledWith("errorUnauthorized")
      })

      it("should handle API error", async () => {
        server.use(
          http.post("/api/availability", () => {
            return HttpResponse.json({ data: null, error: "Failed to submit" }, { status: 500 })
          })
        )

        useEventStore.getState().updateAvailabilitySelection("2026-02-01", "available")

        await useEventStore.getState().submitAvailability("part-123", t)

        expect(mockToast.error).toHaveBeenCalledWith("Failed to submit")
      })

      it("should set isSubmittingAvailability during submission", async () => {
        useEventStore.getState().updateAvailabilitySelection("2026-02-01", "available")

        const promise = useEventStore.getState().submitAvailability("part-123", t)

        expect(useEventStore.getState().isSubmittingAvailability).toBe(true)

        await promise

        expect(useEventStore.getState().isSubmittingAvailability).toBe(false)
      })
    })

    describe("startEditingAvailability", () => {
      it("should set isEditingAvailability to true", () => {
        expect(useEventStore.getState().isEditingAvailability).toBe(false)

        useEventStore.getState().startEditingAvailability()

        expect(useEventStore.getState().isEditingAvailability).toBe(true)
      })
    })

    describe("cancelEditingAvailability", () => {
      it("should set isEditingAvailability to false and re-fetch availability", async () => {
        server.use(
          http.get("/api/participants/:participantId/availability", () => {
            return HttpResponse.json({
              data: { "2026-02-01": "available" },
              error: null,
            })
          })
        )

        useEventStore.setState({ isEditingAvailability: true })

        useEventStore.getState().cancelEditingAvailability("event-123", "part-123")

        expect(useEventStore.getState().isEditingAvailability).toBe(false)
      })
    })
  })

  describe("Real-time Actions", () => {
    describe("addParticipant", () => {
      it("should add participant to list", () => {
        const eventId = "event-123"
        const participant = createMockParticipant(eventId, { name: "New User" })

        useEventStore.getState().addParticipant(participant)

        expect(useEventStore.getState().participants).toHaveLength(1)
        expect(useEventStore.getState().participants[0]).toEqual(participant)
      })

      it("should append to existing participants", () => {
        const eventId = "event-123"
        const existingParticipant = createMockParticipant(eventId, { name: "Existing" })
        const newParticipant = createMockParticipant(eventId, { name: "New" })

        useEventStore.setState({ participants: [existingParticipant] })
        useEventStore.getState().addParticipant(newParticipant)

        expect(useEventStore.getState().participants).toHaveLength(2)
        expect(useEventStore.getState().participants[0].name).toBe("Existing")
        expect(useEventStore.getState().participants[1].name).toBe("New")
      })
    })

    describe("updateParticipant", () => {
      it("should update existing participant", () => {
        const eventId = "event-123"
        const participant = createMockParticipant(eventId, {
          name: "Original Name",
          has_submitted: false,
        })

        useEventStore.setState({ participants: [participant] })
        useEventStore.getState().updateParticipant(participant.id, {
          name: "Updated Name",
          has_submitted: true,
        })

        const updated = useEventStore.getState().participants[0]
        expect(updated.name).toBe("Updated Name")
        expect(updated.has_submitted).toBe(true)
      })

      it("should not modify other participants", () => {
        const eventId = "event-123"
        const participant1 = createMockParticipant(eventId, { name: "Alice" })
        const participant2 = createMockParticipant(eventId, { name: "Bob" })

        useEventStore.setState({ participants: [participant1, participant2] })
        useEventStore.getState().updateParticipant(participant1.id, { name: "Alice Updated" })

        const participants = useEventStore.getState().participants
        expect(participants[0].name).toBe("Alice Updated")
        expect(participants[1].name).toBe("Bob")
      })

      it("should do nothing if participant not found", () => {
        const eventId = "event-123"
        const participant = createMockParticipant(eventId, { name: "Alice" })

        useEventStore.setState({ participants: [participant] })
        useEventStore.getState().updateParticipant("non-existent-id", { name: "Updated" })

        expect(useEventStore.getState().participants[0].name).toBe("Alice")
      })
    })

    describe("removeParticipant", () => {
      it("should remove participant from list", () => {
        const eventId = "event-123"
        const participant = createMockParticipant(eventId, { name: "To Remove" })

        useEventStore.setState({ participants: [participant] })
        useEventStore.getState().removeParticipant(participant.id)

        expect(useEventStore.getState().participants).toHaveLength(0)
      })

      it("should only remove specified participant", () => {
        const eventId = "event-123"
        const participant1 = createMockParticipant(eventId, { name: "Keep" })
        const participant2 = createMockParticipant(eventId, { name: "Remove" })

        useEventStore.setState({ participants: [participant1, participant2] })
        useEventStore.getState().removeParticipant(participant2.id)

        expect(useEventStore.getState().participants).toHaveLength(1)
        expect(useEventStore.getState().participants[0].name).toBe("Keep")
      })

      it("should do nothing if participant not found", () => {
        const eventId = "event-123"
        const participant = createMockParticipant(eventId, { name: "Alice" })

        useEventStore.setState({ participants: [participant] })
        useEventStore.getState().removeParticipant("non-existent-id")

        expect(useEventStore.getState().participants).toHaveLength(1)
      })
    })
  })

  describe("reset", () => {
    it("should reset all state to initial values", () => {
      useEventStore.setState({
        event: mockEvent,
        participants: [mockParticipant],
        availability: new Map([["2026-01-01", "available"]]) as Map<
          string,
          "available" | "maybe" | "unavailable"
        >,
        currentSession: {
          eventId: "test",
          role: "admin",
          sessionToken: "token",
          participantId: "part",
        },
        isLoading: false,
        error: "Some error",
        userRole: "admin",
        availabilitySelections: new Map([["2026-01-01", "maybe"]]) as Map<
          string,
          "available" | "maybe" | "unavailable"
        >,
        isSubmittingAvailability: true,
        isEditingAvailability: true,
        hasSubmittedAvailability: true,
      })

      useEventStore.getState().reset()

      const state = useEventStore.getState()
      expect(state.event).toBeNull()
      expect(state.participants).toEqual([])
      expect(state.availability.size).toBe(0)
      expect(state.currentSession).toBeNull()
      expect(state.isLoading).toBe(true)
      expect(state.error).toBeNull()
      expect(state.userRole).toBe("visitor")
      expect(state.availabilitySelections.size).toBe(0)
      expect(state.isSubmittingAvailability).toBe(false)
      expect(state.isEditingAvailability).toBe(false)
      expect(state.hasSubmittedAvailability).toBe(false)
    })
  })
})
