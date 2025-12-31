"use client"

import { LockOpen } from "lucide-react"
import { useTranslations } from "next-intl"
import { ConfirmDialog } from "@/components/ui/ConfirmDialog"
import type { DialogProps } from "./types"

export function ReopenEventDialog({ open, onOpenChange, onConfirm, isLoading }: DialogProps) {
  const t = useTranslations("adminControls")

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t("reopenConfirm.title")}
      description={t("reopenConfirm.description")}
      confirmText={isLoading ? t("reopeningButton") : t("reopenConfirm.confirm")}
      cancelText={t("reopenConfirm.cancel")}
      onConfirm={onConfirm}
      isLoading={isLoading}
      variant="default"
      icon={<LockOpen className="w-5 h-5" />}
    />
  )
}
