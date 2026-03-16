import { Shield } from "lucide-react"

export function TrustSection() {
  return (
    <section className="py-20 lg:py-28">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex p-4 rounded-full gold-gradient-bg mb-8">
            <Shield className="h-8 w-8 text-primary-foreground" />
          </div>
          <blockquote className="text-2xl md:text-3xl lg:text-4xl font-medium leading-relaxed text-balance">
            <span className="gold-gradient">
              &ldquo;If we don&apos;t fulfill a golden promise on time, you won&apos;t be charged for the tardiness.&rdquo;
            </span>
          </blockquote>
        </div>
      </div>
    </section>
  )
}
