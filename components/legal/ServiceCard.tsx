interface ServiceCardProps {
  name: string
  purpose: string
  privacyLink: string
}

export function ServiceCard({ name, purpose, privacyLink }: ServiceCardProps) {
  return (
    <div className="p-3 bg-muted/50 rounded-lg">
      <p className="font-medium text-card-foreground mb-1">{name}</p>
      <p className="text-sm text-muted-foreground mb-1">{purpose}</p>
      <p className="text-xs text-primary">{privacyLink}</p>
    </div>
  )
}
