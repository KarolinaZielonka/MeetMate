"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { toast } from "sonner"
import { LockOpen, Trash2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ReopenEventDialog, DeleteEventDialog } from "./dialogs"

interface AdminControlsProps {
  shareUrl: string
  isLocked: boolean
  onEventReopened?: () => void
}

export function AdminControls({ shareUrl, isLocked, onEventReopened }: AdminControlsProps) {
  const t = useTranslations("adminControls")
  const router = useRouter()
  const [isReopening, setIsReopening] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showReopenDialog, setShowReopenDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleReopen = async () => {
    setIsReopening(true)
    try {
      const response = await fetch(`/api/events/${shareUrl}/reopen`, {
        method: "POST",
      })

      const result = await response.json()

      if (result.error) {
        toast.error(result.error)
        return
      }

      toast.success(t("successReopen"))
      setShowReopenDialog(false)
      onEventReopened?.()
    } catch (error) {
      console.error("Error reopening event:", error)
      toast.error(t("errorReopen"))
    } finally {
      setIsReopening(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/events/${shareUrl}`, {
        method: "DELETE",
      })

      const result = await response.json()

      if (result.error) {
        toast.error(result.error)
        return
      }

      toast.success(t("successDelete"))

      // Clear session data for this event
      if (typeof window !== "undefined") {
        const eventId = localStorage.getItem(`session_${shareUrl}`)
        if (eventId) {
          localStorage.removeItem(`session_${eventId}`)
        }
      }

      // Redirect to homepage after a short delay
      setTimeout(() => {
        router.push("/")
      }, 1000)
    } catch (error) {
      console.error("Error deleting event:", error)
      toast.error(t("errorDelete"))
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <Card className="shadow-lg border-none slide-up">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-accent rounded-lg flex items-center justify-center shadow-md hover-scale-icon">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            {t("title")}
          </CardTitle>
          <CardDescription className="text-base">{t("description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLocked && (
            <Button
              onClick={() => setShowReopenDialog(true)}
              variant="outline"
              className="w-full justify-start gap-2 h-12 text-base"
              disabled={isReopening}
            >
              <LockOpen className="w-5 h-5" />
              {isReopening ? t("reopeningButton") : t("reopenButton")}
            </Button>
          )}

          <Button
            onClick={() => setShowDeleteDialog(true)}
            variant="destructive"
            className="w-full justify-start gap-2 h-12 text-base"
            disabled={isDeleting}
          >
            <Trash2 className="w-5 h-5" />
            {isDeleting ? t("deletingButton") : t("deleteButton")}
          </Button>
        </CardContent>
      </Card>

      <ReopenEventDialog
        open={showReopenDialog}
        onOpenChange={setShowReopenDialog}
        onConfirm={handleReopen}
        isLoading={isReopening}
      />

      <DeleteEventDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </>
  )
}
