import { Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/routing"

export function FloatingAboutButton() {
  return (
    <Link href="/about" className="fixed bottom-6 right-6 z-50 group">
      <Button
        size="icon"
        className="h-12 w-12 rounded-full shadow-lg hover:shadow-2xl transition-smooth hover-lift bg-gradient-primary hover:opacity-90"
        aria-label="About"
      >
        <Info className="w-6 h-6 transition-smooth group-hover:scale-110 group-hover:rotate-12" />
      </Button>
    </Link>
  )
}
