"use client"

import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"

interface ShareButtonSuccessProps {
  action: string
}

export function ShareButtonSuccess({ action }: ShareButtonSuccessProps) {
  const t = useTranslations("eventPage.share")

  return (
    <motion.div
      key="success"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
    >
      <Button
        className="bg-green-600 hover:bg-green-700 shadow-md min-w-[120px] gap-2 pointer-events-none"
        asChild
      >
        <motion.div>
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 25,
              delay: 0.1,
            }}
          >
            <Check className="w-4 h-4" />
          </motion.div>
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
          >
            {action === "copy" ? t("copied") : t("shared")}
          </motion.span>
        </motion.div>
      </Button>
    </motion.div>
  )
}
