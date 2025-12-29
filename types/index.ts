// Core type definitions for MeetSync

export type AvailabilityStatus = "available" | "maybe" | "unavailable";

export type UserRole = "admin" | "participant" | "visitor";

export interface Event {
  id: string;
  created_at: string;
  name: string;
  start_date: string;
  end_date: string;
  password_hash?: string;
  creator_name?: string;
  is_locked: boolean;
  calculated_date?: string;
  share_url: string;
}

export interface Participant {
  id: string;
  event_id: string;
  name: string;
  created_at: string;
  has_submitted: boolean;
  session_token: string;
}

export interface Availability {
  id: string;
  participant_id: string;
  date: string;
  status: AvailabilityStatus;
  created_at: string;
}

export interface Session {
  sessionToken: string;
  participantId: string | null;
  role: UserRole;
  eventId: string;
}

export interface DateScore {
  date: string;
  score: number;
  available: number;
  maybe: number;
}

export type AvailabilityMap = Map<string, AvailabilityStatus>;
