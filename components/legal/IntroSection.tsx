interface IntroSectionProps {
  content: string
}

export function IntroSection({ content }: IntroSectionProps) {
  return (
    <div className="mb-12 p-6 bg-card border border-border rounded-xl">
      <p className="text-card-foreground leading-relaxed">{content}</p>
    </div>
  )
}
