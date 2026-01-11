import type { LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface StepCardProps {
  icon: LucideIcon
  title: string
  description: string
  color: "blue" | "red" | "green"
}

export function StepCard({ icon: Icon, title, description, color }: StepCardProps) {
  return (
    <Card className={`step-card step-${color}`}>
      <CardContent className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="flex-shrink-0 relative z-10">
            <div className={`feature-card-icon icon-${color} w-14 h-14 rounded-2xl hover-scale-icon`}>
              <Icon className="w-7 h-7" />
            </div>
          </div>

          <div className="flex-1 space-y-2">
            <h3 className="text-xl md:text-2xl font-bold text-foreground headline-tight">
              {title}
            </h3>
            <p className="text-muted-foreground leading-relaxed">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
