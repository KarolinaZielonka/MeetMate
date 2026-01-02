"use client"

import { AnimatePresence, motion } from "framer-motion"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"

export function MainHeadline() {
  const t = useTranslations("homepage")
  const [currentTitleIndex, setCurrentTitleIndex] = useState(0)

  const titleVariations = [
    { main: t("titles.0.main"), accent: t("titles.0.accent") },
    { main: t("titles.1.main"), accent: t("titles.1.accent") },
    { main: t("titles.2.main"), accent: t("titles.2.accent") },
  ]

  // Rotate through titles every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTitleIndex((prev) => (prev + 1) % titleVariations.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [titleVariations.length])

  const currentTitle = titleVariations[currentTitleIndex]

  const waveVariants = {
    hidden: { rotateX: -90, opacity: 0 },
    visible: (i: number) => ({
      rotateX: 0,
      opacity: 1,
      transition: {
        delay: i * 0.05,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
    exit: (i: number) => ({
      rotateX: 90,
      opacity: 0,
      transition: {
        delay: i * 0.02,
        duration: 0.3,
        ease: "easeIn",
      },
    }),
  }

  const renderAnimatedText = (text: string, startIndex: number, className?: string) => {
    return text.split("").map((char, index) => (
      <motion.span
        key={`${char}-${startIndex}`}
        custom={startIndex + index}
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={waveVariants}
        className={`inline-block ${className || ""}`}
        style={{ transformStyle: "preserve-3d" }}
      >
        {char === " " ? "\u00A0" : char}
      </motion.span>
    ))
  }

  return (
    <div className="space-y-4 fade-in">
      <div className="inline-block">
        <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4 hover-scale">
          {t("badge")}
        </span>
      </div>

      <h1 className="text-5xl md:text-7xl font-bold text-foreground leading-tight min-h-[80px] md:min-h-[120px]">
        <AnimatePresence mode="wait">
          <motion.span key={currentTitleIndex} className="inline-block">
            {renderAnimatedText(currentTitle.main, 0)}
            <span className="text-primary">
              {renderAnimatedText(currentTitle.accent, currentTitle.main.length, "text-primary")}
            </span>
          </motion.span>
        </AnimatePresence>
      </h1>
    </div>
  )
}
