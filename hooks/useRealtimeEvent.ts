"use client"

import { useEffect, useRef } from "react"
import { supabase } from "@/lib/supabase/client"
import { useEventStore } from "@/store/eventStore"
import { toast } from "sonner"
import type { RealtimeChannel } from "@supabase/supabase-js"

interface UseRealtimeEventOptions {
  eventId: string
  onParticipantJoin?: (participantName: string) => void
  onParticipantUpdate?: (participantName: string) => void
  showToasts?: boolean
}

/**
 * Hook to subscribe to real-time updates for an event
 *
 * Subscribes to the participants table and listens for:
 * - INSERT: New participant joins
 * - UPDATE: Participant submits/updates availability
 *
 * @param options - Configuration options
 */
export function useRealtimeEvent({
  eventId,
  onParticipantJoin,
  onParticipantUpdate,
  showToasts = true,
}: UseRealtimeEventOptions) {
  const channelRef = useRef<RealtimeChannel | null>(null)
  const setParticipants = useEventStore((state) => state.setParticipants)

  useEffect(() => {
    if (!eventId) return

    // Create a unique channel name for this event
    const channelName = `participants:event_id=eq.${eventId}`

    // Subscribe to participants table changes
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
          console.log("New participant joined:", payload)

          const newParticipant = payload.new as {
            id: string
            name: string
            has_submitted: boolean
            created_at: string
          }

          // Call custom callback
          onParticipantJoin?.(newParticipant.name)

          // Show toast notification
          if (showToasts) {
            toast.success(`${newParticipant.name} joined the event!`, {
              duration: 3000,
            })
          }

          // Refresh participants list
          // Note: In production, you might want to add the participant directly
          // instead of refetching, but refetching ensures consistency
          refreshParticipants(eventId)
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
          console.log("Participant updated:", payload)

          const updatedParticipant = payload.new as {
            id: string
            name: string
            has_submitted: boolean
          }

          // Only show notification if has_submitted changed to true
          const oldParticipant = payload.old as { has_submitted: boolean }
          if (updatedParticipant.has_submitted && !oldParticipant.has_submitted) {
            // Call custom callback
            onParticipantUpdate?.(updatedParticipant.name)

            // Show toast notification
            if (showToasts) {
              toast.info(`${updatedParticipant.name} submitted their availability!`, {
                duration: 3000,
              })
            }
          }

          // Refresh participants list
          refreshParticipants(eventId)
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log(`Subscribed to real-time updates for event ${eventId}`)
        } else if (status === "CHANNEL_ERROR") {
          console.error("Real-time subscription error")
          if (showToasts) {
            toast.error("Real-time updates disconnected. Please refresh the page.", {
              duration: 5000,
            })
          }
        } else if (status === "TIMED_OUT") {
          console.error("Real-time subscription timed out")
        } else if (status === "CLOSED") {
          console.log("Real-time subscription closed")
        }
      })

    // Cleanup function
    return () => {
      if (channelRef.current) {
        console.log(`Unsubscribing from real-time updates for event ${eventId}`)
        supabase.removeChannel(channelRef.current)
        channelRef.current = null
      }
    }
  }, [eventId, onParticipantJoin, onParticipantUpdate, showToasts])

  // Helper function to refresh participants list
  const refreshParticipants = async (eventId: string) => {
    try {
      // Fetch event's share_url first
      const { data: event } = await supabase
        .from("events")
        .select("share_url")
        .eq("id", eventId)
        .single()

      if (!event) return

      // Fetch updated participants list
      const { data: participants, error } = await supabase
        .from("participants")
        .select("id, name, has_submitted, created_at, session_token")
        .eq("event_id", eventId)
        .order("created_at", { ascending: true })

      if (error) {
        console.error("Error fetching participants:", error)
        return
      }

      // Update Zustand store
      if (participants) {
        setParticipants(participants)
      }
    } catch (error) {
      console.error("Error refreshing participants:", error)
    }
  }

  return {
    isConnected: channelRef.current !== null,
  }
}
