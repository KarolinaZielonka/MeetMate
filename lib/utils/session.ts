/**
 * Session management for MeetMate
 * No user accounts - sessions are event-scoped and stored in localStorage
 */

export type SessionRole = "admin" | "participant" | "visitor"

export interface Session {
  eventId: string
  role: SessionRole
  sessionToken?: string // UUID for participants
  participantId?: string // Database ID for participants
  adminToken?: string // Secret token for admin operations (only for event creators)
  createdAt: number // Timestamp
}

function getSessionKey(eventId: string): string {
  return `session_${eventId}`
}

function getAccessTokenKey(eventId: string): string {
  return `access_token_${eventId}`
}

/**
 * Initialize a new session for an event
 * Used when creating an event (admin) or joining as a participant
 * Can optionally include participant data to avoid double-write
 */
export function initializeSession(
  eventId: string,
  isCreator: boolean = false,
  participantData?: { participantId: string; sessionToken: string },
  adminToken?: string
): Session {
  const session: Session = {
    eventId,
    role: isCreator ? "admin" : "visitor",
    createdAt: Date.now(),
    ...(participantData && {
      participantId: participantData.participantId,
      sessionToken: participantData.sessionToken,
    }),
    ...(adminToken && { adminToken }),
  }

  saveSession(eventId, session)
  return session
}

export function getSession(eventId: string): Session | null {
  if (typeof window === "undefined") {
    // Server-side rendering
    return null
  }

  try {
    const sessionKey = getSessionKey(eventId)
    const sessionData = localStorage.getItem(sessionKey)

    if (!sessionData) {
      return null
    }

    const session: Session = JSON.parse(sessionData)

    // Validate session structure
    if (!session.eventId || !session.role || !session.createdAt) {
      console.warn("Invalid session data, clearing session")
      clearSession(eventId)
      return null
    }

    return session
  } catch (error) {
    console.error("Error retrieving session:", error)
    return null
  }
}

export function saveSession(eventId: string, session: Session): void {
  if (typeof window === "undefined") {
    return
  }

  try {
    const sessionKey = getSessionKey(eventId)
    localStorage.setItem(sessionKey, JSON.stringify(session))
  } catch (error) {
    console.error("Error saving session:", error)
  }
}

export function updateSessionAsParticipant(
  eventId: string,
  participantId: string,
  sessionToken: string
): Session {
  const existingSession = getSession(eventId)

  const session: Session = {
    eventId,
    role: existingSession?.role === "admin" ? "admin" : "participant",
    sessionToken,
    participantId,
    createdAt: existingSession?.createdAt || Date.now(),
  }

  saveSession(eventId, session)
  return session
}

export function clearSession(eventId: string): void {
  if (typeof window === "undefined") {
    return
  }

  try {
    const sessionKey = getSessionKey(eventId)
    localStorage.removeItem(sessionKey)

    // Also clear access token if exists
    const accessTokenKey = getAccessTokenKey(eventId)
    localStorage.removeItem(accessTokenKey)
  } catch (error) {
    console.error("Error clearing session:", error)
  }
}

export function isAdmin(eventId: string): boolean {
  const session = getSession(eventId)
  return session?.role === "admin"
}

export function isParticipant(eventId: string): boolean {
  const session = getSession(eventId)
  return session?.role === "participant" || session?.role === "admin"
}

export function getParticipantId(eventId: string): string | null {
  const session = getSession(eventId)
  return session?.participantId || null
}

export function getAdminToken(eventId: string): string | null {
  const session = getSession(eventId)
  return session?.adminToken || null
}

export function storeAccessToken(eventId: string, token: string): void {
  if (typeof window === "undefined") {
    return
  }

  try {
    const accessTokenKey = getAccessTokenKey(eventId)
    localStorage.setItem(accessTokenKey, token)
  } catch (error) {
    console.error("Error storing access token:", error)
  }
}

export function getAccessToken(eventId: string): string | null {
  if (typeof window === "undefined") {
    return null
  }

  try {
    const accessTokenKey = getAccessTokenKey(eventId)
    return localStorage.getItem(accessTokenKey)
  } catch (error) {
    console.error("Error retrieving access token:", error)
    return null
  }
}

export function hasAccess(eventId: string, passwordRequired: boolean): boolean {
  if (!passwordRequired) {
    return true
  }

  const token = getAccessToken(eventId)
  return token !== null
}

export function clearAllSessions(): void {
  if (typeof window === "undefined") {
    return
  }

  try {
    const keys = Object.keys(localStorage)
    keys.forEach((key) => {
      if (key.startsWith("session_") || key.startsWith("access_token_")) {
        localStorage.removeItem(key)
      }
    })
  } catch (error) {
    console.error("Error clearing all sessions:", error)
  }
}
