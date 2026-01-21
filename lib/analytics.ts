// Analytics tracking utilities for the family travel booking prototype
// These events can be integrated with Google Analytics 4 or any analytics provider

export interface AnalyticsEvent {
  timestamp: string
  userId: string
  eventName: string
  destination?: string
  viewedSafety?: boolean
  safetyViewedAt?: "before_booking" | "at_checkout" | "never"
  timeViewingSafety?: number
  completedBooking?: boolean
  surveyResponses?: Record<string, unknown>
  emailCaptured?: boolean
  metadata?: Record<string, unknown>
}

// Generate anonymous user ID
export function getOrCreateUserId(): string {
  if (typeof window === "undefined") return "server"

  let userId = sessionStorage.getItem("ft_user_id")
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    sessionStorage.setItem("ft_user_id", userId)
  }
  return userId
}

// Store events in session storage for export
export function trackEvent(event: Omit<AnalyticsEvent, "timestamp" | "userId">): void {
  if (typeof window === "undefined") return

  const fullEvent: AnalyticsEvent = {
    ...event,
    timestamp: new Date().toISOString(),
    userId: getOrCreateUserId(),
  }

  // Store in session storage
  const events = getStoredEvents()
  events.push(fullEvent)
  sessionStorage.setItem("ft_analytics_events", JSON.stringify(events))

  // Log for debugging
  console.log("[Analytics]", fullEvent.eventName, fullEvent)

  // Send to Google Analytics if available
  if (typeof window !== "undefined" && "gtag" in window) {
    ;(window as { gtag: (...args: unknown[]) => void }).gtag("event", event.eventName, {
      destination: event.destination,
      viewed_safety: event.viewedSafety,
      safety_viewed_at: event.safetyViewedAt,
      time_viewing_safety: event.timeViewingSafety,
      completed_booking: event.completedBooking,
      ...event.metadata,
    })
  }
}

export function getStoredEvents(): AnalyticsEvent[] {
  if (typeof window === "undefined") return []

  const stored = sessionStorage.getItem("ft_analytics_events")
  return stored ? JSON.parse(stored) : []
}

// User journey tracking
export interface UserJourney {
  destinationsViewed: string[]
  safetyViewedFor: string[]
  bookingAttemptedFor: string | null
  safetyPromptShown: boolean
  safetyPromptClicked: boolean
  bookingCompleted: boolean
  safetyViewStartTime: number | null
  totalSafetyViewTime: number
}

export function getOrCreateJourney(): UserJourney {
  if (typeof window === "undefined") {
    return {
      destinationsViewed: [],
      safetyViewedFor: [],
      bookingAttemptedFor: null,
      safetyPromptShown: false,
      safetyPromptClicked: false,
      bookingCompleted: false,
      safetyViewStartTime: null,
      totalSafetyViewTime: 0,
    }
  }

  const stored = sessionStorage.getItem("ft_user_journey")
  if (stored) return JSON.parse(stored)

  const journey: UserJourney = {
    destinationsViewed: [],
    safetyViewedFor: [],
    bookingAttemptedFor: null,
    safetyPromptShown: false,
    safetyPromptClicked: false,
    bookingCompleted: false,
    safetyViewStartTime: null,
    totalSafetyViewTime: 0,
  }
  sessionStorage.setItem("ft_user_journey", JSON.stringify(journey))
  return journey
}

export function updateJourney(updates: Partial<UserJourney>): UserJourney {
  const journey = getOrCreateJourney()
  const updated = { ...journey, ...updates }

  if (typeof window !== "undefined") {
    sessionStorage.setItem("ft_user_journey", JSON.stringify(updated))
  }

  return updated
}

// Export data as CSV
export function exportToCSV(): string {
  const events = getStoredEvents()

  if (events.length === 0) return ""

  const headers = [
    "Timestamp",
    "User ID",
    "Event Name",
    "Destination",
    "Viewed Safety",
    "Safety Viewed At",
    "Time Viewing Safety (s)",
    "Completed Booking",
    "Email Captured",
  ]

  const rows = events.map((event) => [
    event.timestamp,
    event.userId,
    event.eventName,
    event.destination || "",
    event.viewedSafety !== undefined ? String(event.viewedSafety) : "",
    event.safetyViewedAt || "",
    event.timeViewingSafety !== undefined ? String(event.timeViewingSafety) : "",
    event.completedBooking !== undefined ? String(event.completedBooking) : "",
    event.emailCaptured !== undefined ? String(event.emailCaptured) : "",
  ])

  return [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")
}

// Calculate behavioral metrics
export function calculateMetrics() {
  const events = getStoredEvents()

  const uniqueUsers = new Set(events.map((e) => e.userId)).size
  const safetyFirstUsers = events.filter(
    (e) => e.eventName === "booking_completed" && e.safetyViewedAt === "before_booking",
  ).length
  const directBookers = events.filter((e) => e.eventName === "booking_completed" && e.safetyViewedAt === "never").length
  const safetyPromptedUsers = events.filter(
    (e) => e.eventName === "booking_completed" && e.safetyViewedAt === "at_checkout",
  ).length

  return {
    totalUsers: uniqueUsers,
    safetyFirstUsers,
    directBookers,
    safetyPromptedUsers,
    featureDiscoveryRate: events.filter((e) => e.eventName === "safety_modal_opened").length / Math.max(uniqueUsers, 1),
  }
}
