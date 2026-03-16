import Link from "next/link"

export function CtaSection() {
  return (
    <section className="py-20 lg:py-28">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold text-balance">
            Ready to build something?
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
  )
}
