interface CalendarEventParams {
  title: string
  date: string // YYYY-MM-DD format
  description?: string
  location?: string
}

/**
 * Generates a Google Calendar URL for creating an all-day event
 * @param params - Event parameters (title, date, description, location)
 * @returns Google Calendar URL that opens the event creation form
 */
export function generateGoogleCalendarUrl(params: CalendarEventParams): string {
  const { title, date, description, location } = params

  const dateFormatted = date.replace(/-/g, "")

  const endDate = new Date(date)
  endDate.setDate(endDate.getDate() + 1)
  const endDateFormatted = endDate.toISOString().split("T")[0].replace(/-/g, "")

  const url = new URL("https://calendar.google.com/calendar/render")
  url.searchParams.set("action", "TEMPLATE")
  url.searchParams.set("text", title)
  url.searchParams.set("dates", `${dateFormatted}/${endDateFormatted}`)

  if (description) {
    url.searchParams.set("details", description)
  }

  if (location) {
    url.searchParams.set("location", location)
  }

  return url.toString()
}

/**
 * Generates an ICS file content for calendar apps (Apple Calendar, Outlook, etc.)
 * @param params - Event parameters (title, date, description, location)
 * @returns ICS file content as a string
 */
export function generateICSContent(params: CalendarEventParams): string {
  const { title, date, description, location } = params

  const dateFormatted = date.replace(/-/g, "")

  const endDate = new Date(date)
  endDate.setDate(endDate.getDate() + 1)
  const endDateFormatted = endDate.toISOString().split("T")[0].replace(/-/g, "")

  const uid = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}@meetmate`

  const escapeICS = (text: string) =>
    text.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n")

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//MeetMate//Event//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z`,
    `DTSTART;VALUE=DATE:${dateFormatted}`,
    `DTEND;VALUE=DATE:${endDateFormatted}`,
    `SUMMARY:${escapeICS(title)}`,
  ]

  if (description) {
    lines.push(`DESCRIPTION:${escapeICS(description)}`)
  }

  if (location) {
    lines.push(`LOCATION:${escapeICS(location)}`)
  }

  lines.push("END:VEVENT", "END:VCALENDAR")

  return lines.join("\r\n")
}

/**
 * Creates a data URL for downloading an ICS file
 * @param params - Event parameters
 * @returns Data URL that can be used as href for download
 */
export function generateICSDataUrl(params: CalendarEventParams): string {
  const icsContent = generateICSContent(params)
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(icsContent)}`
}

/**
 * Detects if the current device is an Apple device (iOS, iPadOS, or macOS)
 * @returns true if the device is an Apple device
 */
export function isAppleDevice(): boolean {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return false
  }

  const userAgent = navigator.userAgent.toLowerCase()

  // Exclude Windows and Linux - they're definitely not Apple devices
  if (/windows|linux/.test(userAgent)) {
    return false
  }

  // Check for iOS devices (iPhone, iPad, iPod)
  const isIOS = /iphone|ipad|ipod/.test(userAgent)

  // Check for macOS - look for "macintosh" or "mac os" but verify it's not a fake UA
  const isMac = /macintosh|mac os/.test(userAgent)

  return isIOS || isMac
}
