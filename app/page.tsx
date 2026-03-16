import Link from "next/link"
import { HeroSection } from "@/components/home/hero-section"
import { FeaturesSection } from "@/components/home/features-section"
import { TrustSection } from "@/components/home/trust-section"
import { CtaSection } from "@/components/home/cta-section"

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <div className="gold-divider" />
      <FeaturesSection />
      <div className="gold-divider" />
      <TrustSection />
      <div className="gold-divider" />
      <CtaSection />
    </div>
  )
}
