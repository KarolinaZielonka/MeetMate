import type { LucideIcon } from "lucide-react"

interface LegalSectionProps {
  icon?: LucideIcon
  iconVariant?: "primary" | "destructive"
  title: string
  description?: string
  children?: React.ReactNode
}

export function LegalSection({
  icon: Icon,
  iconVariant = "primary",
  title,
  description,
  children,
}: LegalSectionProps) {
  const iconBgClass = iconVariant === "destructive" ? "bg-destructive/10" : "bg-primary/10"
  const iconColorClass = iconVariant === "destructive" ? "text-destructive" : "text-primary"

  return (
    <section className="bg-card border border-border rounded-xl p-6">
      {Icon ? (
        <div className="flex items-start gap-3 mb-4">
          <div className={`w-10 h-10 rounded-lg ${iconBgClass} flex items-center justify-center flex-shrink-0`}>
            <Icon className={`w-5 h-5 ${iconColorClass}`} />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-card-foreground mb-2">{title}</h2>
            {description && <p className="text-muted-foreground mb-4">{description}</p>}
            {children}
          </div>
        </div>
      ) : (
        <>
          <h2 className="text-xl font-semibold text-card-foreground mb-2">{title}</h2>
          {description && <p className="text-card-foreground">{description}</p>}
          {children}
        </>
      )}
    </section>
  )
}
