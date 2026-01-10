"use client"

import { motion } from "framer-motion"
import { Copy } from "lucide-react"
import { useTranslations } from "next-intl"
import { FacebookIcon } from "@/components/icons/FacebookIcon"
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon"

const iconVariants = {
  initial: { scale: 0, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0, opacity: 0 },
}

interface ShareButtonExpandedProps {
  onCopy: () => void
  onWhatsApp: () => void
  onMessenger: () => void
}

export function ShareButtonExpanded({ onCopy, onWhatsApp, onMessenger }: ShareButtonExpandedProps) {
  const t = useTranslations("eventPage.share")

  return (
    <motion.div
      key="expanded"
      className="flex items-center gap-1 bg-muted/80 backdrop-blur-sm rounded-full px-1.5 py-0.5 shadow-md border border-border"
      initial={{ opacity: 0, scale: 0.8, width: 40 }}
      animate={{ opacity: 1, scale: 1, width: "auto" }}
      exit={{ opacity: 0, scale: 0.8, width: 40 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      {/* Copy Link Button */}
      <motion.button
        type="button"
        onClick={onCopy}
        className="h-9 w-9 rounded-full flex items-center justify-center hover:bg-primary/15 text-foreground transition-all duration-200"
        aria-label={t("copyButton")}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.05 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div variants={iconVariants} initial="initial" animate="animate" exit="exit">
          <Copy className="w-5 h-5" />
        </motion.div>
      </motion.button>

      {/* WhatsApp Button */}
      <motion.button
        type="button"
        onClick={onWhatsApp}
        className="h-9 w-9 rounded-full flex items-center justify-center hover:bg-[#25D366]/15 text-[#25D366] transition-all duration-200"
        aria-label={t("shareVia", { app: "WhatsApp" })}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div variants={iconVariants} initial="initial" animate="animate" exit="exit">
          <WhatsAppIcon className="w-5 h-5" />
        </motion.div>
      </motion.button>

      {/* Facebook Button */}
      <motion.button
        type="button"
        onClick={onMessenger}
        className="h-9 w-9 rounded-full flex items-center justify-center hover:bg-[#1877F2]/15 text-[#1877F2] transition-all duration-200"
        aria-label={t("shareVia", { app: "Facebook" })}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.15 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div variants={iconVariants} initial="initial" animate="animate" exit="exit">
          <FacebookIcon className="w-5 h-5" />
        </motion.div>
      </motion.button>
    </motion.div>
  )
}
