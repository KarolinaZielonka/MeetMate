// Core type definitions for MeetMate

export type AvailabilityStatus = "available" | "maybe" | "unavailable"

export type UserRole = "admin" | "participant" | "visitor"

export interface Event {
  id: string
  created_at: string
  name: string
  start_date: string
  end_date: string
  creator_name: string | null
  is_locked: boolean
  calculated_date: string | null
  share_url: string
  has_password: boolean
  excluded_dates: string[]
}

export interface Participant {
  id: string
  event_id: string
  name: string
  created_at: string
  has_submitted: boolean
  session_token: string
}

export interface Availability {
  id: string
  participant_id: string
  date: string
  status: AvailabilityStatus
  created_at: string
}

export interface Session {
  sessionToken: string
  participantId: string | null
  role: UserRole
  eventId: string
}

export interface DateScore {
  date: string
  score: number
  availableCount: number
  maybeCount: number
  unavailableCount: number
  totalParticipants: number
}

export type AvailabilityMap = Map<string, AvailabilityStatus>
