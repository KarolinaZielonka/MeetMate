/**
 * Session management for MeetSync
 * No user accounts - sessions are event-scoped and stored in localStorage
 */

export type SessionRole = "admin" | "participant" | "visitor"

export interface Session {
  eventId: string
  role: SessionRole
  sessionToken?: string // UUID for participants
  participantId?: string // Database ID for participants
  createdAt: number // Timestamp
}

/**
 * Get localStorage key for event session
 */
function getSessionKey(eventId: string): string {
  return `session_${eventId}`
}

/**
 * Get localStorage key for access token (password protection)
 */
function getAccessTokenKey(eventId: string): string {
  return `access_token_${eventId}`
}

/**
 * Initialize a new session for an event
 * Used when creating an event (admin) or joining as a participant
 */
export function initializeSession(eventId: string, isCreator: boolean = false): Session {
  const session: Session = {
    eventId,
    role: isCreator ? "admin" : "visitor",
    createdAt: Date.now(),
  }

  saveSession(eventId, session)
  return session
}

/**
 * Get existing session for an event
 * Returns null if no session exists
 */
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

/**
 * Save session to localStorage
 */
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

/**
 * Update session to participant role after joining
 */
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

/**
 * Clear session for an event
 */
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

/**
 * Check if user is admin for an event
 */
export function isAdmin(eventId: string): boolean {
  const session = getSession(eventId)
  return session?.role === "admin"
}

/**
 * Check if user is a participant for an event
 */
export function isParticipant(eventId: string): boolean {
  const session = getSession(eventId)
  return session?.role === "participant" || session?.role === "admin"
}

/**
 * Get participant ID from session
 * Returns null if not a participant
 */
export function getParticipantId(eventId: string): string | null {
  const session = getSession(eventId)
  return session?.participantId || null
}

/**
 * Store access token for password-protected event
 */
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

/**
 * Get access token for password-protected event
 * Returns null if no token exists
 */
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

/**
 * Check if user has access to password-protected event
 */
export function hasAccess(eventId: string, passwordRequired: boolean): boolean {
  if (!passwordRequired) {
    return true
  }

  const token = getAccessToken(eventId)
  return token !== null
}

/**
 * Clear all sessions (useful for debugging)
 */
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
