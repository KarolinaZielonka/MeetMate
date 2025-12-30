"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateSessionAsParticipant } from "@/lib/utils/session"

interface JoinEventFormProps {
  eventId: string
  shareUrl: string
  onSuccess: () => void
  translations: {
    title: string
    description: string
    nameLabel: string
    namePlaceholder: string
    joinButton: string
    joiningButton: string
    successMessage: string
    errorNameRequired: string
    errorNameTooLong: string
    errorJoinFailed: string
  }
}

export function JoinEventForm({ eventId, shareUrl, onSuccess, translations }: JoinEventFormProps) {
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!name.trim()) {
      toast.error(translations.errorNameRequired)
      return
    }

    if (name.trim().length > 100) {
      toast.error(translations.errorNameTooLong)
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/participants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event_id: eventId,
          name: name.trim(),
        }),
      })

      const result = await response.json()

      if (!response.ok || result.error) {
        toast.error(result.error || translations.errorJoinFailed)
        setIsLoading(false)
        return
      }

      // Update session with participant info
      updateSessionAsParticipant(eventId, result.data.id, result.data.session_token)

      // Show success message
      toast.success(translations.successMessage)

      // Trigger parent refresh
      onSuccess()
    } catch (err) {
      console.error("Error joining event:", err)
      toast.error(translations.errorJoinFailed)
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="participant-name" className="text-base font-semibold">
          {translations.nameLabel}
        </Label>
        <Input
          type="text"
          id="participant-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={translations.namePlaceholder}
          maxLength={100}
          required
          disabled={isLoading}
          className="h-12 text-base transition-smooth focus:shadow-md"
        />
      </div>

      <Button
        type="submit"
        disabled={isLoading || !name.trim()}
        className="w-full h-12 text-base bg-gradient-accent hover:opacity-90 shadow-lg hover:shadow-xl transition-smooth hover-lift"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg className="spin-smooth h-5 w-5" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            {translations.joiningButton}
          </span>
        ) : (
          translations.joinButton
        )}
      </Button>
    </form>
  )
}
