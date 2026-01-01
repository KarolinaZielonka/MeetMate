"use client"

import { cn } from "@/lib/utils"

function LegendItem({ className, label }: { className: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className={cn("w-6 h-6 rounded border-2", className)} />
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  )
}

export default LegendItem
