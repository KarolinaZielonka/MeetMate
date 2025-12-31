"use client"

import { Trash2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { ConfirmDialog } from "@/components/ui/ConfirmDialog"
import type { DialogProps } from "./types"

export function DeleteEventDialog({ open, onOpenChange, onConfirm, isLoading }: DialogProps) {
  const t = useTranslations("adminControls")

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t("deleteConfirm.title")}
      description={t("deleteConfirm.description")}
      confirmText={isLoading ? t("deletingButton") : t("deleteConfirm.confirm")}
      cancelText={t("deleteConfirm.cancel")}
      onConfirm={onConfirm}
      isLoading={isLoading}
      variant="destructive"
      icon={<Trash2 className="w-5 h-5" />}
    />
  )
}
