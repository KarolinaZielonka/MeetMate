"use client"

import { Lock } from "lucide-react"
import { useTranslations } from "next-intl"
import type { FormEvent } from "react"
import { useState } from "react"
import { toast } from "sonner"
import { InputDialog } from "@/components/ui/InputDialog"

interface PasswordDialogProps {
  shareUrl: string
  open: boolean
  onSuccess: (accessToken: string) => void
}

export function PasswordDialog({ shareUrl, open, onSuccess }: PasswordDialogProps) {
  const t = useTranslations("events")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!password.trim()) {
      toast.error(t("passwordRequired"))
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`/api/events/${shareUrl}/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      })

      const result = await response.json()

      if (result.error) {
        toast.error(result.error)
        setPassword("")
        return
      }

      // Store access token in localStorage
      localStorage.setItem(`password_access_${result.data.eventId}`, result.data.accessToken)

      toast.success(t("passwordVerified"))
      onSuccess(result.data.accessToken)
    } catch (error) {
      console.error("Password verification error:", error)
      toast.error(t("passwordVerificationFailed"))
    } finally {
      setIsLoading(false)
    }
  }

  const lockIcon = <Lock className="w-8 h-8 text-white" />

  return (
    <InputDialog
      open={open}
      onOpenChange={() => {}}
      title={t("passwordRequired")}
      description={t("passwordDialogDescription")}
      inputLabel={t("password")}
      inputPlaceholder={t("enterPassword")}
      inputValue={password}
      onInputChange={setPassword}
      onSubmit={handleSubmit}
      submitText={t("unlock")}
      loadingText={t("verifying")}
      isLoading={isLoading}
      inputType="password"
      icon={lockIcon}
      closable={false}
    />
  )
}
