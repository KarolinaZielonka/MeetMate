"use client"

import type { RealtimeChannel } from "@supabase/supabase-js"
import { useCallback, useEffect, useRef } from "react"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase/client"
import { useEventStore } from "@/store/eventStore"

interface UseRealtimeEventOptions {
  eventId: string
  onParticipantJoin?: (participantName: string) => void
  onParticipantUpdate?: (participantName: string) => void
  onAvailabilityUpdate?: () => void
  onEventLocked?: () => void
  onEventReopened?: () => void
  showToasts?: boolean
}

/**
 * Hook to subscribe to real-time updates for an event
 *
 * Subscribes to:
 * - participants table: New joins and availability submissions
 * - events table: Lock state changes
 * - availability table: Availability updates
 *
 * @param options - Configuration options
 */
export function useRealtimeEvent({
  eventId,
  onParticipantJoin,
  onParticipantUpdate,
  onAvailabilityUpdate,
  onEventLocked,
  onEventReopened,
  showToasts = true,
}: UseRealtimeEventOptions) {
  const channelRef = useRef<RealtimeChannel | null>(null)
  
  const callbacksRef = useRef({
    onParticipantJoin,
    onParticipantUpdate,
    onAvailabilityUpdate,
    onEventLocked,
    onEventReopened,
    showToasts,
  })

  useEffect(() => {
    callbacksRef.current = {
      onParticipantJoin,
      onParticipantUpdate,
      onAvailabilityUpdate,
      onEventLocked,
      onEventReopened,
      showToasts,
    }
  }, [onParticipantJoin, onParticipantUpdate, onAvailabilityUpdate, onEventLocked, onEventReopened, showToasts])

  // Helper function to refresh participants list
  // Get event from store dynamically to avoid dependency issues
  const refreshParticipants = useCallback(async (eventId: string) => {
    try {
      const currentEvent = useEventStore.getState().event
      let shareUrl = currentEvent?.share_url
      
      if (!shareUrl) {
        const { data: eventData, error: fetchError } = await supabase
          .from("events")
          .select("share_url")
          .eq("id", eventId)
          .single()
        
        if (fetchError) {
          console.error("Error fetching share_url:", fetchError)
          return
        }
        
        if (!eventData?.share_url) {
          console.warn("No share_url found for event:", eventId)
          return
        }
        
        shareUrl = eventData.share_url
      }

      if (shareUrl) {
        const fetchParticipants = useEventStore.getState().fetchParticipants
        await fetchParticipants(shareUrl, (key: string) => key)
      }
    } catch (error) {
      console.error("Error refreshing participants:", error)
    }
  }, []) // No dependencies - gets everything from store dynamically

  const refreshEvent = useCallback(async (eventId: string) => {
    try {
      const { data: event, error } = await supabase
        .from("events")
        .select("*")
        .eq("id", eventId)
        .single()

      if (error) {
        console.error("Error fetching event:", error)
        return
      }

      if (event) {
        const setEvent = useEventStore.getState().setEvent
        setEvent(event)
      }
    } catch (error) {
      console.error("Error refreshing event:", error)
    }
  }, []) // No dependencies - gets setEvent from store dynamically

  useEffect(() => {
    if (!eventId) return

    const channelName = `participants:event_id=eq.${eventId}`

    channelRef.current = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "participants",
          filter: `event_id=eq.${eventId}`,
        },
        (payload) => {
          console.log("New participant joined - real-time event received:", payload)

          const newParticipant = payload.new as {
            id: string
            name: string
            has_submitted: boolean
            created_at: string
            event_id: string
          }

          const { onParticipantJoin, showToasts } = callbacksRef.current

          onParticipantJoin?.(newParticipant.name)

          if (showToasts) {
            toast.success(`${newParticipant.name} joined the event!`, {
              duration: 3000,
            })
          }

          console.log("Refreshing participants list for event:", eventId)
          refreshParticipants(eventId)
            .then(() => {
              console.log("Successfully refreshed participants list")
            })
            .catch((error) => {
              console.error("Failed to refresh participants after join:", error)
              if (showToasts) {
                toast.error("Failed to refresh participant list. Please refresh the page.", {
                  duration: 5000,
                })
              }
            })
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "participants",
          filter: `event_id=eq.${eventId}`,
        },
        (payload) => {
          console.log("Participant updated - real-time event received:", payload)

          const updatedParticipant = payload.new as {
            id: string
            name: string
            has_submitted: boolean
          }

          const oldParticipant = payload.old as { has_submitted: boolean }
          const { onParticipantUpdate, showToasts } = callbacksRef.current

          if (updatedParticipant.has_submitted && !oldParticipant.has_submitted) {
            onParticipantUpdate?.(updatedParticipant.name)

            if (showToasts) {
              toast.info(`${updatedParticipant.name} submitted their availability!`, {
                duration: 3000,
              })
            }
          }

          console.log("Refreshing participants list after update for event:", eventId)
          refreshParticipants(eventId)
            .then(() => {
              console.log("Successfully refreshed participants list after update")
            })
            .catch((error) => {
              console.error("Failed to refresh participants after update:", error)
            })
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "events",
          filter: `id=eq.${eventId}`,
        },
        (payload) => {
          console.log("Event updated:", payload)

          const updatedEvent = payload.new as {
            is_locked: boolean
            calculated_date: string | null
          }
          const oldEvent = payload.old as {
            is_locked: boolean
            calculated_date: string | null
          }

          const { onEventLocked, onEventReopened, showToasts } = callbacksRef.current

          if (updatedEvent.is_locked !== oldEvent.is_locked) {
            if (updatedEvent.is_locked) {
              onEventLocked?.()

              if (showToasts) {
                toast.success("Event locked by admin", {
                  description: updatedEvent.calculated_date
                    ? `Chosen date: ${new Date(updatedEvent.calculated_date).toLocaleDateString()}`
                    : undefined,
                  duration: 4000,
                })
              }
            } else {
              onEventReopened?.()

              if (showToasts) {
                toast.info("Event reopened by admin", {
                  description: "You can now edit your availability again",
                  duration: 4000,
                })
              }
            }
          }

          refreshEvent(eventId)
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "availability",
          filter: `participant_id=in.(SELECT id FROM participants WHERE event_id='${eventId}')`,
        },
        (payload) => {
          console.log("Availability updated:", payload)

          callbacksRef.current.onAvailabilityUpdate?.()
        }
      )
      .subscribe((status) => {
        console.log(`Real-time subscription status for event ${eventId}:`, status)
        const { showToasts } = callbacksRef.current
        
        if (status === "SUBSCRIBED") {
          console.log(`✅ Successfully subscribed to real-time updates for event ${eventId}`)
        } else if (status === "CHANNEL_ERROR") {
          console.error("❌ Real-time subscription error for event:", eventId)
          if (showToasts) {
            toast.error("Real-time updates disconnected. Please refresh the page.", {
              duration: 5000,
            })
          }
        } else if (status === "TIMED_OUT") {
          console.error("⏱️ Real-time subscription timed out for event:", eventId)
          if (showToasts) {
            toast.warning("Real-time connection timed out. Updates may be delayed.", {
              duration: 5000,
            })
          }
        } else if (status === "CLOSED") {
          console.log("🔒 Real-time subscription closed for event:", eventId)
        } else {
          console.log("ℹ️ Real-time subscription status:", status, "for event:", eventId)
        }
      })

    return () => {
      if (channelRef.current) {
        console.log(`Unsubscribing from real-time updates for event ${eventId}`)
        supabase.removeChannel(channelRef.current)
        channelRef.current = null
      }
    }
  }, [eventId, refreshParticipants, refreshEvent]) // Only depend on eventId and stable callbacks

  return {
    isConnected: channelRef.current !== null,
  }
}
