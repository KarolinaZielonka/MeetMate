import { AlertCircle, Info } from "lucide-react"

interface AlertMessageProps {
  type: "error" | "warning" | "info"
  message: string
}

export function AlertMessage({ type, message }: AlertMessageProps) {
  const styles = {
    error: {
      container: "bg-destructive/10 border-l-4 border-destructive",
      icon: "text-destructive",
      text: "text-destructive-foreground",
    },
    warning: {
      container: "bg-warning/10 border-l-4 border-warning",
      icon: "text-warning",
      text: "text-warning-foreground",
    },
    info: {
      container: "bg-primary/10 border border-primary/20",
      icon: "text-primary",
      text: "text-primary",
    },
  }

  const style = styles[type]
  const Icon = type === "info" ? Info : AlertCircle

  return (
    <div className={`flex items-start gap-3 p-4 ${style.container} rounded-lg fade-in`}>
      <Icon className={`w-5 h-5 ${style.icon} flex-shrink-0 mt-0.5`} />
      <p className={`text-sm ${style.text} font-medium`}>{message}</p>
    </div>
  )
}
