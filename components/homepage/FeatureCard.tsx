import type { ReactNode } from "react"
import { Card, CardContent } from "@/components/ui/card"

export interface FeatureCardProps {
  icon: ReactNode
  title: string
  description: string
  gradientClass: "gradient-purple" | "gradient-blue" | "gradient-green" | "gradient-orange"
  iconBgClass: "icon-bg-purple" | "icon-bg-blue" | "icon-bg-green" | "icon-bg-orange"
}

export function FeatureCard({ feature }: { feature: FeatureCardProps }) {
  const { gradientClass, iconBgClass, icon, title, description } = feature
  return (
    <Card className={`border-none shadow-lg card-hover ${gradientClass}`}>
      <CardContent className="pt-6 pb-6 text-center space-y-4">
        <div
          className={`w-14 h-14 rounded-2xl mx-auto flex items-center justify-center shadow-lg hover-scale-icon text-white ${iconBgClass}`}
        >
          {icon}
        </div>
        <h3 className="text-xl font-bold text-foreground">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}
