import { FeaturesSection } from "@/components/homepage/FeaturesSection"
import { HeroSection } from "@/components/homepage/HeroSection"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <HeroSection />
      <FeaturesSection />
    </main>
  )
}
