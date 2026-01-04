"use client"

import { cn } from "@/lib/utils"

function LegendItem({
  className,
  label,
  instruction,
}: {
  className: string
  label: string
  instruction?: string
}) {
  return (
    <div className="flex items-center gap-2">
      <div className={cn("w-6 h-6 rounded border-2 flex-shrink-0", className)} />
      <div className="flex flex-col">
        <span className="text-xs text-foreground font-medium">{label}</span>
        {instruction && (
          <span className="text-[10px] text-muted-foreground font-mono">{instruction}</span>
        )}
      </div>
    </div>
  )
}

export default LegendItem
