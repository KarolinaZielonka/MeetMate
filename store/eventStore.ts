import { toast } from "sonner"
import { create } from "zustand"
import { getSession, type Session } from "@/lib/utils/session"
import type { AvailabilityMap, AvailabilityStatus, Event, Participant, UserRole } from "@/types"

interface EventState {
  event: Event | null
  participants: Participant[]
  availability: AvailabilityMap
  currentSession: Session | null

  // Fetch state
  isLoading: boolean
  error: string | null
  userRole: UserRole

  // Availability state
  availabilitySelections: AvailabilityMap
  isSubmittingAvailability: boolean
  isEditingAvailability: boolean
  hasSubmittedAvailability: boolean

  // Actions
  setEvent: (event: Event | null) => void
  setParticipants: (participants: Participant[]) => void
  setAvailability: (availability: AvailabilityMap) => void
  setCurrentSession: (session: Session | null) => void
  setUserRole: (role: UserRole) => void

  // Fetch actions
  fetchEvent: (shareUrl: string, t: (key: string) => string) => Promise<void>
  refreshEvent: (shareUrl: string, t: (key: string) => string) => Promise<void>
  fetchParticipants: (shareUrl: string, t: (key: string) => string) => Promise<void>

  // Availability actions
  fetchAvailability: (eventId: string, participantId: string) => Promise<void>
  updateAvailabilitySelection: (date: string, status: AvailabilityStatus) => void
  setAvailabilitySelections: (selections: AvailabilityMap) => void
  submitAvailability: (participantId: string, t: (key: string) => string) => Promise<void>
  startEditingAvailability: () => void
  cancelEditingAvailability: (eventId: string, participantId: string) => void

  // Real-time actions
  addParticipant: (participant: Participant) => void
  updateParticipant: (participantId: string, updates: Partial<Participant>) => void
  removeParticipant: (participantId: string) => void

  // Utility actions
  reset: () => void
}

const initialState = {
  event: null,
  participants: [],
  availability: new Map(),
  currentSession: null,
  isLoading: true,
  error: null,
  userRole: "visitor" as UserRole,
  availabilitySelections: new Map(),
  isSubmittingAvailability: false,
  isEditingAvailability: false,
  hasSubmittedAvailability: false,
}

