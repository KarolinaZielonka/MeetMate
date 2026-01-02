import { useTranslations } from "next-intl"
import { useState } from "react"
import { toast } from "sonner"
import { useRouter } from "@/i18n/routing"
import { validateDateRange } from "@/lib/utils/dates"
import { initializeSession } from "@/lib/utils/session"

interface FormData {
  name: string
  startDate: string
  endDate: string
  creatorName: string
  password: string
}

interface ValidationState {
  error: string | null
  warning: string | null
}

export function useCreateEventForm() {
  const router = useRouter()
  const t = useTranslations("createEvent")
  const tApi = useTranslations("api")

  const [formData, setFormData] = useState<FormData>({
    name: "",
    startDate: "",
    endDate: "",
    creatorName: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [validation, setValidation] = useState<ValidationState>({
    error: null,
    warning: null,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear errors when user starts typing
    if (validation.error) {
      setValidation((prev) => ({ ...prev, error: null }))
    }
  }

  const handleDateChange = (startDate: string, endDate: string) => {
    setFormData((prev) => ({ ...prev, startDate, endDate }))

    // Clear errors when user starts typing
    if (validation.error) {
      setValidation((prev) => ({ ...prev, error: null }))
    }

    // Only validate if both dates are set
    if (startDate && endDate) {
      try {
        const validationResult = validateDateRange(startDate, endDate)
        if (!validationResult.valid) {
          setValidation({
            error: validationResult.error || null,
            warning: null,
          })
        } else if (validationResult.warning) {
          setValidation({
            error: null,
            warning: validationResult.warning,
          })
        } else {
          setValidation({ error: null, warning: null })
        }
      } catch (_err) {
        setValidation({ error: "Invalid date format", warning: null })
      }
    }
  }

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setValidation({ error: t("errors.nameRequired"), warning: null })
      return false
    }

    if (!formData.startDate || !formData.endDate) {
      setValidation({ error: t("errors.datesRequired"), warning: null })
      return false
    }

    if (!formData.creatorName.trim()) {
      setValidation({ error: t("errors.creatorNameRequired"), warning: null })
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Reset validation state
    setValidation({ error: null, warning: null })

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          start_date: formData.startDate,
          end_date: formData.endDate,
          creator_name: formData.creatorName.trim(),
          password: formData.password || undefined,
        }),
      })

      const result = await response.json()

      if (!response.ok || result.error) {
        const errorMsg = result.error || tApi("errors.createFailed")
        setValidation({ error: errorMsg, warning: null })
        toast.error(errorMsg)
        setIsLoading(false)
        return
      }

      // Success! Initialize admin session
      const eventId = result.data.id
      const shareUrl = result.data.share_url

      // Initialize admin session with participant data
      initializeSession(
        eventId,
        true, // isCreator/admin
        result.data.participant
          ? {
              participantId: result.data.participant.participant_id,
              sessionToken: result.data.participant.session_token,
            }
          : undefined
      )

      toast.success(t("successMessage"))
      router.push(`/e/${shareUrl}`)
    } catch (err) {
      console.error("Error creating event:", err)
      const errorMsg = tApi("errors.unexpected")
      setValidation({ error: errorMsg, warning: null })
      toast.error(errorMsg)
      setIsLoading(false)
    }
  }

  return {
    formData,
    isLoading,
    validation,
    handleChange,
    handleDateChange,
    handleSubmit,
  }
}
