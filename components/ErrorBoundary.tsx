"use client"

import { AlertCircle, RefreshCw } from "lucide-react"
import { useTranslations } from "next-intl"
import { Component, type ReactNode } from "react"
import { Button } from "@/components/ui/button"

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

class ErrorBoundaryClass extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    if (process.env.NODE_ENV === "development") {
      console.error("ErrorBoundary caught an error:", error, errorInfo)
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return <ErrorFallback error={this.state.error} onReset={this.handleReset} />
    }

    return this.props.children
  }
}

interface ErrorFallbackProps {
  error: Error | null
  onReset: () => void
}

function ErrorFallback({ error, onReset }: ErrorFallbackProps) {
  const t = useTranslations("errors")

  const handleGoHome = () => {
    window.location.href = "/"
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full space-y-6 text-center">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-foreground">{t("boundary.title")}</h1>
          <p className="text-muted-foreground">{t("boundary.description")}</p>
        </div>

        {process.env.NODE_ENV === "development" && error && (
          <div className="mt-4 p-4 bg-muted rounded-lg text-left">
            <p className="text-sm font-mono text-foreground break-all">{error.message}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={onReset} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            {t("boundary.tryAgain")}
          </Button>
          <Button variant="outline" onClick={handleGoHome}>
            {t("boundary.goHome")}
          </Button>
        </div>

        <p className="text-sm text-muted-foreground mt-8">{t("boundary.persistsMessage")}</p>
      </div>
    </div>
  )
}

export function ErrorBoundary({ children, fallback }: ErrorBoundaryProps) {
  return <ErrorBoundaryClass fallback={fallback}>{children}</ErrorBoundaryClass>
}
