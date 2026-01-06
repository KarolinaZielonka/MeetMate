import type { LucideIcon } from "lucide-react"

interface PageHeaderProps {
  icon: LucideIcon
  title: string
  lastUpdated: string
}

export function PageHeader({ icon: Icon, title, lastUpdated }: PageHeaderProps) {
  return (
    <div className="mb-12 text-center">
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Icon className="w-8 h-8 text-primary" />
        </div>
      </div>
      <h1 className="text-4xl font-bold text-foreground mb-3">{title}</h1>
      <p className="text-muted-foreground text-sm">{lastUpdated}</p>
    </div>
  )
}
