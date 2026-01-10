export function LegalSection({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children?: React.ReactNode
}) {
  return (
    <section className="bg-card border border-border rounded-xl p-6">
      <h2 className="text-xl font-semibold text-card-foreground mb-2">{title}</h2>
      {description && (
        <p className="text-card-foreground mb-2 text-lg font-semibold">{description}</p>
      )}
      {children}
    </section>
  )
}
