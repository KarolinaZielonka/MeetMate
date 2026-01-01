import { useEffect, useState } from "react"
import type { Event } from "@/types"
import type { UsePasswordProtectionResult } from "./types"

export function usePasswordProtection(event: Event | null): UsePasswordProtectionResult {
  const [isPasswordVerified, setIsPasswordVerified] = useState(false)
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)

  useEffect(() => {
    if (!event) return

    if (event.has_password) {
      const accessToken = localStorage.getItem(`password_access_${event.id}`)
      if (!accessToken) {
        setShowPasswordDialog(true)
        setIsPasswordVerified(false)
      } else {
        setIsPasswordVerified(true)
        setShowPasswordDialog(false)
      }
    } else {
      setIsPasswordVerified(true)
      setShowPasswordDialog(false)
    }
  }, [event])

  const handlePasswordSuccess = () => {
    setIsPasswordVerified(true)
    setShowPasswordDialog(false)
  }

  return {
    isPasswordVerified,
    showPasswordDialog,
    setShowPasswordDialog,
    handlePasswordSuccess,
  }
}
