import { faker } from "@faker-js/faker"
import { HttpResponse, http } from "msw"

// Factory functions for generating mock data
export const createMockEvent = (overrides = {}) => ({
  id: faker.string.uuid(),
  name: faker.lorem.words(3),
  description: faker.lorem.sentence(),
  start_date: faker.date.future().toISOString().split("T")[0],
  end_date: faker.date.future().toISOString().split("T")[0],
  share_url: `${faker.word.adjective()}-${faker.animal.type()}-${faker.number.int({ min: 10, max: 99 })}`,
  password_hash: null,
  is_locked: false,
  calculated_date: null,
  created_at: faker.date.recent().toISOString(),
  ...overrides,
})

export const createMockParticipant = (eventId: string, overrides = {}) => ({
  id: faker.string.uuid(),
  event_id: eventId,
  name: faker.person.fullName(),
  session_token: faker.string.uuid(),
  has_submitted: false,
  joined_at: faker.date.recent().toISOString(),
  ...overrides,
})

export const createMockAvailability = (
  participantId: string,
  date: string,
  status: "available" | "maybe" | "unavailable" = "available"
) => ({
  id: faker.string.uuid(),
  participant_id: participantId,
  date,
  status,
})

// Default mock data for consistent testing
export const mockEvent = createMockEvent({
  name: "Test Event",
  description: "Test Description",
  start_date: "2026-02-01",
  end_date: "2026-02-07",
  share_url: "test-event-123",
})

export const mockParticipant = createMockParticipant(mockEvent.id, {
  name: "Test Participant",
})

export const mockAvailability = [
  createMockAvailability(mockParticipant.id, "2026-02-01", "available"),
  createMockAvailability(mockParticipant.id, "2026-02-02", "maybe"),
  createMockAvailability(mockParticipant.id, "2026-02-03", "unavailable"),
]

// MSW request handlers
export const handlers = [
  // Create event
  http.post("/api/events", async () => {
    return HttpResponse.json({
      data: createMockEvent(),
      error: null,
    })
  }),

  // Get event by share URL
  http.get("/api/events/:shareUrl", ({ params }) => {
    const { shareUrl } = params
    if (shareUrl === mockEvent.share_url) {
      return HttpResponse.json({
        data: mockEvent,
        error: null,
      })
    }
    return HttpResponse.json(
      {
        data: null,
        error: "Event not found",
      },
      { status: 404 }
    )
  }),

  // Delete event
  http.delete("/api/events/:shareUrl", ({ params }) => {
    const { shareUrl } = params
    if (shareUrl === mockEvent.share_url) {
      return HttpResponse.json({
        data: { success: true },
        error: null,
      })
    }
    return HttpResponse.json(
      {
        data: null,
        error: "Event not found",
      },
      { status: 404 }
    )
  }),

  // Lock event
  http.post("/api/events/:shareUrl/lock", async () => {
    return HttpResponse.json({
      data: { ...mockEvent, is_locked: true, calculated_date: "2026-02-01" },
      error: null,
    })
  }),

  // Reopen event
  http.post("/api/events/:shareUrl/reopen", async () => {
    return HttpResponse.json({
      data: { ...mockEvent, is_locked: false, calculated_date: null },
      error: null,
    })
  }),

  // Calculate optimal dates
  http.get("/api/events/:shareUrl/calculate", () => {
    return HttpResponse.json({
      data: [
        {
          date: "2026-02-01",
          score: 1.0,
          availableCount: 3,
          maybeCount: 0,
          unavailableCount: 0,
        },
        {
          date: "2026-02-02",
          score: 0.67,
          availableCount: 2,
          maybeCount: 1,
          unavailableCount: 0,
        },
      ],
      error: null,
    })
  }),

  // Verify password
  http.post("/api/events/:shareUrl/verify", async () => {
    return HttpResponse.json({
      data: { access_token: faker.string.alphanumeric(32) },
      error: null,
    })
  }),

  // Create participant
  http.post("/api/participants", async ({ request }) => {
    const body = (await request.json()) as { event_id: string; name: string }
    return HttpResponse.json({
      data: createMockParticipant(body.event_id, { name: body.name }),
      error: null,
    })
  }),

  // Get participants
  http.get("/api/events/:shareUrl/participants", () => {
    return HttpResponse.json({
      data: [mockParticipant],
      error: null,
    })
  }),

  // Submit availability
  http.post("/api/availability", async () => {
    return HttpResponse.json({
      data: { success: true },
      error: null,
    })
  }),

  // Get availability
  http.get("/api/participants/:participantId/availability", () => {
    return HttpResponse.json({
      data: mockAvailability,
      error: null,
    })
  }),
]
