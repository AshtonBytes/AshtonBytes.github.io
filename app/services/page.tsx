import type { Metadata } from "next"
import Link from "next/link"
import { Check, PenTool } from "lucide-react"

export const metadata: Metadata = {
  title: "Services — Aurivara",
  description: "Three packages. No surprises. Full ownership. Custom website packages starting at $350 for small businesses.",
}

const packages = [
  {
    name: "Starter",
    price: "$350",
    delivery: "7 days delivery",
    features: [
      "5 pages",
      "Contact form",
      "Mobile responsive",
      "Source code",
      "1 revision",
    ],
  },
  {
    name: "Standard",
    price: "$550",
    delivery: "10 days delivery",
    features: [
      "Everything in Starter",
      "Google Maps integration",
      "Basic SEO optimization",
      "Markdown blog",
      "3 revisions",
    ],
  },
  {
    name: "Advanced",
    price: "$1,100",
    delivery: "14 days delivery",
    features: [
      "Everything in Standard",
      "7 pages",
      "Sanity CMS",
      "PocketBase backend",
      "Image gallery",
      "Email notifications",
      "Admin dashboard",
      "Database storage",
      "5 revisions",
    ],
  },
]

export default function ServicesPage() {
  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 gold-gradient text-balance">
              Our Services
            </h1>
            <p className="text-xl text-muted-foreground">
              Three packages. No surprises. Full ownership.
            </p>
          </div>
        </div>
      </section>

      <div className="gold-divider" />

      {/* Pricing Cards */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {packages.map((pkg, index) => (
              <div
                key={index}
                className="relative flex flex-col p-8 rounded-xl bg-card border border-border hover:border-gold/50 transition-colors"
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-bold gold-gradient">{pkg.name}</h2>
                  <p className="text-sm text-muted-foreground mt-1">{pkg.delivery}</p>
                </div>
                <div className="mb-8">
                  <span className="text-4xl font-bold">{pkg.price}</span>
                </div>
                <ul className="space-y-4 flex-1">
                  {pkg.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <div className="shrink-0 mt-0.5">
                        <Check className="h-5 w-5 text-gold" />
                      </div>
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/contact"
                  className="mt-8 inline-flex items-center justify-center px-6 py-3 text-sm font-semibold btn-secondary rounded-md"
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="gold-divider" />

      {/* Add-on Card */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <div className="p-8 rounded-xl bg-card border border-border">
              <div className="flex items-start gap-6">
                <div className="p-4 rounded-lg gold-gradient-bg shrink-0">
                  <PenTool className="h-6 w-6 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                    <h3 className="text-xl font-bold gold-gradient">Copywriting & Content</h3>
                    <span className="text-lg font-semibold">+$150</span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Professional copy written for every page. Adds 3 days to delivery time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="gold-divider" />

      {/* CTA */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold text-balance">
              Ready to get started?
            </h2>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-10 py-4 text-lg font-semibold btn-primary rounded-md"
            >
              Get a Quote
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
