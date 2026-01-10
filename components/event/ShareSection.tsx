"use client"

import { AnimatePresence, motion } from "framer-motion"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { toast } from "sonner"
import type { ShareConfig } from "@/lib/utils/share"
import { generateMessengerUrl, generateWhatsAppUrl } from "@/lib/utils/share"
import { ShareButtonExpanded, ShareButtonInitial, ShareButtonSuccess } from "./share"

type ShareState = "initial" | "expanded" | "success"

interface ShareSectionProps {
  shareUrl: string
  eventName?: string
}

export function ShareSection({ shareUrl, eventName = "Event" }: ShareSectionProps) {
  const t = useTranslations("eventPage.share")
  const [state, setState] = useState<ShareState>("initial")
  const [successAction, setSuccessAction] = useState<string>("")

  const handleCopyLink = async () => {
    if (typeof window === "undefined") return

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl)
      } else {
        const textArea = document.createElement("textarea")
        textArea.value = shareUrl
        textArea.style.position = "fixed"
        textArea.style.left = "-999999px"
        document.body.appendChild(textArea)
        textArea.select()
        try {
          document.execCommand("copy")
        } finally {
          document.body.removeChild(textArea)
        }
      }
      setSuccessAction("copy")
      setState("success")
      toast.success(t("copied"))
      setTimeout(() => setState("initial"), 1500)
    } catch (err) {
      console.error("Failed to copy:", err)
      toast.error("Failed to copy link")
    }
  }

  const handleShare = (
    callback: ({ url, eventName, message }: ShareConfig) => string,
    action: string
  ): void => {
    const url = callback({ url: shareUrl, eventName })
    window.open(url, "_blank", "noopener,noreferrer")
    setSuccessAction(action)
    setState("success")
    setTimeout(() => setState("initial"), 1500)
  }

  const handleWhatsApp = () => handleShare(generateWhatsAppUrl, "whatsapp")

  const handleMessenger = () => handleShare(generateMessengerUrl, "messenger")

  const handleShareClick = () => {
    setState("expanded")
  }

  const handleClickOutside = () => {
    if (state === "expanded") {
      setState("initial")
    }
  }

  const containerVariants = {
    initial: { width: "auto" },
    expanded: { width: "auto" },
    success: { width: "auto" },
  }

  return (
    <div className="relative">
      {state === "expanded" && (
        <button
          type="button"
          className="fixed inset-0 z-10 cursor-default bg-transparent"
          onClick={handleClickOutside}
          onKeyDown={(e) => e.key === "Escape" && handleClickOutside()}
          aria-label="Close share options"
        />
      )}

      <motion.div
        className="relative z-20 w-full md:w-auto md:inline-flex"
        variants={containerVariants}
        initial="initial"
        animate={state}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <AnimatePresence mode="wait">
          {state === "initial" && <ShareButtonInitial onClick={handleShareClick} />}

          {state === "expanded" && (
            <ShareButtonExpanded
              onCopy={handleCopyLink}
              onWhatsApp={handleWhatsApp}
              onMessenger={handleMessenger}
            />
          )}

          {state === "success" && <ShareButtonSuccess action={successAction} />}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
