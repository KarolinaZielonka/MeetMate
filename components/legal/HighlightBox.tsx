interface HighlightBoxProps {
  children: React.ReactNode
  variant?: "primary" | "muted"
}

export function HighlightBox({ children, variant = "primary" }: HighlightBoxProps) {
  const bgClass =
    variant === "primary" ? "bg-primary/5 border-primary/20" : "bg-muted/30 border-border"

  return <div className={`p-3 ${bgClass} border rounded-lg`}>{children}</div>
}
