import { create } from "zustand";
import type {
  Event,
  Participant,
  AvailabilityMap,
  Session,
  DateScore,
} from "@/types";

interface EventState {
  event: Event | null;
  participants: Participant[];
  availability: AvailabilityMap;
  currentSession: Session | null;

  // Actions
  setEvent: (event: Event | null) => void;
  setParticipants: (participants: Participant[]) => void;
  setAvailability: (availability: AvailabilityMap) => void;
  setCurrentSession: (session: Session | null) => void;
}

export const useEventStore = create<EventState>((set) => ({
  event: null,
  participants: [],
  availability: new Map(),
  currentSession: null,

  setEvent: (event) => set({ event }),
  setParticipants: (participants) => set({ participants }),
  setAvailability: (availability) => set({ availability }),
  setCurrentSession: (session) => set({ currentSession: session }),
}));
