"use client"

import { Check, Copy } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

interface ShareSectionProps {
  shareUrl: string
}

export function ShareSection({ shareUrl }: ShareSectionProps) {
  const t = useTranslations("eventPage.share")
  const [copySuccess, setCopySuccess] = useState(false)

  const handleCopyLink = async () => {
    if (typeof window === "undefined") return

    try {
      // Try modern Clipboard API first
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl)
        setCopySuccess(true)
        toast.success(t("copied"))
        setTimeout(() => setCopySuccess(false), 2000)
      } else {
        // Fallback for older browsers or insecure contexts (HTTP)
        const textArea = document.createElement("textarea")
        textArea.value = shareUrl
        textArea.style.position = "fixed"
        textArea.style.left = "-999999px"
        document.body.appendChild(textArea)
        textArea.select()

        try {
          document.execCommand("copy")
          setCopySuccess(true)
          toast.success(t("copied"))
          setTimeout(() => setCopySuccess(false), 2000)
        } catch (fallbackErr) {
          console.error("Fallback copy failed:", fallbackErr)
          toast.error("Failed to copy link")
        } finally {
          document.body.removeChild(textArea)
        }
      }
    } catch (err) {
      console.error("Failed to copy:", err)
      toast.error("Failed to copy link")
    }
  }

  return (
    <div>
      <Label className="text-sm font-semibold text-foreground mb-3 block">{t("label")}</Label>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 px-4 py-3 bg-muted border-2 border-border rounded-lg font-mono text-sm overflow-x-auto transition-smooth hover:border-primary/50">
          {shareUrl}
        </div>
        <Button
          onClick={handleCopyLink}
          className={`${copySuccess ? "bg-green-600 hover:bg-green-700" : "bg-gradient-primary hover:opacity-90"} shadow-md transition-smooth hover-lift w-full sm:w-auto sm:min-w-[120px]`}
        >
          {copySuccess ? (
            <>
              <Check className="w-4 h-4 mr-2 bounce-subtle" />
              {t("copied")}
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 mr-2 transition-smooth group-hover:scale-110" />
              {t("copyButton")}
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
