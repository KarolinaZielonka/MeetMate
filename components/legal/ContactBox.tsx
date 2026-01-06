interface ContactBoxProps {
  title: string
  description: string
  email: string
  response?: string
}

export function ContactBox({ title, description, email, response }: ContactBoxProps) {
  return (
    <div className="mt-8 p-6 bg-card border border-border rounded-lg">
      <h2 className="text-2xl font-semibold text-foreground mb-2">{title}</h2>
      <p className="text-muted-foreground mb-4">{description}</p>
      <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
        <p className="font-mono text-sm text-card-foreground mb-2">{email}</p>
        {response && <p className="text-sm text-muted-foreground">{response}</p>}
      </div>
    </div>
  )
}