export const useEventStore = create<EventState>((set, get) => ({
  ...initialState,

  setEvent: (event) => set({ event }),
  setParticipants: (participants) => set({ participants }),
  setAvailability: (availability) => set({ availability }),
  setCurrentSession: (session) => set({ currentSession: session }),
  setUserRole: (role) => set({ userRole: role }),

  // Fetch actions
  fetchEvent: async (shareUrl: string, t: (key: string) => string) => {
    set({ isLoading: true, error: null })

    try {
      const response = await fetch(`/api/events/${shareUrl}`)
      const result = await response.json()

      if (!response.ok || result.error) {
        if (response.status === 404) {
          set({ error: t("notFound"), isLoading: false })
        } else {
          set({ error: result.error || t("notFoundMessage"), isLoading: false })
        }
        return
      }

      set({ event: result.data })

      // Check session for this event
      const session = getSession(result.data.id)
      if (session) {
        set({ userRole: session.role, currentSession: session })
      }

      set({ isLoading: false })
    } catch (err) {
      console.error("Error fetching event:", err)
      set({ error: t("notFoundMessage"), isLoading: false })
    }
  },

  refreshEvent: async (shareUrl: string, t: (key: string) => string) => {
    // Same as fetchEvent but doesn't reset error state initially
    const currentError = get().error
    set({ isLoading: true })

    try {
      const response = await fetch(`/api/events/${shareUrl}`)
      const result = await response.json()

      if (!response.ok || result.error) {
        if (response.status === 404) {
          set({ error: t("notFound"), isLoading: false })
        } else {
          set({ error: result.error || t("notFoundMessage"), isLoading: false })
        }
        return
      }

      set({ event: result.data, error: null })

      // Check session for this event
      const session = getSession(result.data.id)
      if (session) {
        set({ userRole: session.role, currentSession: session })
      }

      set({ isLoading: false })
    } catch (err) {
      console.error("Error refreshing event:", err)
      set({ error: currentError || t("notFoundMessage"), isLoading: false })
    }
  },

  fetchParticipants: async (shareUrl: string, t: (key: string) => string) => {
    try {
      const response = await fetch(`/api/events/${shareUrl}/participants`)
      const result = await response.json()

      if (!response.ok || result.error) {
        console.error("Error fetching participants:", result.error)
        set({ error: result.error || t("errorFetch") })
        return
      }

      set({ participants: result.data || [] })
    } catch (err) {
      console.error("Error fetching participants:", err)
      set({ error: t("errorFetch") })
    }
  },

  // Availability actions
  fetchAvailability: async (_eventId: string, participantId: string) => {
    try {
      const response = await fetch(`/api/participants/${participantId}/availability`)
      const result = await response.json()

      if (response.ok && result.data) {
        // Convert object to Map
        const availabilityMap = new Map<string, AvailabilityStatus>()
        Object.entries(result.data).forEach(([date, status]) => {
          availabilityMap.set(date, status as AvailabilityStatus)
        })
        set({
          availabilitySelections: availabilityMap,
          hasSubmittedAvailability: availabilityMap.size > 0,
        })
      }
    } catch (err) {
      console.error("Error fetching availability:", err)
    }
  },

  updateAvailabilitySelection: (date: string, status: AvailabilityStatus) => {
    set((state) => {
      const newSelections = new Map(state.availabilitySelections)
      newSelections.set(date, status)
      return { availabilitySelections: newSelections }
    })
  },

  setAvailabilitySelections: (selections: AvailabilityMap) => {
    set({ availabilitySelections: selections })
  },

  submitAvailability: async (participantId: string, t: (key: string) => string) => {
    const state = get()

    if (state.availabilitySelections.size === 0) {
      toast.error(t("noSelections"))
      return
    }

    set({ isSubmittingAvailability: true })

    try {
      // Convert Map to array format for API
      const dates = Array.from(state.availabilitySelections.entries()).map(([date, status]) => ({
        date,
        status,
      }))

      const response = await fetch("/api/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          participant_id: participantId,
          dates,
        }),
      })

      const result = await response.json()

      if (response.ok && result.data?.success) {
        toast.success(state.hasSubmittedAvailability ? t("successUpdate") : t("successSubmit"))
        set({
          hasSubmittedAvailability: true,
          isEditingAvailability: false,
        })
        // Refresh event data to get updated availability
        if (state.event) {
          await get().refreshEvent(state.event.share_url, t)
        }
      } else {
        toast.error(result.error || t("errorSubmit"))
      }
    } catch (err) {
      console.error("Error submitting availability:", err)
      toast.error(t("errorSubmit"))
    } finally {
      set({ isSubmittingAvailability: false })
    }
  },

  startEditingAvailability: () => {
    set({ isEditingAvailability: true })
  },

  cancelEditingAvailability: (eventId: string, participantId: string) => {
    set({ isEditingAvailability: false })
    // Re-fetch availability to restore original state
    get().fetchAvailability(eventId, participantId)
  },

  // Real-time actions
  addParticipant: (participant) =>
    set((state) => ({
      participants: [...state.participants, participant],
    })),

  updateParticipant: (participantId, updates) =>
    set((state) => ({
      participants: state.participants.map((p) =>
        p.id === participantId ? { ...p, ...updates } : p
      ),
    })),

  removeParticipant: (participantId) =>
    set((state) => ({
      participants: state.participants.filter(({ id }) => id !== participantId),
    })),

  // Utility actions
  reset: () => set(initialState),
}))
