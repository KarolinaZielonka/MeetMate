"use client"

import { motion } from "framer-motion"
import { Share2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"

const buttonVariants = {
  initial: { scale: 1 },
  hover: { scale: 1.02 },
  tap: { scale: 0.98 },
}

interface ShareButtonInitialProps {
  onClick: () => void
}

export function ShareButtonInitial({ onClick }: ShareButtonInitialProps) {
  const t = useTranslations("eventPage.share")

  return (
    <motion.div
      key="initial"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
    >
      <Button
        onClick={onClick}
        className="bg-gradient-primary hover:opacity-90 shadow-md hover-lift min-w-[120px] gap-2"
        asChild
      >
        <motion.button variants={buttonVariants} whileHover="hover" whileTap="tap">
          <Share2 className="w-4 h-4" />
          {t("shareButton")}
        </motion.button>
      </Button>
    </motion.div>
  )
}
