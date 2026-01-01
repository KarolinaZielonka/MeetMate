"use client"

import { Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateSessionAsParticipant } from "@/lib/utils/session"

interface JoinEventFormProps {
  eventId: string
  onSuccess: () => void
}

export function JoinEventForm({ eventId, onSuccess }: JoinEventFormProps) {
  const t = useTranslations("eventPage.join")
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!name.trim()) {
      toast.error(t("errorNameRequired"))
      return
    }

    if (name.trim().length > 100) {
      toast.error(t("errorNameTooLong"))
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
        toast.error(result.error || t("errorJoinFailed"))
        setIsLoading(false)
        return
      }

      // Update session with participant info
      updateSessionAsParticipant(eventId, result.data.id, result.data.session_token)

      // Show success message
      toast.success(t("successMessage"))

      // Trigger parent refresh
      onSuccess()
    } catch (err) {
      console.error("Error joining event:", err)
      toast.error(t("errorJoinFailed"))
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="participant-name" className="text-base font-semibold">
          {t("nameLabel")}
        </Label>
        <Input
          type="text"
          id="participant-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t("namePlaceholder")}
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
            <Loader2 className="spin-smooth h-5 w-5" />
            {t("joiningButton")}
          </span>
        ) : (
          t("joinButton")
        )}
      </Button>
    </form>
  )
}
