import { Card, CardContent } from "@/components/ui/card"
import type { ReactNode } from "react"

interface FeatureCardProps {
  icon: ReactNode
  title: string
  description: string
  gradientClass: string
}

export function FeatureCard({ icon, title, description, gradientClass }: FeatureCardProps) {
  return (
    <Card className="border-none shadow-lg card-hover">
      <CardContent className="pt-6 pb-6 text-center space-y-4">
        <div className={`w-14 h-14 ${gradientClass} rounded-2xl mx-auto flex items-center justify-center shadow-lg hover-scale-icon`}>
          {icon}
        </div>
        <h3 className="text-xl font-bold text-foreground">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}
