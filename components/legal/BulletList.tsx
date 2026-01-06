interface BulletListProps {
  items: string[]
  variant?: "primary" | "destructive"
}

export function BulletList({ items, variant = "primary" }: BulletListProps) {
  const bulletColor = variant === "destructive" ? "text-destructive" : "text-primary"

  return (
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li key={index} className="flex items-start gap-2">
          <span className={`${bulletColor} mt-1`}>•</span>
          <span className="text-card-foreground">{item}</span>
        </li>
      ))}
    </ul>
  )
}
