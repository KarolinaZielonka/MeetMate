import type { ReactNode } from "react"
import { Card, CardContent } from "@/components/ui/card"

export interface FeatureCardProps {
  icon: ReactNode
  title: string
  description: string
  iconBgClass: "icon-bg-orange" | "icon-bg-blue" | "icon-bg-green" | "icon-bg-orange"
}

export function FeatureCard({ feature }: { feature: FeatureCardProps }) {
  const { iconBgClass, icon, title, description } = feature
  
  // Map icon background classes to feature-card-icon variants
  const iconVariant = iconBgClass.includes("green") 
    ? "icon-green" 
    : iconBgClass.includes("blue") 
    ? "icon-primary"
    : iconBgClass.includes("orange")
    ? "icon-orange"
    : "icon-primary"
  
  return (
    <Card className="feature-card">
      <CardContent className="pt-6 pb-6 text-center space-y-4">
        <div className={`feature-card-icon ${iconVariant} mx-auto hover-scale-icon`}>
          {icon}
        </div>
        <h3 className="text-xl font-bold text-foreground">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}
