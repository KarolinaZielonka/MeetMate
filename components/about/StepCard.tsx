import type { LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface StepCardProps {
  icon: LucideIcon
  title: string
  description: string
  gradient: "gradient-blue" | "gradient-red" | "gradient-green"
  iconBg: "icon-bg-blue" | "icon-bg-red" | "icon-bg-green"
}

export function StepCard({ icon: Icon, title, description, gradient, iconBg }: StepCardProps) {
  return (
    <Card className={`border-none shadow-lg card-hover ${gradient}`}>
      <CardContent className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="flex-shrink-0 relative z-10">
            <div
              className={`w-14 h-14 ${iconBg} rounded-2xl flex items-center justify-center shadow-lg hover-scale-icon text-white`}
            >
              <Icon className="w-7 h-7" />
            </div>
          </div>

          <div className="flex-1 space-y-2">
            <h3 className="text-xl md:text-2xl font-bold text-foreground">{title}</h3>
            <p className="text-muted-foreground leading-relaxed">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
