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
