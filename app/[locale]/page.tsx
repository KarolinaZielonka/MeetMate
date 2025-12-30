import { HeroSection } from "@/components/homepage/HeroSection"
import { FeaturesSection } from "@/components/homepage/FeaturesSection"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <HeroSection />
      <FeaturesSection />
    </main>
  )
}
