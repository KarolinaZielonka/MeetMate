import { create } from "zustand"
import type { AvailabilityMap, Event, Participant, Session } from "@/types"

interface EventState {
  event: Event | null
  participants: Participant[]
  availability: AvailabilityMap
  currentSession: Session | null

  // Actions
  setEvent: (event: Event | null) => void
  setParticipants: (participants: Participant[]) => void
  setAvailability: (availability: AvailabilityMap) => void
  setCurrentSession: (session: Session | null) => void

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
}

export const useEventStore = create<EventState>((set) => ({
  ...initialState,

  setEvent: (event) => set({ event }),
  setParticipants: (participants) => set({ participants }),
  setAvailability: (availability) => set({ availability }),
  setCurrentSession: (session) => set({ currentSession: session }),

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
      participants: state.participants.filter(({id}) => id !== participantId),
    })),

  // Utility actions
  reset: () => set(initialState),
}))
