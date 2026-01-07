import { create } from "zustand"
import { validateDateRange } from "@/lib/utils/dates"
import { initializeSession } from "@/lib/utils/session"

interface FormData {
  name: string
  startDate: string
  endDate: string
  creatorName: string
  password: string
  captchaToken: string
}

interface ValidationState {
  error: string | null
  warning: string | null
}

interface CreateEventState {
  // Form state
  formData: FormData
  isLoading: boolean
  validation: ValidationState

  // Actions
  setFormField: (field: keyof FormData, value: string) => void
  setDateRange: (startDate: string, endDate: string) => void
  validateForm: (t: (key: string) => string) => boolean
  createEvent: (
    t: (key: string) => string,
    tApi: (key: string) => string
  ) => Promise<{ success: boolean; shareUrl?: string }>
  reset: () => void
}

const initialFormData: FormData = {
  name: "",
  startDate: "",
  endDate: "",
  creatorName: "",
  password: "",
  captchaToken: "",
}

const initialValidation: ValidationState = {
  error: null,
  warning: null,
}

export const useCreateEventStore = create<CreateEventState>((set, get) => ({
  // Initial state
  formData: initialFormData,
  isLoading: false,
  validation: initialValidation,

  // Actions
  setFormField: (field, value) =>
    set((state) => ({
      formData: { ...state.formData, [field]: value },
      validation: state.validation.error ? { ...state.validation, error: null } : state.validation,
    })),

  setDateRange: (startDate, endDate) => {
    set((state) => ({
      formData: { ...state.formData, startDate, endDate },
      validation: state.validation.error ? { ...state.validation, error: null } : state.validation,
    }))

    // Validate date range if both dates are set
    if (startDate && endDate) {
      try {
        const validationResult = validateDateRange(startDate, endDate)
        if (!validationResult.valid) {
          set({
            validation: {
              error: validationResult.error || null,
              warning: null,
            },
          })
        } else if (validationResult.warning) {
          set({
            validation: {
              error: null,
              warning: validationResult.warning,
            },
          })
        } else {
          set({ validation: { error: null, warning: null } })
        }
      } catch (_err) {
        set({ validation: { error: "Invalid date format", warning: null } })
      }
    }
  },

  validateForm: (t) => {
    const { formData } = get()

    if (!formData.name.trim()) {
      set({ validation: { error: t("errors.nameRequired"), warning: null } })
      return false
    }

    if (!formData.startDate || !formData.endDate) {
      set({ validation: { error: t("errors.datesRequired"), warning: null } })
      return false
    }

    if (!formData.creatorName.trim()) {
      set({ validation: { error: t("errors.creatorNameRequired"), warning: null } })
      return false
    }

    // Only validate CAPTCHA if the site key is configured
    if (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && !formData.captchaToken) {
      set({ validation: { error: t("errors.captchaRequired"), warning: null } })
      return false
    }

    return true
  },

  createEvent: async (t, tApi) => {
    const { formData, validateForm } = get()

    // Reset validation state
    set({ validation: { error: null, warning: null } })

    if (!validateForm(t)) {
      return { success: false }
    }

    set({ isLoading: true })

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
          captcha_token: formData.captchaToken || undefined,
        }),
      })

      const result = await response.json()

      if (!response.ok || result.error) {
        const errorMsg = result.error || tApi("errors.createFailed")
        set({ validation: { error: errorMsg, warning: null }, isLoading: false })
        return { success: false }
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

      set({ isLoading: false })
      return { success: true, shareUrl }
    } catch (err) {
      console.error("Error creating event:", err)
      const errorMsg = tApi("errors.unexpected")
      set({ validation: { error: errorMsg, warning: null }, isLoading: false })
      return { success: false }
    }
  },

  reset: () => set({ formData: initialFormData, isLoading: false, validation: initialValidation }),
}))
