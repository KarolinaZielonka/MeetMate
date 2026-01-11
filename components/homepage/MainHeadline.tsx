"use client"

import { AnimatePresence, motion } from "motion/react"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"

export function MainHeadline() {
  const t = useTranslations("homepage")
  const [currentTitleIndex, setCurrentTitleIndex] = useState(0)
  const [mounted, setMounted] = useState(false)

  const titleVariations = [
    { main: t("titles.0.main"), accent: t("titles.0.accent") },
    { main: t("titles.1.main"), accent: t("titles.1.accent") },
    { main: t("titles.2.main"), accent: t("titles.2.accent") },
  ]

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const interval = setInterval(() => {
      setCurrentTitleIndex((prev) => (prev + 1) % titleVariations.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [titleVariations.length, mounted])

  const currentTitle = titleVariations[currentTitleIndex]

  const waveVariants = {
    hidden: { rotateX: -90, opacity: 0 },
    visible: (i: number) => ({
      rotateX: 0,
      opacity: 1,
      transition: {
        delay: i * 0.05,
        duration: 0.5,
        ease: "easeOut" as const,
      },
    }),
    exit: (i: number) => ({
      rotateX: 90,
      opacity: 0,
      transition: {
        delay: i * 0.02,
        duration: 0.3,
        ease: "easeIn" as const,
      },
    }),
  }

  const renderAnimatedText = (text: string, startIndex: number, className?: string) => {
    return text.split("").map((char, index) => (
      <motion.span
        key={`${currentTitleIndex}-${startIndex}-${index}-${char}`}
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

  if (!mounted) {
    return (
      <div className="space-y-4 fade-in">
        <div className="inline-block">
          <span className="inline-block px-4 py-1.5 bg-primary/20 text-primary dark:bg-primary/25 rounded-full text-sm font-medium mb-4">
            {t("badge")}
          </span>
        </div>

      <h1 className="text-[2.5rem] sm:text-5xl md:text-7xl headline-tight text-foreground leading-tight min-h-[120px] sm:min-h-[80px] md:min-h-[120px]">
        <span className="block sm:inline">{currentTitle.main}</span>
        <span className="block sm:inline text-primary">{currentTitle.accent}</span>
      </h1>
      </div>
    )
  }

  return (
    <div className="space-y-4 fade-in">
      <div className="inline-block">
        <span className="inline-block px-4 py-1.5 bg-primary/20 text-primary dark:bg-primary/25 rounded-full text-sm font-medium mb-4 hover-scale">
          {t("badge")}
        </span>
      </div>

      <h1 className="text-[2.5rem] sm:text-5xl md:text-7xl headline-tight text-foreground leading-tight min-h-[120px] sm:min-h-[80px] md:min-h-[120px]">
        <AnimatePresence mode="wait">
          <motion.span key={currentTitleIndex} className="block">
            <span className="block sm:inline">{renderAnimatedText(currentTitle.main, 0)}</span>
            <span className="block sm:inline text-primary">
              {renderAnimatedText(currentTitle.accent, currentTitle.main.length, "text-primary")}
            </span>
          </motion.span>
        </AnimatePresence>
      </h1>
    </div>
  )
}
