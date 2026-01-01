"use client"

import { LockOpen, Settings, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DeleteEventDialog, ReopenEventDialog } from "./dialogs"

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
              <Settings className="w-5 h-5 text-white" />
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
